import os
import re
from pathlib import Path
from urllib.parse import urlparse

import requests
import trafilatura
from gtts import gTTS
from pydub import AudioSegment
from pydub.effects import speedup
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "..", "backend", ".env"))


INPUT_URL = "https://www.bbc.com/news/live/c24d410m3g4t"
INPUT_FILE_PATH = ""
GEMINI_MODEL = "gemini-2.5-flash"

DATA_DIR = Path("data")
EXTRACTED_BLOG_PATH = DATA_DIR / "extracted_blog.txt"
BLOG_CHUNKS_PATH = DATA_DIR / "blog_chunks.txt"
PODCAST_SCRIPT_PATH = DATA_DIR / "podcast_script.txt"
FINAL_PODCAST_SCRIPT_PATH = DATA_DIR / "final_podcast_script.txt"
TTS_SEGMENTS_PATH = DATA_DIR / "tts_segments.txt"
OUTPUT_DIR = DATA_DIR / "audio_segments"
MERGED_OUTPUT_FILE = DATA_DIR / "podcast_episode.mp3"

TTS_MIN_SEGMENT_LENGTH = 200
TTS_MAX_SEGMENT_LENGTH = 350
LANGUAGE = "en"
ENABLE_SPEEDUP = True
PLAYBACK_SPEED = 1.20


def is_url(value: str) -> bool:
    parsed = urlparse(value)
    return parsed.scheme in {"http", "https"} and bool(parsed.netloc)


def is_text_file_path(value: str) -> bool:
    path = Path(value).expanduser()
    return path.is_file() and path.suffix.lower() == ".txt"


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


def clean_text(text: str) -> str:
    text = re.sub(r"https?://\S+", "", text)

    seen_lines: set[str] = set()
    cleaned_lines: list[str] = []

    for line in text.splitlines():
        normalized_line = " ".join(line.split()).strip()
        if not normalized_line or normalized_line in seen_lines:
            continue
        seen_lines.add(normalized_line)
        cleaned_lines.append(normalized_line)

    cleaned_text = "\n".join(cleaned_lines)
    return re.sub(r"\s+", " ", cleaned_text).strip()


def split_into_sentences(text: str) -> list[str]:
    normalized_text = " ".join(text.split()).strip()
    if not normalized_text:
        return []

    sentences = re.split(r"(?<=[.!?])\s+", normalized_text)
    return [sentence.strip() for sentence in sentences if sentence.strip()]


def split_into_chunks(text: str, chunk_size: int = 3000) -> list[str]:
    normalized_text = " ".join(text.split()).strip()
    if not normalized_text:
        return []
    if chunk_size <= 0:
        raise ValueError("chunk_size must be greater than 0.")

    words = normalized_text.split()
    chunks: list[str] = []
    current_chunk: list[str] = []
    current_length = 0

    for word in words:
        additional_length = len(word) if not current_chunk else len(word) + 1
        if current_chunk and current_length + additional_length > chunk_size:
            chunks.append(" ".join(current_chunk))
            current_chunk = [word]
            current_length = len(word)
            continue

        current_chunk.append(word)
        current_length += additional_length

    if current_chunk:
        chunks.append(" ".join(current_chunk))

    return chunks


def call_gemini(prompt: str) -> str:
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not api_key:
        api_keys = os.getenv("GEMINI_API_KEYS", "").strip()
        if api_keys:
            api_key = api_keys.split(",")[0].strip()

    if not api_key:
        print("Error: GEMINI_API_KEY is not set.")
        return ""

    endpoint = (
        f"https://generativelanguage.googleapis.com/v1beta/models/"
        f"{GEMINI_MODEL}:generateContent?key={api_key}"
    )
    headers = {"Content-Type": "application/json"}
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt},
                ]
            }
        ]
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


def generate_script_for_chunks(chunks: list[str]) -> str:
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
    PODCAST_SCRIPT_PATH.write_text(final_script, encoding="utf-8")
    return final_script


def generate_intro_outro(script_text: str) -> str:
    if not script_text.strip():
        print("Error: Script text is empty.")
        return ""

    intro_prompt = (
        "Write a short engaging podcast intro for the following script. "
        "Set up the topic naturally and keep it concise. Only output the intro.\n\n"
        f"Script opening:\n{script_text[:1500]}"
    )
    outro_prompt = (
        "Write a short podcast outro for the following script. "
        "Wrap up the discussion naturally and keep it concise. Only output the outro.\n\n"
        f"Script ending:\n{script_text[-1500:]}"
    )

    intro = call_gemini(intro_prompt)
    outro = call_gemini(outro_prompt)

    final_podcast_script = f"{intro}\n\n{script_text}\n\n{outro}".strip()
    FINAL_PODCAST_SCRIPT_PATH.write_text(final_podcast_script, encoding="utf-8")
    return final_podcast_script


