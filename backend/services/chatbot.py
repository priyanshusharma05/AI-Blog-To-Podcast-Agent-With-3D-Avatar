"""
services/chatbot.py - Gemini-powered Q&A over generated podcast scripts.
Updated using the script-first host chat pattern from Model/chat_with_host.py.
"""

from __future__ import annotations

from services.ai import call_gemini

MAX_SCRIPT_CHARS = 20000
SYSTEM_PROMPT = (
    "You are VoiceCast AI Assistant, speaking like a helpful podcast host.\n"
    "Answer questions about the generated podcast script clearly and naturally.\n"
    "Use the podcast script as your primary source when it is available.\n"
    "If the script does not fully answer the question, say what the script covers and "
    "then give a helpful general explanation without inventing script details.\n"
    "Keep replies concise, friendly, and useful for a listener."
)


def chat(
    user_message: str,
    script_context: str = "",
    history: list[dict[str, str]] | None = None,
) -> dict:
    """Answer a user message with optional script-first context and conversation history."""
    if not user_message or not user_message.strip():
        raise ValueError("User message cannot be empty.")

    history = history or []
    parts: list[str] = [SYSTEM_PROMPT]

    if script_context and script_context.strip():
        parts.append("\nPodcast script context:")
        parts.append(script_context.strip()[:MAX_SCRIPT_CHARS])

    if history:
        parts.append("\nConversation history:")
        for entry in history:
            label = "User" if entry["role"] == "user" else "Assistant"
            parts.append(f"{label}: {entry['content']}")

    parts.append(f"\nUser: {user_message.strip()}")
    parts.append("Assistant:")

    reply = call_gemini("\n".join(parts))
    if not reply:
        raise RuntimeError(
            "Chatbot received an empty response from Gemini. Check your GEMINI_API_KEY."
        )

    updated_history = list(history)
    updated_history.append({"role": "user", "content": user_message.strip()})
    updated_history.append({"role": "assistant", "content": reply})
    return {"reply": reply, "history": updated_history}
