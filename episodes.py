from __future__ import annotations

from datetime import datetime, timezone
from typing import Literal

from pydantic import BaseModel, Field


class EpisodeModel(BaseModel):
    id: str
    title: str
    desc: str
    script: str
    status: Literal["ready", "draft", "generating"] = "ready"
    date: str
    duration: str = "~5 min"
    views: int = 0
    tags: list[str] = Field(default_factory=list)
    user_id: str
    audio_url: str | None = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class EpisodePatch(BaseModel):
    title: str | None = None
    tags: list[str] | None = None
    status: Literal["ready", "draft"] | None = None
