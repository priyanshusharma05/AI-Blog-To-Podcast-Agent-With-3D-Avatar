"""
services/chatbot.py — Gemini-powered chatbot service for podcast scripts.

Provides a chat function that answers questions about generated podcast
scripts using the same Gemini API as the script generation service.
"""

from __future__ import annotations

from services.ai import call_gemini

SYSTEM_PROMPT = (
    "You are VoiceCast AI Assistant — a helpful, friendly chatbot that "
    "assists users with their AI-generated podcast scripts.\n\n"
    "Your capabilities:\n"
    "• Answer questions about the podcast script content\n"
    "• Suggest improvements or edits to the script\n"
    "• Summarize sections of the script\n"
    "• Explain topics covered in the podcast\n"
    "• Help with tone adjustments (more formal, casual, energetic, etc.)\n\n"
    "Guidelines:\n"
    "• Keep responses concise and helpful\n"
    "• If no script context is provided, you can still have a general "
    "conversation about podcasting and content creation\n"
    "• Always be encouraging and supportive\n"
    "• When suggesting edits, provide the revised text directly\n"
)


def chat(
    user_message: str,
    script_context: str = "",
    history: list[dict[str, str]] | None = None,
) -> dict:
    """
    Send a user message to the Gemini-powered chatbot and get a reply.

    Parameters
    ----------
    user_message : str
        The user's latest message.
    script_context : str, optional
        The podcast script to use as context.
    history : list[dict], optional
        Previous conversation turns as ``{"role": "user"|"assistant", "content": str}``.

    Returns
    -------
    dict
        ``{"reply": str, "history": list[dict]}``
    """
    if not user_message or not user_message.strip():
        raise ValueError("User message cannot be empty.")

    if history is None:
        history = []

    # ── Build prompt ────────────────────────────────────────────────────────
    parts: list[str] = [SYSTEM_PROMPT]

    if script_context and script_context.strip():
        parts.append(
            f"\n--- PODCAST SCRIPT CONTEXT ---\n"
            f"{script_context.strip()}\n"
            f"--- END SCRIPT CONTEXT ---\n"
        )

    if history:
        parts.append("\n--- CONVERSATION HISTORY ---")
        for entry in history:
            label = "User" if entry["role"] == "user" else "Assistant"
            parts.append(f"{label}: {entry['content']}")
        parts.append("--- END HISTORY ---\n")

    parts.append(f"User: {user_message.strip()}")
    parts.append("\nAssistant:")

    full_prompt = "\n".join(parts)

    # ── Call Gemini ─────────────────────────────────────────────────────────
    reply = call_gemini(full_prompt)

    if not reply:
        raise RuntimeError(
            "Chatbot received an empty response from Gemini. "
            "Check your GEMINI_API_KEY."
        )

    # ── Update history ──────────────────────────────────────────────────────
    updated_history = list(history)
    updated_history.append({"role": "user", "content": user_message.strip()})
    updated_history.append({"role": "assistant", "content": reply})

    return {
        "reply": reply,
        "history": updated_history,
    }
