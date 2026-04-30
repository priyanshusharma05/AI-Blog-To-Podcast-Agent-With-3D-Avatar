"""
routers/episodes.py — CRUD for episodes stored in MongoDB 'episodes' collection.
"""

from __future__ import annotations

import asyncio

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status

from auth_utils import get_current_user_id
from database import get_db
from models import EpisodeModel, EpisodePatch
from services.ai import generate_summary

router = APIRouter(prefix="/api/episodes", tags=["Episodes"])


def _serialize(doc: dict) -> dict:
    """Convert MongoDB document to JSON-serializable dict."""
    doc["id"] = str(doc.pop("_id"))
    return doc


async def _run_in_thread(func, *args):
    """Run a blocking function in a thread pool."""
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, func, *args)


# ─── List episodes ────────────────────────────────────────────────────────────

@router.get("/", response_model=list[dict])
async def list_episodes(current_user_id: str = Depends(get_current_user_id)):
    """
    Return only the episodes created by the authenticated user.
    """
    db = get_db()
    cursor = db.episodes.find({"user_id": current_user_id}).sort("created_at", -1)
    docs = await cursor.to_list(length=200)
    return [_serialize(doc) for doc in docs]


# ─── Get one episode ──────────────────────────────────────────────────────────

@router.get("/{episode_id}/summary", response_model=dict)
async def get_episode_summary(
    episode_id: str,
    current_user_id: str = Depends(get_current_user_id),
):
    """Return a cached or newly generated summary for the authenticated user's episode."""
    db = get_db()
    try:
        oid = ObjectId(episode_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid episode ID.")

    doc = await db.episodes.find_one({"_id": oid, "user_id": current_user_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Episode not found.")

    cached_summary = (doc.get("summary") or "").strip()
    if cached_summary:
        return {"summary": cached_summary}

    script = (doc.get("script") or "").strip()
    if not script:
        raise HTTPException(status_code=422, detail="Episode script is empty.")

    try:
        summary = await _run_in_thread(generate_summary, script)
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    if not summary:
        raise HTTPException(status_code=500, detail="Summary generation returned empty.")

    await db.episodes.update_one(
        {"_id": oid, "user_id": current_user_id},
        {"$set": {"summary": summary}},
    )
    return {"summary": summary}


@router.get("/{episode_id}", response_model=dict)
async def get_episode(
    episode_id: str,
    current_user_id: str = Depends(get_current_user_id),
):
    db = get_db()
    try:
        oid = ObjectId(episode_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid episode ID.")

    doc = await db.episodes.find_one({"_id": oid, "user_id": current_user_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Episode not found.")
    return _serialize(doc)


# ─── Update episode ───────────────────────────────────────────────────────────

@router.patch("/{episode_id}", response_model=dict)
async def update_episode(
    episode_id: str,
    body: EpisodePatch,
    current_user_id: str = Depends(get_current_user_id),
):
    db = get_db()
    try:
        oid = ObjectId(episode_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid episode ID.")

    updates = {k: v for k, v in body.model_dump().items() if v is not None}
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update.")

    result = await db.episodes.update_one(
        {"_id": oid, "user_id": current_user_id},
        {"$set": updates},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Episode not found.")

    doc = await db.episodes.find_one({"_id": oid, "user_id": current_user_id})
    return _serialize(doc)


# ─── Delete episode ───────────────────────────────────────────────────────────

@router.delete("/{episode_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_episode(
    episode_id: str,
    current_user_id: str = Depends(get_current_user_id),
):
    db = get_db()
    try:
        oid = ObjectId(episode_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid episode ID.")

    result = await db.episodes.delete_one({"_id": oid, "user_id": current_user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Episode not found.")
