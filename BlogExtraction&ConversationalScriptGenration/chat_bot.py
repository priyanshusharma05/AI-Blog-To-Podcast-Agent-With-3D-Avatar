"""
chat_bot.py — Gemini-powered conversational chatbot for podcast scripts.

Lets users ask questions about a generated podcast script, request
edits, or get summaries — all powered by the same Gemini API used
for script generation.

Usage (standalone):
    python chat_bot.py

Usage (as module):
    from chat_bot import chat, create_history
    history = create_history()
    result  = chat("Summarize this podcast", script_context, history)
    print(result["reply"])
    history = result["history"]   # pass back on next call
"""

from __future__ import annotations

from podcast_generator import call_gemini

# ── System prompt template ──────────────────────────────────────────────────

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


def create_history() -> list[dict[str, str]]:
    """Return a fresh, empty conversation history."""
    return []


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
        The podcast script to use as context for the conversation.
    history : list[dict], optional
        Previous conversation history — a list of
        ``{"role": "user"|"assistant", "content": str}`` dicts.

    Returns
    -------
    dict
        {
            "reply": str,          # the assistant's response
            "history": list[dict], # updated conversation history
        }

    Raises
    ------
    ValueError
        If the user message is empty.
    RuntimeError
        If the Gemini API call fails.
    """
    if not user_message or not user_message.strip():
        raise ValueError("User message cannot be empty.")

    if history is None:
        history = create_history()

    # ── Build the prompt ────────────────────────────────────────────────────
    prompt_parts: list[str] = [SYSTEM_PROMPT]

    if script_context and script_context.strip():
        prompt_parts.append(
            f"\n--- PODCAST SCRIPT CONTEXT ---\n"
            f"{script_context.strip()}\n"
            f"--- END SCRIPT CONTEXT ---\n"
        )

    # Append conversation history
    if history:
        prompt_parts.append("\n--- CONVERSATION HISTORY ---")
        for entry in history:
            role_label = "User" if entry["role"] == "user" else "Assistant"
            prompt_parts.append(f"{role_label}: {entry['content']}")
        prompt_parts.append("--- END HISTORY ---\n")

    # Append the current user message
    prompt_parts.append(f"User: {user_message.strip()}")
    prompt_parts.append("\nAssistant:")

    full_prompt = "\n".join(prompt_parts)

    # ── Call Gemini ─────────────────────────────────────────────────────────
    reply = call_gemini(full_prompt)

    if not reply:
        raise RuntimeError(
            "Chatbot received an empty response from Gemini. "
            "Check your GEMINI_API_KEY environment variable."
        )

    # ── Update history ──────────────────────────────────────────────────────
    updated_history = list(history)
    updated_history.append({"role": "user", "content": user_message.strip()})
    updated_history.append({"role": "assistant", "content": reply})

    return {
        "reply": reply,
        "history": updated_history,
    }


# ── Standalone interactive mode ─────────────────────────────────────────────
if __name__ == "__main__":
    print("🎙️  VoiceCast AI Chatbot")
    print("Type your messages below. Type 'quit' or 'exit' to stop.\n")

    history = create_history()
    script = ""

    # Optionally load a script file for context
    try:
        from pathlib import Path

        script_path = Path("data") / "final_podcast_script.txt"
        if script_path.exists():
            script = script_path.read_text(encoding="utf-8")
            print(f"📄  Loaded script context from {script_path}")
            print(f"    ({len(script)} characters)\n")
        else:
            print("ℹ️   No script file found at data/final_podcast_script.txt")
            print("    Chatbot will run without script context.\n")
    except Exception:
        pass

    while True:
        try:
            user_input = input("You: ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\nGoodbye! 👋")
            break

        if not user_input:
            continue
        if user_input.lower() in {"quit", "exit"}:
            print("Goodbye! 👋")
            break

        try:
            result = chat(user_input, script_context=script, history=history)
            history = result["history"]
            print(f"\nAssistant: {result['reply']}\n")
        except (ValueError, RuntimeError) as exc:
            print(f"\n❌  Error: {exc}\n")