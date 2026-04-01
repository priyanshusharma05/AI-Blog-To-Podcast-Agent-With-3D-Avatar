"""
routers/podcast.py — Blog-to-podcast generation endpoint.

POST /api/podcast/generate
  - Accepts blog URL or raw text
  - Scrapes → cleans → chunks → Gemini script → intro/outro
  - Saves the resulting episode to MongoDB 'episodes' collection
  - Returns the script and episode metadata
"""

from __future__ import annotations

import asyncio
from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, BackgroundTasks, HTTPException, status

from database import get_db
from models import GenerateRequest, GenerateResponse
from services.ai import generate_intro_outro, generate_script_from_chunks
from services.scraper import fetch_text_from_url
from services.text_processor import clean_text, split_into_chunks
from services.tts import generate_audio

router = APIRouter(prefix="/api/podcast", tags=["Podcast"])


async def _run_in_thread(func, *args):
    """Run a blocking function in a thread pool to avoid blocking the event loop."""
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, func, *args)


async def _generate_audio_background(episode_id: str, script: str):
    """Background task: generate MP3 audio and update the episode in MongoDB."""
    try:
        # Run blocking TTS in thread pool
        _final_path, duration_min = await _run_in_thread(generate_audio, script, episode_id)
        audio_url = f"/api/audio/{episode_id}.mp3"
        db = get_db()
        await db.episodes.update_one(
            {"_id": ObjectId(episode_id)},
            {"$set": {
                "audio_url": audio_url,
                "status": "ready",
                "duration": f"{duration_min} min",
            }},
        )
        print(f"✅ Audio ready for episode {episode_id}: {audio_url}")
    except Exception as exc:
        print(f"❌ Audio generation failed for {episode_id}: {exc}")
        db = get_db()
        await db.episodes.update_one(
            {"_id": ObjectId(episode_id)},
            {"$set": {"status": "ready", "audio_error": str(exc)}},
        )


@router.post("/generate", response_model=GenerateResponse, status_code=status.HTTP_200_OK)
async def generate_episode(body: GenerateRequest, background_tasks: BackgroundTasks):
    """
    Full AI pipeline:
    1. Fetch/validate blog content (URL scrape OR raw text)
    2. Clean and chunk the text
    3. Generate podcast script via Gemini (chunk by chunk with context)
    4. Add intro & outro
    5. Save episode to MongoDB
    6. Return episode_id + script
    """

    # ── 1. Get source text ──────────────────────────────────────────────────
    if body.url:
        try:
            raw_text = await _run_in_thread(fetch_text_from_url, body.url)
        except ValueError as exc:
            raise HTTPException(status_code=422, detail=str(exc))
    elif body.text and body.text.strip():
        raw_text = body.text.strip()
    else:
        raise HTTPException(
            status_code=422,
            detail="Provide either 'url' (blog URL) or 'text' (raw content).",
        )

    # ── 2. Clean & chunk ────────────────────────────────────────────────────
    cleaned = clean_text(raw_text)
    if not cleaned:
        raise HTTPException(
            status_code=422,
            detail="No usable text found after cleaning. Try a different URL.",
        )

    chunks = split_into_chunks(cleaned)

    # ── 3 & 4. Generate script (blocking Gemini calls → thread pool) ────────
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
            detail="Script generation returned empty. Check your GEMINI_API_KEY.",
        )

    # ── 5. Save to MongoDB ──────────────────────────────────────────────────
    db = get_db()

    # Build a short description from the first 120 chars of the script
    desc = final_script[:120].rsplit(" ", 1)[0] + "…"

    # Determine title
    episode_title = (body.title or "").strip() or (
        f"Episode – {body.url}" if body.url else "AI Generated Episode"
    )

    # Estimate rough reading time (avg ~150 wpm for podcasts)
    word_count = len(final_script.split())
    duration_min = max(1, round(word_count / 150))
    duration_str = f"{duration_min} min"

    # Derive tags from voice tone
    tags = ["AI", "Generated", body.voice_tone]

    # Placeholder user_id — in a real app extract from JWT token
    user_id = "anonymous"

    episode_doc = {
        "title": episode_title,
        "desc": desc,
        "script": final_script,
        "status": "generating",
        "date": datetime.now(timezone.utc).strftime("%b %d, %Y"),
        "duration": duration_str,
        "views": 0,
        "tags": tags,
        "user_id": user_id,
        "voice_tone": body.voice_tone,
        "source_url": body.url or "",
        "audio_url": "",
        "created_at": datetime.now(timezone.utc),
    }

    result = await db.episodes.insert_one(episode_doc)
    episode_id = str(result.inserted_id)

    # Kick off audio generation in the background
    background_tasks.add_task(_generate_audio_background, episode_id, final_script)

    return GenerateResponse(
        episode_id=episode_id,
        title=episode_title,
        script=final_script,
        status="generating",
    )
