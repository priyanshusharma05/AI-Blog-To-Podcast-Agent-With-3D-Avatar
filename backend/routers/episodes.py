"""
routers/episodes.py — CRUD for episodes stored in MongoDB 'episodes' collection.
"""

from __future__ import annotations

from bson import ObjectId
from fastapi import APIRouter, HTTPException, status

from database import get_db
from models import EpisodeModel, EpisodePatch

router = APIRouter(prefix="/api/episodes", tags=["Episodes"])


def _serialize(doc: dict) -> dict:
    """Convert MongoDB document to JSON-serializable dict."""
    doc["id"] = str(doc.pop("_id"))
    return doc


# ─── List episodes ────────────────────────────────────────────────────────────

@router.get("/", response_model=list[dict])
async def list_episodes(user_id: str | None = None):
    """
    Return all episodes, optionally filtered by user_id query param.
    Example: GET /api/episodes?user_id=abc123
    """
    db = get_db()
    query = {}
    if user_id:
        query["user_id"] = user_id

    cursor = db.episodes.find(query).sort("created_at", -1)
    docs = await cursor.to_list(length=200)
    return [_serialize(doc) for doc in docs]


# ─── Get one episode ──────────────────────────────────────────────────────────

@router.get("/{episode_id}", response_model=dict)
async def get_episode(episode_id: str):
    db = get_db()
    try:
        oid = ObjectId(episode_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid episode ID.")

    doc = await db.episodes.find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=404, detail="Episode not found.")
    return _serialize(doc)


# ─── Update episode ───────────────────────────────────────────────────────────

@router.patch("/{episode_id}", response_model=dict)
async def update_episode(episode_id: str, body: EpisodePatch):
    db = get_db()
    try:
        oid = ObjectId(episode_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid episode ID.")

    updates = {k: v for k, v in body.model_dump().items() if v is not None}
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update.")

    result = await db.episodes.update_one({"_id": oid}, {"$set": updates})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Episode not found.")

    doc = await db.episodes.find_one({"_id": oid})
    return _serialize(doc)


# ─── Delete episode ───────────────────────────────────────────────────────────

@router.delete("/{episode_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_episode(episode_id: str):
    db = get_db()
    try:
        oid = ObjectId(episode_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid episode ID.")

    result = await db.episodes.delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Episode not found.")
