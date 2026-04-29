from __future__ import annotations

from typing import Literal

from pydantic import BaseModel


class GenerateRequest(BaseModel):
    url: str | None = None
    text: str | None = None
    title: str | None = None
    voice_tone: Literal["Conversational", "Professional", "Energetic"] = (
        "Conversational"
    )


class GenerateResponse(BaseModel):
    episode_id: str
    title: str
    script: str
    status: str = "ready"
    audio_url: str | None = None
