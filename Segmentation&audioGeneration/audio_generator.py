from pathlib import Path
import re

from gtts import gTTS
from pydub import AudioSegment
from pydub.effects import speedup

SEGMENTS_FILE = Path("data") / "tts_segments.txt"
OUTPUT_DIR = Path("data") / "audio_segments"
LANGUAGE = "en"
MERGED_OUTPUT_FILE = Path("data") / "podcast_episode.mp3"
ENABLE_SPEEDUP = True
PLAYBACK_SPEED = 1.20


def load_text_segments(file_path: Path) -> list[str]:
    """Load text segments separated by blank lines from a text file."""
    if not file_path.is_file():
        print(f"Error: Segments file not found: {file_path}")
        return []

    text = file_path.read_text(encoding="utf-8").strip()
    if not text:
        print(f"Error: Segments file is empty: {file_path}")
        return []

    return [segment.strip() for segment in text.split("\n\n") if segment.strip()]


def generate_audio_for_segments(segments: list[str]) -> None:
    """Generate sequential MP3 files for each text segment using gTTS."""
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
    """Speed up an MP3 file and save the adjusted result."""
    if speed <= 1.0:
        raise ValueError("speed must be greater than 1.0.")

    audio = AudioSegment.from_file(input_path, format="mp3")
    faster_audio = speedup(audio, playback_speed=speed, chunk_size=150, crossfade=25)
    faster_audio.export(output_path, format="mp3")


def get_segment_files(audio_dir: Path = OUTPUT_DIR) -> list[Path]:
    """Return segment MP3 files sorted in numerical order."""
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
    """Speed up each generated segment in place before merging."""
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
    """Merge sequential MP3 segment files into a single podcast episode."""
    segment_files = get_segment_files(audio_dir)
    if not segment_files:
        return

    merged_audio = AudioSegment.empty()
    for segment_file in segment_files:
        merged_audio += AudioSegment.from_file(segment_file, format="mp3")

    merged_audio.export(MERGED_OUTPUT_FILE, format="mp3")
    print(f"Merging complete. Saved merged episode to {MERGED_OUTPUT_FILE}")


def main() -> None:
    segments = load_text_segments(SEGMENTS_FILE)
    if not segments:
        return

    print(f"Loaded {len(segments)} text segments from {SEGMENTS_FILE}")
    generate_audio_for_segments(segments)
    speed_up_segments()
    merge_audio_segments()



if __name__ == "__main__":
    main()
