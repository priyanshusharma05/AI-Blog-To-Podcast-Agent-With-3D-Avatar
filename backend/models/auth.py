from __future__ import annotations

from pydantic import BaseModel, Field


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
