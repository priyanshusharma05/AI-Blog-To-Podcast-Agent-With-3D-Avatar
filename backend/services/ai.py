"""
services/ai.py - Groq API wrapper with retry and model fallback support.
"""

from __future__ import annotations

import os
import time
from pathlib import Path

import requests
from env_config import ENV_PATH, load_backend_env

GROQ_CHAT_COMPLETIONS_URL = "https://api.groq.com/openai/v1/chat/completions"
DEFAULT_PRIMARY_MODEL = "llama-3.3-70b-versatile"
DEFAULT_FALLBACK_MODEL = "llama-3.1-8b-instant"
RETRYABLE_STATUS_CODES = {429, 500, 503}


def _candidate_models() -> list[str]:
    """Return the ordered model list, removing duplicates and blanks."""
    primary = os.getenv("GROQ_MODEL", DEFAULT_PRIMARY_MODEL).strip()
    fallback = os.getenv("GROQ_FALLBACK_MODEL", DEFAULT_FALLBACK_MODEL).strip()

    candidates: list[str] = []
    for model in (primary, fallback):
        if model and model not in candidates:
            candidates.append(model)
    return candidates


def _extract_text(data: dict) -> str:
    """Extract generated text from a Groq chat completions response payload."""
    choices = data.get("choices", [])
    if not choices:
        return ""

    message = choices[0].get("message", {})
    content = message.get("content", "")
    if isinstance(content, str):
        return content.strip()

    if isinstance(content, list):
        return "".join(
            part.get("text", "")
            for part in content
            if isinstance(part, dict)
        ).strip()

    return ""


def call_groq(prompt: str) -> str:
    """Send a prompt to Groq and return generated text with fallback support."""
    load_backend_env(override=True)
    api_key = os.getenv("GROQ_API_KEY", "").strip()
    if not api_key:
        raise RuntimeError(
            f"GROQ_API_KEY is not set. Add it to {Path(ENV_PATH).as_posix()}."
        )

    max_retries = 3
    base_delay = 5
    last_error = "Groq API request failed."

    for model_name in _candidate_models():
        payload = {
            "model": model_name,
            "messages": [{"role": "user", "content": prompt}],
        }

        for attempt in range(max_retries):
            try:
                print(
                    f"Calling Groq ({model_name}), "
                    f"attempt {attempt + 1}/{max_retries}..."
                )
                resp = requests.post(
                    GROQ_CHAT_COMPLETIONS_URL,
                    headers={
                        "Authorization": f"Bearer {api_key}",
                        "Content-Type": "application/json",
                    },
                    json=payload,
                    timeout=90,
                )
                print(f"Response status from {model_name}: {resp.status_code}")

                if resp.status_code in RETRYABLE_STATUS_CODES:
                    error_body = resp.text[:500]
                    last_error = (
                        f"Groq API error from {model_name} "
                        f"(HTTP {resp.status_code}): {error_body}"
                    )
                    if attempt < max_retries - 1:
                        wait_seconds = base_delay * (2 ** attempt)
                        print(
                            f"Retryable Groq error from {model_name}. "
                            f"Waiting {wait_seconds}s before retry..."
                        )
                        time.sleep(wait_seconds)
                        continue
                    print(f"Switching away from {model_name} after repeated failures.")
                    break

                if resp.status_code != 200:
                    error_body = resp.text[:500]
                    raise RuntimeError(
                        f"Groq API error from {model_name} "
                        f"(HTTP {resp.status_code}): {error_body}"
                    )

                data = resp.json()
                text = _extract_text(data)
                if text:
                    return text

                last_error = (
                    f"Groq returned an empty response for model {model_name}. "
                    f"Raw payload: {str(data)[:300]}"
                )
                if attempt < max_retries - 1:
                    wait_seconds = base_delay * (2 ** attempt)
                    print(
                        f"Empty Groq response from {model_name}. "
                        f"Waiting {wait_seconds}s before retry..."
                    )
                    time.sleep(wait_seconds)
                    continue
                break

            except requests.RequestException as exc:
                last_error = f"Groq API request failed for {model_name}: {exc}"
                if attempt == max_retries - 1:
                    print(f"Switching away from {model_name} after request failures.")
                    break
                wait_seconds = base_delay * (2 ** attempt)
                print(
                    f"Groq request exception for {model_name}: {exc}. "
                    f"Waiting {wait_seconds}s before retry..."
                )
                time.sleep(wait_seconds)

    raise RuntimeError(last_error)


def generate_script_from_chunks(
    chunks: list[str], voice_tone: str = "Conversational"
) -> str:
    """
    Generate a full podcast narration from text chunks using Groq.
    Each chunk is processed sequentially with context from previous parts.
    """
    tone_guidance = {
        "Conversational": "warm, friendly, and engaging - as if speaking directly to a friend",
        "Professional": "formal, authoritative, and clear - suitable for a business audience",
        "Energetic": "lively, upbeat, and enthusiastic - keeping listeners excited",
    }.get(voice_tone, "warm and engaging")

    generated_parts: list[str] = []
    previous_script = ""

    for index, chunk in enumerate(chunks, start=1):
        prompt = (
            f"You are writing a podcast narration based on a blog article.\n"
            f"Tone: {tone_guidance}.\n"
            "Continue the narration naturally from the previous script.\n"
            "Do not repeat information already covered.\n"
            "Only output the next narration segment - no meta-commentary.\n\n"
            f"Previous Script:\n{previous_script or '[None yet]'}\n\n"
            f"Blog Section {index}:\n{chunk}"
        )
        generated = call_groq(prompt)
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

    intro = call_groq(intro_prompt)
    outro = call_groq(outro_prompt)

    return f"{intro}\n\n{script_text}\n\n{outro}".strip()


def generate_summary(script_text: str) -> str:
    """Generate a concise listener-friendly summary for a podcast script."""
    if not script_text.strip():
        return ""

    prompt = (
        "Summarize this podcast script for a listener.\n"
        "Keep it concise: 4 to 6 short bullet points.\n"
        "Focus on the main ideas and useful takeaways.\n"
        "Only output the summary.\n\n"
        f"Podcast script:\n{script_text[:20000]}"
    )
    return call_groq(prompt)
