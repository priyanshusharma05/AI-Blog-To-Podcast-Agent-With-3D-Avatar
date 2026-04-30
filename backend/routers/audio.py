"""
routers/audio.py — Serve generated podcast MP3 files and check audio status.

Endpoints:
    GET /api/audio/{episode_id}.mp3   — Stream the generated MP3
    GET /api/audio/{episode_id}/status — Check if audio generation is complete
"""

from __future__ import annotations

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from services.tts import get_audio_path

router = APIRouter(prefix="/api/audio", tags=["Audio"])


@router.get("/{episode_id}.mp3")
async def serve_audio(episode_id: str):
    """Serve the generated MP3 file for a given episode."""
    audio_path = get_audio_path(episode_id)
    if not audio_path:
        raise HTTPException(
            status_code=404,
            detail="Audio not found. It may still be generating.",
        )
    return FileResponse(
        path=str(audio_path),
        media_type="audio/mpeg",
        filename=f"{episode_id}.mp3",
    )


@router.get("/{episode_id}/status")
async def audio_status(episode_id: str):
    """Check whether the audio file for an episode is ready."""
    audio_path = get_audio_path(episode_id)
    if audio_path:
        return {"status": "ready", "audio_url": f"/api/audio/{episode_id}.mp3"}
    return {"status": "generating"}
