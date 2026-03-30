from __future__ import annotations

import os
from pathlib import Path

import requests

GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
MAX_SCRIPT_CHARS = 20000


def load_podcast_script(script_path: str) -> str:
    """Load podcast script content from a text file."""
    path = Path(script_path).expanduser()

    try:
        script_text = path.read_text(encoding="utf-8").strip()
    except FileNotFoundError:
        print(f"Error: Script file not found: {path}")
        return ""
    except OSError as exc:
        print(f"Error: Unable to read script file. {exc}")
        return ""

    if not script_text:
        print(f"Error: Script file is empty: {path}")
        return ""

    return script_text


def call_gemini_api(user_query: str, script_content: str) -> str:
    """Send the user query and podcast script to Gemini and return its reply."""
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not api_key:
        print("Error: Set GEMINI_API_KEY before calling Gemini.")
        return ""

    if len(script_content) > MAX_SCRIPT_CHARS:
        # Keep the most relevant context bounded so the request stays lightweight.
        script_content = script_content[:MAX_SCRIPT_CHARS]

    system_prompt = (
        "You are a podcast host answering listener questions.\n"
        "Your tone should be conversational, friendly, engaging, and concise.\n"
        "Use the podcast content as primary source. If not sufficient, use your own knowledge.\n"
        "Prioritize facts supported by the podcast script when they are present.\n"
        "Do not invent specific details from the script that are not actually in it.\n"
        "If the script does not fully answer the question, give a helpful general explanation instead.\n"
        'Do not say "I don\'t know" if a useful general answer is possible.\n'
        'Start naturally with a phrase like "Great question!" or "So here\'s the thing..."\n'
        "Keep the answer to 3 to 5 lines and make it sound like you are speaking to a listener."
    )

    user_prompt = (
        f"Listener question:\n{user_query.strip()}\n\n"
        f"Podcast script:\n{script_content}"
    )

    endpoint = (
        f"https://generativelanguage.googleapis.com/v1beta/models/"
        f"{GEMINI_MODEL}:generateContent?key={api_key}"
    )
    headers = {"Content-Type": "application/json"}
    payload = {
        "generationConfig": {
            "temperature": 0.7,
        },
        "contents": [
            {
                "role": "user",
                "parts": [
                    {
                        "text": (
                            f"{system_prompt}\n\n"
                            f"{user_prompt}"
                        )
                    }
                ],
            }
        ],
    }

    try:
        response = requests.post(endpoint, headers=headers, json=payload, timeout=60)
        response.raise_for_status()
        data = response.json()
        candidates = data.get("candidates", [])
        parts = candidates[0].get("content", {}).get("parts", []) if candidates else []
        return "".join(part.get("text", "") for part in parts).strip()
    except (requests.exceptions.RequestException, ValueError, KeyError, IndexError) as exc:
        print(f"Error: Gemini request failed. {exc}")
        return ""


def chat_with_host(user_query: str, script_path: str) -> str:
    """Answer a listener question as a podcast host using script-first context."""
    script_content = load_podcast_script(script_path)
    if not script_content:
        return ""

    response = call_gemini_api(user_query, script_content)
    if response:
        print(response)
    return response


if __name__ == "__main__":
    example_script = Path("data") / "final_podcast_script.txt"
    chat_with_host(
        user_query="Who won fifa world cup 2022 and who won the golden boot in this world cup?",
        script_path=str(example_script),
    )
