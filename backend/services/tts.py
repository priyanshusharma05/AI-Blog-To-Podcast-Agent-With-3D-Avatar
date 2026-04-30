"""
services/tts.py - Text-to-speech audio generation for podcast episodes.
Integrated from the modular pipeline work in Model/ and aligned with backend flow.
"""

from __future__ import annotations

import shutil
from pathlib import Path

from gtts import gTTS
import imageio_ffmpeg
from pydub import AudioSegment
from pydub.effects import speedup

from services.text_processor import build_tts_segments, split_into_sentences

ENABLE_SPEEDUP = False
PLAYBACK_SPEED = 1.20
LANGUAGE = "en"

AUDIO_OUTPUT_DIR = Path(__file__).resolve().parent.parent / "audio_output"
AudioSegment.converter = imageio_ffmpeg.get_ffmpeg_exe()
AudioSegment.ffmpeg = AudioSegment.converter


def _speed_up_audio(input_path: Path, output_path: Path, speed: float) -> None:
    """Speed up an MP3 file using pydub."""
    if speed <= 1.0:
        raise ValueError("speed must be greater than 1.0.")

    audio = AudioSegment.from_file(input_path, format="mp3")
    faster = speedup(audio, playback_speed=speed, chunk_size=150, crossfade=25)
    faster.export(output_path, format="mp3")


def _segment_index(path: Path) -> int:
    """Extract a numeric sort key from names like segment_3.mp3."""
    suffix = path.stem.split("_")[-1]
    return int(suffix) if suffix.isdigit() else 0


def generate_audio(script: str, episode_id: str) -> tuple[Path, int]:
    """
    Full TTS pipeline: script -> sentences -> segments -> gTTS -> optional speed up -> merge.

    Returns the final MP3 path and the approximate duration in minutes.
    """
    AUDIO_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    episode_dir = AUDIO_OUTPUT_DIR / f"ep_{episode_id}"
    episode_dir.mkdir(parents=True, exist_ok=True)

    sentences = split_into_sentences(script)
    segments = build_tts_segments(sentences)
    if not segments:
        raise RuntimeError("No TTS segments could be created from the script.")

    total = len(segments)
    print(f"TTS: Generating {total} audio segments for episode {episode_id}...")

    for idx, segment_text in enumerate(segments, start=1):
        output_path = episode_dir / f"segment_{idx}.mp3"
        try:
            gTTS(text=segment_text, lang=LANGUAGE, slow=False, tld="com").save(
                str(output_path)
            )
            print(f"  Saved segment {idx}/{total}")
        except Exception as exc:
            print(f"  Segment {idx}/{total} failed: {exc}")

    segment_files = sorted(
        episode_dir.glob("segment_*.mp3"),
        key=_segment_index,
    )
    if not segment_files:
        raise RuntimeError("No audio segments were generated successfully.")

    if ENABLE_SPEEDUP:
        print(f"Applying {PLAYBACK_SPEED}x speed to {len(segment_files)} segments...")
        for seg_file in segment_files:
            temp = seg_file.with_name(f"{seg_file.stem}_fast.mp3")
            try:
                _speed_up_audio(seg_file, temp, PLAYBACK_SPEED)
                temp.replace(seg_file)
            except Exception as exc:
                print(f"  Speed-up failed for {seg_file.name}: {exc}")

    merged_audio = AudioSegment.empty()
    for seg_file in segment_files:
        merged_audio += AudioSegment.from_file(seg_file, format="mp3")

    final_path = AUDIO_OUTPUT_DIR / f"{episode_id}.mp3"
    merged_audio.export(final_path, format="mp3")
    duration_min = max(1, round(len(merged_audio) / 60000))

    shutil.rmtree(episode_dir, ignore_errors=True)

    print(f"TTS complete: {final_path} ({duration_min} min)")
    return final_path, duration_min


def get_audio_path(episode_id: str) -> Path | None:
    """Return the path to an episode's MP3 if it exists."""
    path = AUDIO_OUTPUT_DIR / f"{episode_id}.mp3"
    return path if path.is_file() else None
