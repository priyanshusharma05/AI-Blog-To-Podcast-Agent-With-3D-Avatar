"""
routers/chat.py — Chatbot endpoint for podcast script Q&A.

POST /api/chat
  - Accepts a user message, optional episode_id, and conversation history
  - If episode_id is provided, fetches the script from MongoDB as context
  - Calls the Groq-powered chatbot and returns the answer + suggestions
"""

from __future__ import annotations

import asyncio

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status

from auth_utils import get_current_user_id
from database import get_db
from models import ChatRequest, ChatResponse
from services.chatbot import chat

router = APIRouter(prefix="/api/chat", tags=["Chat"])


async def _run_in_thread(func, *args):
    """Run a blocking function in a thread pool."""
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, func, *args)


@router.post("/", response_model=ChatResponse, status_code=status.HTTP_200_OK)
async def chat_endpoint(
    body: ChatRequest,
    current_user_id: str = Depends(get_current_user_id),
):
    """
    Chat with the VoiceCast AI assistant about a podcast script.

    - If ``episode_id`` is provided, the episode's script is loaded from
      MongoDB and used as context for the conversation.
    - ``history`` maintains multi-turn conversation state from the client.
    """

    script_context = ""

    # ── Fetch script context from MongoDB if episode_id given ───────────────
    if body.episode_id:
        db = get_db()
        try:
            oid = ObjectId(body.episode_id)
        except Exception:
            raise HTTPException(
                status_code=400, detail="Invalid episode_id format."
            )

        doc = await db.episodes.find_one({"_id": oid, "user_id": current_user_id})
        if not doc:
            raise HTTPException(
                status_code=404, detail="Episode not found."
            )
        script_context = doc.get("script", "")

    # ── Convert Pydantic ChatMessage objects to plain dicts ───────────────────
    history_dicts = [
        {"role": msg.role, "content": msg.content}
        for msg in (body.history or [])
    ]

    # ── Call chatbot (blocking Groq call → thread pool) ─────────────────────
    try:
        result = await _run_in_thread(
            chat,
            body.message,
            script_context,
            history_dicts,
        )
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Chat error: {exc}")

    return ChatResponse(
        answer=result["answer"],
        suggestions=result["suggestions"],
    )
