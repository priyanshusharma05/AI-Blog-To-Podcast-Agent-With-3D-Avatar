"""
services/chatbot.py - Groq-powered Q&A over generated podcast scripts.
Updated using the script-first host chat pattern from Model/chat_with_host.py.
"""

from __future__ import annotations

import re

from services.ai import call_groq

MAX_SCRIPT_CHARS = 20000
SYSTEM_PROMPT = (
    "You are VoiceCast AI Assistant, speaking like a helpful podcast host.\n"
    "Answer questions about the generated podcast script clearly and naturally.\n"
    "Use the podcast script as your primary source when it is available.\n"
    "If the script does not fully answer the question, say what the script covers and "
    "then give a helpful general explanation without inventing script details.\n"
    "Keep replies concise, friendly, and useful for a listener."
)
SUGGESTION_PROMPT = (
    "Based only on the podcast script and the assistant's answer, suggest 2 to 3 "
    "short follow-up questions a listener may ask next.\n"
    "Keep each question under 10 words.\n"
    "Return only the questions, one per line. Do not add numbering or bullets."
)


def _clean_suggestions(raw_text: str) -> list[str]:
    """Normalize model output into 2-3 short question suggestions."""
    suggestions: list[str] = []
    for line in raw_text.splitlines():
        cleaned = re.sub(r"^[-*\d.)\s]+", "", line).strip().strip('"')
        if not cleaned:
            continue
        if not cleaned.endswith("?"):
            cleaned = f"{cleaned.rstrip('.') }?"
        if cleaned not in suggestions:
            suggestions.append(cleaned)
        if len(suggestions) == 3:
            break
    return suggestions


def _generate_suggestions(
    user_message: str,
    answer: str,
    script_context: str,
) -> list[str]:
    """Generate short follow-up questions grounded in the podcast script."""
    if not script_context.strip():
        return []

    prompt = (
        f"{SUGGESTION_PROMPT}\n\n"
        f"Podcast script context:\n{script_context.strip()[:MAX_SCRIPT_CHARS]}\n\n"
        f"User question:\n{user_message.strip()}\n\n"
        f"Assistant answer:\n{answer.strip()}"
    )
    raw_suggestions = call_groq(prompt)
    return _clean_suggestions(raw_suggestions)


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

    answer = call_groq("\n".join(parts))
    if not answer:
        raise RuntimeError(
            "Chatbot received an empty response from Groq. Check your GROQ_API_KEY."
        )

    suggestions = _generate_suggestions(user_message, answer, script_context)
    return {"answer": answer, "suggestions": suggestions}
