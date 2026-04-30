"""
backend.models package - Pydantic schemas grouped by domain.
"""

from .auth import AuthResponse, LoginRequest, SignupRequest, UserPublic
from .chat import ChatMessage, ChatRequest, ChatResponse
from .episodes import EpisodeModel, EpisodePatch
from .podcast import GenerateRequest, GenerateResponse

__all__ = [
    "AuthResponse",
    "LoginRequest",
    "SignupRequest",
    "UserPublic",
    "ChatMessage",
    "ChatRequest",
    "ChatResponse",
    "EpisodeModel",
    "EpisodePatch",
    "GenerateRequest",
    "GenerateResponse",
]
