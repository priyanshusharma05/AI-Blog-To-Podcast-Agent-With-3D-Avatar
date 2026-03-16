from pathlib import Path
import re

INPUT_FILE = Path("data") / "final_podcast_script.txt"
OUTPUT_FILE = Path("data") / "tts_segments.txt"
MIN_SEGMENT_LENGTH = 200
MAX_SEGMENT_LENGTH = 350


def load_script(file_path: Path) -> str:
    """Load the final podcast script from disk."""
    if not file_path.is_file():
        print(f"Error: Input file not found: {file_path}")
        return ""
    return file_path.read_text(encoding="utf-8").strip()


def split_into_sentences(text: str) -> list[str]:
    """Split text into sentences using punctuation boundaries."""
    normalized_text = " ".join(text.split()).strip()
    if not normalized_text:
        return []
    sentences = re.split(r"(?<=[.!?])\s+", normalized_text)
    return [sentence.strip() for sentence in sentences if sentence.strip()]


def build_tts_segments(sentences: list[str]) -> list[str]:
    """Combine sentences into TTS segments between 200 and 350 characters when possible."""
    segments: list[str] = []
    current_segment = ""

    for sentence in sentences:
        proposed_segment = sentence if not current_segment else f"{current_segment} {sentence}"

        if len(proposed_segment) <= MAX_SEGMENT_LENGTH:
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
            and len(segment) < MIN_SEGMENT_LENGTH
            and len(merged_segments[-1]) + 1 + len(segment) <= MAX_SEGMENT_LENGTH
        ):
            merged_segments[-1] = f"{merged_segments[-1]} {segment}"
        else:
            merged_segments.append(segment)

    return merged_segments


def save_segments(segments: list[str], file_path: Path) -> None:
    """Save TTS segments separated by blank lines."""
    file_path.parent.mkdir(exist_ok=True)
    file_path.write_text("\n\n".join(segments), encoding="utf-8")


def main() -> None:
    script_text = load_script(INPUT_FILE)
    if not script_text:
        return

    sentences = split_into_sentences(script_text)
    if not sentences:
        print("Error: No sentences found in the input script.")
        return

    segments = build_tts_segments(sentences)
    save_segments(segments, OUTPUT_FILE)
    print(f"Saved {len(segments)} TTS segments to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
