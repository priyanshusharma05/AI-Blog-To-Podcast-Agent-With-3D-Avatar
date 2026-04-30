"""
routers/auth.py — Signup, Login endpoints.
Stores users in MongoDB 'users' collection (visible in Compass).
Passwords are bcrypt-hashed. Returns JWT on success.
"""

from __future__ import annotations

import os
from datetime import datetime, timedelta, timezone

import bcrypt
from bson import ObjectId
from fastapi import APIRouter, HTTPException, status
from jose import jwt

from database import get_db
from env_config import load_backend_env
from models import AuthResponse, LoginRequest, SignupRequest, UserPublic

load_backend_env()

router = APIRouter(prefix="/api/auth", tags=["Auth"])

SECRET_KEY: str = os.getenv("SECRET_KEY", "change_this_in_production_please")
ALGORITHM = "HS256"
TOKEN_EXPIRE_HOURS = 72


def _create_token(user_id: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(hours=TOKEN_EXPIRE_HOURS)
    return jwt.encode({"sub": user_id, "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)


def _hash_password(plain: str) -> str:
    return bcrypt.hashpw(plain.encode(), bcrypt.gensalt()).decode()


def _verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode(), hashed.encode())


# ─── Signup ───────────────────────────────────────────────────────────────────

@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def signup(body: SignupRequest):
    db = get_db()
    existing = await db.users.find_one({"email": body.email})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    user_doc = {
        "full_name": body.full_name.strip(),
        "email": body.email.lower().strip(),
        "password_hash": _hash_password(body.password),
        "created_at": datetime.now(timezone.utc),
    }
    result = await db.users.insert_one(user_doc)
    user_id = str(result.inserted_id)

    return AuthResponse(
        token=_create_token(user_id),
        user=UserPublic(id=user_id, full_name=body.full_name, email=body.email),
    )


# ─── Login ────────────────────────────────────────────────────────────────────

@router.post("/login", response_model=AuthResponse)
async def login(body: LoginRequest):
    db = get_db()
    user = await db.users.find_one({"email": body.email.lower().strip()})
    if not user or not _verify_password(body.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    user_id = str(user["_id"])
    return AuthResponse(
        token=_create_token(user_id),
        user=UserPublic(id=user_id, full_name=user["full_name"], email=user["email"]),
    )
