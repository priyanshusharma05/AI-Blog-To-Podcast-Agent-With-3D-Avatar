"""
models.py — Pydantic v2 request/response schemas.
"""

from __future__ import annotations

from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, Field


# ─── Auth ────────────────────────────────────────────────────────────────────

class SignupRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., min_length=5, max_length=254)
    password: str = Field(..., min_length=8, max_length=128)


class LoginRequest(BaseModel):
    email: str = Field(..., min_length=5, max_length=254)
    password: str = Field(..., min_length=1)


class UserPublic(BaseModel):
    id: str
    full_name: str
    email: str


class AuthResponse(BaseModel):
    token: str
    user: UserPublic


# ─── Podcast Generation ───────────────────────────────────────────────────────

class GenerateRequest(BaseModel):
    url: Optional[str] = None          # blog URL to scrape
    text: Optional[str] = None         # or raw text
    title: Optional[str] = None        # optional episode title
    voice_tone: Literal["Conversational", "Professional", "Energetic"] = "Conversational"


class GenerateResponse(BaseModel):
    episode_id: str
    title: str
    script: str
    status: str = "ready"


# ─── Episodes ─────────────────────────────────────────────────────────────────

class EpisodeModel(BaseModel):
    id: str
    title: str
    desc: str
    script: str
    status: Literal["ready", "draft", "generating"] = "ready"
    date: str
    duration: str = "~5 min"
    views: int = 0
    tags: list[str] = []
    user_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


class EpisodePatch(BaseModel):
    title: Optional[str] = None
    tags: Optional[list[str]] = None
    status: Optional[Literal["ready", "draft"]] = None


# ─── Chat ─────────────────────────────────────────────────────────────────────

class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=5000)
    episode_id: Optional[str] = None
    history: list[ChatMessage] = []


class ChatResponse(BaseModel):
    reply: str
    history: list[ChatMessage]
