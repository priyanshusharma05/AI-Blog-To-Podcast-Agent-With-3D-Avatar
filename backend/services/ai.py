"""
services/ai.py — Gemini 2.5 Flash API wrapper.
Adapted from BlogExtraction&ConversationalScriptGenration/podcast_generator.py.
"""

from __future__ import annotations

import os

import requests
from dotenv import load_dotenv

GEMINI_MODEL = "gemini-2.5-flash"


def call_gemini(prompt: str) -> str:
    """Send a prompt to Gemini and return the generated text."""
    # Re-read .env every call so updating the key doesn't require a server restart
    load_dotenv(override=True)
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not api_key:
        raise RuntimeError(
            "GEMINI_API_KEY is not set. Add it to backend/.env"
        )

    endpoint = (
        f"https://generativelanguage.googleapis.com/v1beta/models/"
        f"{GEMINI_MODEL}:generateContent?key={api_key}"
    )
    payload = {
        "contents": [{"parts": [{"text": prompt}]}]
    }

    try:
        resp = requests.post(
            endpoint,
            headers={"Content-Type": "application/json"},
            json=payload,
            timeout=90,
        )
        resp.raise_for_status()
        data = resp.json()
        candidates = data.get("candidates", [])
        parts = (
            candidates[0].get("content", {}).get("parts", [])
            if candidates
            else []
        )
        return "".join(p.get("text", "") for p in parts).strip()
    except (requests.RequestException, ValueError, KeyError, IndexError) as exc:
        raise RuntimeError(f"Gemini API request failed: {exc}") from exc


def generate_script_from_chunks(
    chunks: list[str], voice_tone: str = "Conversational"
) -> str:
    """
    Generate a full podcast narration from text chunks using Gemini.
    Each chunk is processed sequentially with context from previous parts.
    """
    tone_guidance = {
        "Conversational": "warm, friendly, and engaging — as if speaking directly to a friend",
        "Professional": "formal, authoritative, and clear — suitable for a business audience",
        "Energetic": "lively, upbeat, and enthusiastic — keeping listeners excited",
    }.get(voice_tone, "warm and engaging")

    generated_parts: list[str] = []
    previous_script = ""

    for index, chunk in enumerate(chunks, start=1):
        prompt = (
            f"You are writing a podcast narration based on a blog article.\n"
            f"Tone: {tone_guidance}.\n"
            "Continue the narration naturally from the previous script.\n"
            "Do not repeat information already covered.\n"
            "Only output the next narration segment — no meta-commentary.\n\n"
            f"Previous Script:\n{previous_script or '[None yet]'}\n\n"
            f"Blog Section {index}:\n{chunk}"
        )
        generated = call_gemini(prompt)
        if generated:
            generated_parts.append(generated)
            previous_script += ("\n\n" if previous_script else "") + generated

    return "\n\n".join(generated_parts)


def generate_intro_outro(script_text: str) -> str:
    """Generate a podcast intro and outro, then return the complete final script."""
    if not script_text.strip():
        return script_text

    intro_prompt = (
        "Write a short, engaging podcast intro for the following script. "
        "Set up the topic naturally and keep it under 3 sentences. Only output the intro.\n\n"
        f"Script opening:\n{script_text[:1500]}"
    )
    outro_prompt = (
        "Write a short podcast outro for the following script. "
        "Wrap up naturally and keep it under 3 sentences. Only output the outro.\n\n"
        f"Script ending:\n{script_text[-1500:]}"
    )

    intro = call_gemini(intro_prompt)
    outro = call_gemini(outro_prompt)

    return f"{intro}\n\n{script_text}\n\n{outro}".strip()
