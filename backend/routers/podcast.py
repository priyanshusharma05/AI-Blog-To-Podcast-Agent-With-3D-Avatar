"""
routers/podcast.py - Blog-to-podcast generation endpoint.

POST /api/podcast/generate
  - Accepts blog URL, raw text, or a .txt upload
  - Scrapes -> cleans -> chunks -> Groq script -> intro/outro
  - Saves the resulting episode to MongoDB 'episodes' collection
  - Returns the script and episode metadata
"""

from __future__ import annotations

import asyncio
from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request, UploadFile, status

from auth_utils import get_current_user_id
from database import get_db
from models import GenerateRequest, GenerateResponse
from services.ai import generate_intro_outro, generate_script_from_chunks
from services.scraper import fetch_text_from_url
from services.text_processor import clean_text, split_into_chunks
from services.tts import generate_audio

router = APIRouter(prefix="/api/podcast", tags=["Podcast"])

ALLOWED_UPLOAD_TYPES = {"text/plain", "application/octet-stream", ""}


async def _run_in_thread(func, *args):
    """Run a blocking function in a thread pool to avoid blocking the event loop."""
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, func, *args)


async def _generate_audio_background(episode_id: str, script: str):
    """Background task: generate MP3 audio and update the episode in MongoDB."""
    try:
        _final_path, duration_min = await _run_in_thread(generate_audio, script, episode_id)
        audio_url = f"/api/audio/{episode_id}.mp3"
        db = get_db()
        await db.episodes.update_one(
            {"_id": ObjectId(episode_id)},
            {
                "$set": {
                    "audio_url": audio_url,
                    "status": "ready",
                    "duration": f"{duration_min} min",
                }
            },
        )
        print(f"Audio ready for episode {episode_id}: {audio_url}")
    except Exception as exc:
        print(f"Audio generation failed for {episode_id}: {exc}")
        db = get_db()
        await db.episodes.update_one(
            {"_id": ObjectId(episode_id)},
            {"$set": {"status": "ready", "audio_error": str(exc)}},
        )


async def _load_upload_text(source_file: UploadFile | None) -> str:
    """Validate and decode an uploaded .txt file."""
    if source_file is None or not source_file.filename:
        return ""

    filename = source_file.filename.strip()
    if not filename.lower().endswith(".txt"):
        raise HTTPException(status_code=422, detail="Uploaded file must be a .txt file.")

    if source_file.content_type not in ALLOWED_UPLOAD_TYPES:
        raise HTTPException(status_code=422, detail="Uploaded file must be plain text.")

    file_bytes = await source_file.read()
    if not file_bytes:
        raise HTTPException(status_code=422, detail="Uploaded .txt file is empty.")

    try:
        return file_bytes.decode("utf-8")
    except UnicodeDecodeError as exc:
        raise HTTPException(
            status_code=422,
            detail="Uploaded .txt file must be UTF-8 encoded.",
        ) from exc


async def _parse_generate_request(request: Request) -> tuple[GenerateRequest, str]:
    """Parse either JSON or multipart form input into a validated request."""
    content_type = request.headers.get("content-type", "").lower()
    source_file_text = ""

    if "multipart/form-data" in content_type:
        form = await request.form()
        source_file_text = await _load_upload_text(form.get("source_file"))
        payload = {
            "url": (form.get("url") or "").strip() or None,
            "text": (form.get("text") or "").strip() or None,
            "title": (form.get("title") or "").strip() or None,
            "voice_tone": (form.get("voice_tone") or "Conversational").strip(),
        }
    else:
        try:
            incoming = await request.json()
        except Exception as exc:
            raise HTTPException(status_code=400, detail="Invalid request body.") from exc
        payload = {
            "url": incoming.get("url"),
            "text": incoming.get("text"),
            "title": incoming.get("title"),
            "voice_tone": incoming.get("voice_tone", "Conversational"),
        }

    try:
        body = GenerateRequest(**payload)
    except Exception as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    provided_sources = [
        bool(body.url and body.url.strip()),
        bool(body.text and body.text.strip()),
        bool(source_file_text.strip()),
    ]
    if sum(provided_sources) != 1:
        raise HTTPException(
            status_code=422,
            detail="Provide exactly one source: 'url', 'text', or a .txt file upload.",
        )

    return body, source_file_text.strip()


@router.post("/generate", response_model=GenerateResponse, status_code=status.HTTP_200_OK)
async def generate_episode(
    request: Request,
    background_tasks: BackgroundTasks,
    current_user_id: str = Depends(get_current_user_id),
):
    """
    Full AI pipeline:
    1. Fetch/validate source content (URL scrape OR raw text OR .txt upload)
    2. Clean and chunk the text
    3. Generate podcast script via Groq
    4. Add intro and outro
    5. Save episode to MongoDB
    6. Return episode_id and script
    """
    body, source_file_text = await _parse_generate_request(request)

    if body.url:
        try:
            raw_text = await _run_in_thread(fetch_text_from_url, body.url)
        except ValueError as exc:
            raise HTTPException(status_code=422, detail=str(exc))
    elif body.text and body.text.strip():
        raw_text = body.text.strip()
    elif source_file_text:
        raw_text = source_file_text
    else:
        raise HTTPException(
            status_code=422,
            detail="Provide a blog URL, raw text, or a .txt file upload.",
        )

    cleaned = clean_text(raw_text)
    if not cleaned:
        raise HTTPException(
            status_code=422,
            detail="No usable text found after cleaning. Try a different source.",
        )

    chunks = split_into_chunks(cleaned)

    try:
        raw_script = await _run_in_thread(
            generate_script_from_chunks, chunks, body.voice_tone
        )
        final_script = await _run_in_thread(generate_intro_outro, raw_script)
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc))

    if not final_script:
        raise HTTPException(
            status_code=500,
            detail="Script generation returned empty. Check your Groq configuration.",
        )

    db = get_db()
    desc = final_script[:120].rsplit(" ", 1)[0] + "..."

    if body.title and body.title.strip():
        episode_title = body.title.strip()
    elif body.url:
        episode_title = f"Episode - {body.url}"
    else:
        episode_title = "AI Generated Episode"

    word_count = len(final_script.split())
    duration_min = max(1, round(word_count / 150))
    duration_str = f"{duration_min} min"
    tags = ["AI", "Generated", body.voice_tone]
    episode_doc = {
        "title": episode_title,
        "desc": desc,
        "script": final_script,
        "status": "generating",
        "date": datetime.now(timezone.utc).strftime("%b %d, %Y"),
        "duration": duration_str,
        "views": 0,
        "tags": tags,
        "user_id": current_user_id,
        "voice_tone": body.voice_tone,
        "source_url": body.url or "",
        "audio_url": "",
        "created_at": datetime.now(timezone.utc),
    }

    result = await db.episodes.insert_one(episode_doc)
    episode_id = str(result.inserted_id)
    background_tasks.add_task(_generate_audio_background, episode_id, final_script)

    return GenerateResponse(
        episode_id=episode_id,
        title=episode_title,
        script=final_script,
        status="generating",
    )