def build_tts_segments(sentences: list[str]) -> list[str]:
    segments: list[str] = []
    current_segment = ""

    for sentence in sentences:
        proposed_segment = sentence if not current_segment else f"{current_segment} {sentence}"

        if len(proposed_segment) <= TTS_MAX_SEGMENT_LENGTH:
            current_segment = proposed_segment
            continue

        if current_segment:
            segments.append(current_segment.strip())
            current_segment = sentence
        else:
            segments.append(sentence.strip())
            current_segment = ""

    if current_segment:
        segments.append(current_segment.strip())

    merged_segments: list[str] = []
    for segment in segments:
        if (
            merged_segments
            and len(segment) < TTS_MIN_SEGMENT_LENGTH
            and len(merged_segments[-1]) + 1 + len(segment) <= TTS_MAX_SEGMENT_LENGTH
        ):
            merged_segments[-1] = f"{merged_segments[-1]} {segment}"
        else:
            merged_segments.append(segment)

    return merged_segments


def save_tts_segments(segments: list[str], file_path: Path) -> None:
    file_path.parent.mkdir(parents=True, exist_ok=True)
    file_path.write_text("\n\n".join(segments), encoding="utf-8")


def load_text_segments(file_path: Path) -> list[str]:
    if not file_path.is_file():
        print(f"Error: Segments file not found: {file_path}")
        return []

    text = file_path.read_text(encoding="utf-8").strip()
    if not text:
        print(f"Error: Segments file is empty: {file_path}")
        return []

    return [segment.strip() for segment in text.split("\n\n") if segment.strip()]


def generate_audio_for_segments(segments: list[str]) -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    total_segments = len(segments)

    for index, segment in enumerate(segments, start=1):
        print(f"Generating audio for segment {index}/{total_segments}...")

        try:
            tts = gTTS(text=segment, lang=LANGUAGE, slow=False, tld="com")
            output_path = OUTPUT_DIR / f"segment_{index}.mp3"
            tts.save(str(output_path))
        except Exception as exc:
            print(f"Error: Failed to generate audio for segment {index}. {exc}")
            continue

        print(f"Saved {output_path}")


def speed_up_audio(input_path: Path, output_path: Path, speed: float) -> None:
    if speed <= 1.0:
        raise ValueError("speed must be greater than 1.0.")

    audio = AudioSegment.from_file(input_path, format="mp3")
    faster_audio = speedup(audio, playback_speed=speed, chunk_size=150, crossfade=25)
    faster_audio.export(output_path, format="mp3")


def get_segment_files(audio_dir: Path = OUTPUT_DIR) -> list[Path]:
    if not audio_dir.is_dir():
        print(f"Error: Audio folder not found: {audio_dir}")
        return []

    segment_files = sorted(
        audio_dir.glob("segment_*.mp3"),
        key=lambda path: int(re.search(r"segment_(\d+)\.mp3$", path.name).group(1))
        if re.search(r"segment_(\d+)\.mp3$", path.name)
        else float("inf"),
    )

    if not segment_files:
        print(f"Error: No MP3 segment files found in {audio_dir}")
        return []

    return segment_files


def speed_up_segments(audio_dir: Path = OUTPUT_DIR, speed: float = PLAYBACK_SPEED) -> None:
    if not ENABLE_SPEEDUP:
        return

    segment_files = get_segment_files(audio_dir)
    if not segment_files:
        return

    print(f"Applying speed-up at {speed}x to {len(segment_files)} segments...")
    for segment_file in segment_files:
        temp_output = segment_file.with_name(f"{segment_file.stem}_sped_up.mp3")
        speed_up_audio(segment_file, temp_output, speed)
        temp_output.replace(segment_file)
        print(f"Sped up {segment_file.name}")


def merge_audio_segments(audio_dir: Path = OUTPUT_DIR) -> None:
    segment_files = get_segment_files(audio_dir)
    if not segment_files:
        return

    merged_audio = AudioSegment.empty()
    for segment_file in segment_files:
        merged_audio += AudioSegment.from_file(segment_file, format="mp3")

    merged_audio.export(MERGED_OUTPUT_FILE, format="mp3")
    print(f"Merging complete. Saved merged episode to {MERGED_OUTPUT_FILE}")


def main() -> None:
    user_input = INPUT_URL.strip() or INPUT_FILE_PATH.strip()
    if not user_input:
        print("Error: Set INPUT_URL or INPUT_FILE_PATH before running the script.")
        return

    DATA_DIR.mkdir(parents=True, exist_ok=True)

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
    EXTRACTED_BLOG_PATH.write_text(cleaned_text, encoding="utf-8")
    BLOG_CHUNKS_PATH.write_text("\n\n".join(chunks), encoding="utf-8")
    print(f"Extracted text saved to {EXTRACTED_BLOG_PATH}")
    print(f"Blog chunks saved to {BLOG_CHUNKS_PATH}")

    podcast_script = generate_script_for_chunks(chunks)
    if not podcast_script:
        return
    print(f"Podcast script saved to {PODCAST_SCRIPT_PATH}")

    final_podcast_script = generate_intro_outro(podcast_script)
    if not final_podcast_script:
        return
    print(f"Final podcast script saved to {FINAL_PODCAST_SCRIPT_PATH}")

    tts_segments = build_tts_segments(split_into_sentences(final_podcast_script))
    save_tts_segments(tts_segments, TTS_SEGMENTS_PATH)
    print(f"Saved {len(tts_segments)} TTS segments to {TTS_SEGMENTS_PATH}")

    audio_segments = load_text_segments(TTS_SEGMENTS_PATH)
    if not audio_segments:
        return

    generate_audio_for_segments(audio_segments)
    speed_up_segments()
    merge_audio_segments()


if __name__ == "__main__":
    main()
