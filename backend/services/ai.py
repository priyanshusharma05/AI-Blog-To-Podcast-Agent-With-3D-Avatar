"""
services/ai.py — Gemini 2.5 Flash API wrapper with multi-key rotation.

Supports multiple API keys via GEMINI_API_KEYS (comma-separated) in .env.
When one key hits a rate limit (429), automatically rotates to the next key.
Falls back to single GEMINI_API_KEY if GEMINI_API_KEYS is not set.
"""

from __future__ import annotations

import os
import time
import threading

import requests
from dotenv import load_dotenv

GEMINI_MODEL = "gemini-2.5-flash"

# ── API Key Rotation Manager ─────────────────────────────────────────────────

class KeyRotator:
    """Thread-safe API key rotator with automatic failover on rate limits."""

    def __init__(self):
        self._keys: list[str] = []
        self._index = 0
        self._lock = threading.Lock()
        self._last_loaded = 0.0

    def _load_keys(self):
        """Load API keys from .env file."""
        load_dotenv(override=True)

        # Try GEMINI_API_KEYS first (comma-separated), then fall back to single key
        multi_keys = os.getenv("GEMINI_API_KEYS", "").strip()
        if multi_keys:
            self._keys = [k.strip() for k in multi_keys.split(",") if k.strip()]

        # Fall back to single key
        if not self._keys:
            single_key = os.getenv("GEMINI_API_KEY", "").strip()
            if single_key:
                self._keys = [single_key]

        self._last_loaded = time.time()

    def get_key(self) -> str:
        """Get the current API key."""
        with self._lock:
            # Reload keys every 60 seconds to pick up .env changes
            if time.time() - self._last_loaded > 60:
                self._load_keys()
            if not self._keys:
                self._load_keys()
            if not self._keys:
                raise RuntimeError(
                    "No Gemini API keys found. Add GEMINI_API_KEYS or "
                    "GEMINI_API_KEY to backend/.env"
                )
            return self._keys[self._index % len(self._keys)]

    def rotate(self) -> str | None:
        """Rotate to the next API key. Returns the new key, or None if all exhausted."""
        with self._lock:
            if len(self._keys) <= 1:
                return None
            self._index = (self._index + 1) % len(self._keys)
            return self._keys[self._index]

    @property
    def key_count(self) -> int:
        return len(self._keys)


# Global rotator instance
_rotator = KeyRotator()


# ── Gemini API Call with Rotation ─────────────────────────────────────────────

def call_gemini(prompt: str) -> str:
    """
    Send a prompt to Gemini and return the generated text.

    If a key hits a 429 rate limit, automatically rotates to the next key
    and retries. Tries all available keys before failing.
    """
    tried_keys = 0
    max_tries = max(_rotator.key_count, 1) + 1  # Try each key at least once + 1 retry

    last_error = None

    for attempt in range(max_tries):
        api_key = _rotator.get_key()

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

            # Rate limit hit — rotate to next key
            if resp.status_code == 429:
                tried_keys += 1
                key_label = f"...{api_key[-6:]}"
                print(f"⚠️  Key {key_label} rate-limited (429). Rotating...")

                next_key = _rotator.rotate()
                if next_key is None or tried_keys >= _rotator.key_count:
                    # All keys exhausted — wait 10s and retry the first key
                    print("⏳  All keys exhausted. Waiting 10 seconds...")
                    time.sleep(10)
                    tried_keys = 0
                continue

            resp.raise_for_status()
            data = resp.json()
            candidates = data.get("candidates", [])
            parts = (
                candidates[0].get("content", {}).get("parts", [])
                if candidates
                else []
            )
            return "".join(p.get("text", "") for p in parts).strip()

        except requests.RequestException as exc:
            last_error = exc
            # On connection errors, try next key
            if _rotator.key_count > 1:
                _rotator.rotate()
            continue

    raise RuntimeError(
        f"Gemini API failed after trying all {_rotator.key_count} key(s). "
        f"Last error: {last_error}"
    )


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
