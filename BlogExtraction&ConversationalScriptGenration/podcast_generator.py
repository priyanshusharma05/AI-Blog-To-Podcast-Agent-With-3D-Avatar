import os
from pathlib import Path
from urllib.parse import urlparse

import requests
import trafilatura
from preprocessing import clean_text, split_into_chunks

INPUT_URL = "https://theworldtravelguy.com/pyramids-of-giza/"
INPUT_FILE_PATH = ""
GEMINI_MODEL = "gemini-2.5-flash"


def fetch_text_from_url(url: str) -> str:
    if not is_url(url):
        return "Error: Invalid URL. Provide a valid http or https URL."

    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
    except requests.exceptions.RequestException as exc:
        return f"Error: Failed to fetch URL. {exc}"

    extracted_text = trafilatura.extract(
        response.text,
        url=url,
        include_links=False,
        include_formatting=False,
        favor_precision=True,
    )

    if not extracted_text:
        return "Error: Unable to extract the main article content from the provided URL."

    return extracted_text


def read_text_from_file(path: str) -> str:
    try:
        with open(path, "r", encoding="utf-8") as file:
            return file.read()
    except (FileNotFoundError, OSError):
        print("Error: File not found or invalid file path.")
        return ""


def call_gemini(prompt: str) -> str:
    """Send a prompt to Gemini 2.5 Flash API with multi-key rotation on rate limits."""
    import time

    # Load keys: try GEMINI_API_KEYS (comma-separated), then GEMINI_API_KEY
    keys_str = os.getenv("GEMINI_API_KEYS", "").strip()
    if keys_str:
        api_keys = [k.strip() for k in keys_str.split(",") if k.strip()]
    else:
        single = os.getenv("GEMINI_API_KEY", "").strip()
        api_keys = [single] if single else []

    if not api_keys:
        print("Error: No Gemini API keys found. Set GEMINI_API_KEYS or GEMINI_API_KEY.")
        return ""

    headers = {"Content-Type": "application/json"}
    payload = {"contents": [{"parts": [{"text": prompt}]}]}

    for attempt in range(len(api_keys) + 1):
        key = api_keys[attempt % len(api_keys)]
        endpoint = (
            f"https://generativelanguage.googleapis.com/v1beta/models/"
            f"{GEMINI_MODEL}:generateContent?key={key}"
        )
        try:
            response = requests.post(endpoint, headers=headers, json=payload, timeout=60)

            if response.status_code == 429:
                print(f"⚠️  Key ...{key[-6:]} rate-limited. Trying next key...")
                if attempt >= len(api_keys) - 1:
                    print("⏳  All keys exhausted. Waiting 10 seconds...")
                    time.sleep(10)
                continue

            response.raise_for_status()
            data = response.json()
            candidates = data.get("candidates", [])
            parts = candidates[0].get("content", {}).get("parts", []) if candidates else []
            return "".join(part.get("text", "") for part in parts).strip()
        except (requests.exceptions.RequestException, ValueError, KeyError, IndexError) as exc:
            print(f"Error: Gemini request failed. {exc}")
            return ""

    return ""


def generate_script_for_chunks(chunks: list[str]) -> str:
    """Generate a podcast script from text chunks using the Gemini 2.5 Flash API."""
    generated_parts: list[str] = []
    previous_script = ""

    for index, chunk in enumerate(chunks, start=1):
        prompt = (
            "You are writing a podcast narration based on a blog article.\n"
            "Continue the narration naturally from the previous script.\n"
            "Do not repeat information already covered.\n"
            "Keep the tone conversational and suitable for spoken audio.\n"
            "Only output the next narration segment.\n\n"
            f"Previous Script:\n{previous_script or '[None yet]'}\n\n"
            f"Blog Section {index}:\n{chunk}"
        )
        generated_text = call_gemini(prompt)

        if generated_text:
            generated_parts.append(generated_text)
            previous_script += ("\n\n" if previous_script else "") + generated_text

    final_script = "\n\n".join(generated_parts)
    output_path = Path("data") / "podcast_script.txt"
    output_path.write_text(final_script, encoding="utf-8")
    return final_script


def generate_intro_outro(script_text: str) -> str:
    """Generate podcast intro and outro from the main script and save the final combined script."""
    if not script_text.strip():
        print("Error: Script text is empty.")
        return ""

    intro_source = script_text[:1500]
    outro_source = script_text[-1500:]

    intro_prompt = (
        "Write a short engaging podcast intro for the following script. "
        "Set up the topic naturally and keep it concise. Only output the intro.\n\n"
        f"Script opening:\n{intro_source}"
    )
    outro_prompt = (
        "Write a short podcast outro for the following script. "
        "Wrap up the discussion naturally and keep it concise. Only output the outro.\n\n"
        f"Script ending:\n{outro_source}"
    )

    intro = call_gemini(intro_prompt)
    outro = call_gemini(outro_prompt)

    final_podcast_script = f"{intro}\n\n{script_text}\n\n{outro}".strip()
    output_path = Path("data") / "final_podcast_script.txt"
    output_path.write_text(final_podcast_script, encoding="utf-8")
    return final_podcast_script


def is_url(value: str) -> bool:
    parsed = urlparse(value)
    return parsed.scheme in {"http", "https"} and bool(parsed.netloc)


def is_text_file_path(value: str) -> bool:
    path = Path(value).expanduser()
    return path.is_file() and path.suffix.lower() == ".txt"


def main() -> None:
    user_input = INPUT_URL.strip() or INPUT_FILE_PATH.strip()

    if is_url(user_input):
        extracted_text = fetch_text_from_url(user_input)
    elif is_text_file_path(user_input):
        extracted_text = read_text_from_file(user_input)
    else:
        print("Invalid input. Set INPUT_URL or INPUT_FILE_PATH to a valid source.")
        return

    if not extracted_text:
        return

    cleaned_text = clean_text(extracted_text)

    if not cleaned_text:
        print("Error: No usable text remained after cleaning.")
        return

    chunks = split_into_chunks(cleaned_text)

    print(f"Text length: {len(cleaned_text)} characters")
    print("First 200 characters:")
    print(cleaned_text[:200])
    print(f"Number of chunks created: {len(chunks)}")

    data_dir = Path("data")
    data_dir.mkdir(exist_ok=True)

    output_path = data_dir / "extracted_blog.txt"
    output_path.write_text(cleaned_text, encoding="utf-8")
    print(f"Extracted text saved to {output_path}")

    chunks_output_path = data_dir / "blog_chunks.txt"
    chunks_output_path.write_text("\n\n".join(chunks), encoding="utf-8")
    print(f"Blog chunks saved to {chunks_output_path}")

    final_script = generate_script_for_chunks(chunks)
    if final_script:
        print("Podcast script saved to data\\podcast_script.txt")
        final_podcast_script = generate_intro_outro(final_script)
        if final_podcast_script:
            print("Final podcast script saved to data\\final_podcast_script.txt")


if __name__ == "__main__":
    main()
