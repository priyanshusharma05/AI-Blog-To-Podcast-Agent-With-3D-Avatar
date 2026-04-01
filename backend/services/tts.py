"""
services/tts.py — Text-to-Speech audio generation using gTTS + pydub.

Adapted from BlogExtraction&ConversationalScriptGenration/generate_voice.py.
Generates real MP3 audio files from podcast scripts.
"""

from __future__ import annotations

import re
import shutil
import concurrent.futures
from pathlib import Path

import asyncio
import edge_tts


# ── Configuration ────────────────────────────────────────────────────────────
TTS_MIN_SEGMENT_LENGTH = 200
TTS_MAX_SEGMENT_LENGTH = 350
VOICE = "en-US-JennyNeural"  
ENABLE_SPEEDUP = False 
PLAYBACK_SPEED = 1.20        
PLAYBACK_SPEED_RATE = "+6%" 

# Audio output directory (relative to backend/)
AUDIO_OUTPUT_DIR = Path(__file__).resolve().parent.parent / "audio_output"


def split_into_sentences(text: str) -> list[str]:
    """Split text into sentences on sentence-ending punctuation."""
    normalized = " ".join(text.split()).strip()
    if not normalized:
        return []
    sentences = re.split(r"(?<=[.!?])\s+", normalized)
    return [s.strip() for s in sentences if s.strip()]


def build_tts_segments(sentences: list[str]) -> list[str]:
    """
    Group sentences into TTS-friendly segments (200–350 chars).
    Avoids segments that are too short or too long for natural speech.
    """
    segments: list[str] = []
    current_segment = ""

    for sentence in sentences:
        proposed = sentence if not current_segment else f"{current_segment} {sentence}"

        if len(proposed) <= TTS_MAX_SEGMENT_LENGTH:
            current_segment = proposed
            continue

        if current_segment:
            segments.append(current_segment.strip())
            current_segment = sentence
        else:
            segments.append(sentence.strip())
            current_segment = ""

    if current_segment:
        segments.append(current_segment.strip())

    # Merge short trailing segments
    merged: list[str] = []
    for seg in segments:
        if (
            merged
            and len(seg) < TTS_MIN_SEGMENT_LENGTH
            and len(merged[-1]) + 1 + len(seg) <= TTS_MAX_SEGMENT_LENGTH
        ):
            merged[-1] = f"{merged[-1]} {seg}"
        else:
            merged.append(seg)

    return merged


def _speed_up_audio(input_path: Path, output_path: Path, speed: float) -> None:
    """Speed up an MP3 file using pydub."""
    audio = AudioSegment.from_file(input_path, format="mp3")
    faster = speedup(audio, playback_speed=speed, chunk_size=150, crossfade=25)
    faster.export(output_path, format="mp3")


def generate_audio(script: str, episode_id: str) -> Path:
    """
    Full TTS pipeline: script → sentences → segments → gTTS → speed up → merge.

    Returns the path to the final merged MP3 file.
    """
    AUDIO_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Working directory for this episode's segments
    episode_dir = AUDIO_OUTPUT_DIR / f"ep_{episode_id}"
    episode_dir.mkdir(parents=True, exist_ok=True)

    # ── 1. Split script into TTS segments ────────────────────────────────
    sentences = split_into_sentences(script)
    segments = build_tts_segments(sentences)

    if not segments:
        raise RuntimeError("No TTS segments could be created from the script.")

    total = len(segments)
    print(f"🎙️  TTS: Generating {total} audio segments for episode {episode_id}...")

    # ── 2. Generate MP3 per segment via edge-tts ─────────────────────────────
    def _download_segment(item):
        idx, segment_text = item
        output_path = episode_dir / f"segment_{idx}.mp3"
        try:
            async def generate():
                communicate = edge_tts.Communicate(text=segment_text, voice=VOICE, rate=PLAYBACK_SPEED_RATE)
                await communicate.save(str(output_path))
            
            asyncio.run(generate())
            print(f"   ✅ Segment {idx}/{total} saved")
        except Exception as exc:
            print(f"   ❌ Segment {idx}/{total} failed: {exc}")

    # Generate audio segments concurrently using thread pool (Network IO bound)
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        items = list(enumerate(segments, start=1))
        # executor.map automatically handles parallel threads
        list(executor.map(_download_segment, items))

    # ── 3. Speed up segments (optional) ──────────────────────────────────
    if ENABLE_SPEEDUP:
        segment_files = sorted(
            episode_dir.glob("segment_*.mp3"),
            key=lambda p: int(re.search(r"segment_(\d+)", p.stem).group(1))
            if re.search(r"segment_(\d+)", p.stem)
            else 0,
        )
        print(f"🏎️  Applying {PLAYBACK_SPEED}x speed to {len(segment_files)} segments...")
        for seg_file in segment_files:
            temp = seg_file.with_name(f"{seg_file.stem}_fast.mp3")
            try:
                _speed_up_audio(seg_file, temp, PLAYBACK_SPEED)
                temp.replace(seg_file)
            except Exception as exc:
                print(f"   ⚠️  Speed-up failed for {seg_file.name}: {exc}")

    # ── 4. Merge all segments into one MP3 ───────────────────────────────
    segment_files = sorted(
        episode_dir.glob("segment_*.mp3"),
        key=lambda p: int(re.search(r"segment_(\d+)", p.stem).group(1))
        if re.search(r"segment_(\d+)", p.stem)
        else 0,
    )

    if not segment_files:
        raise RuntimeError("No audio segments were generated successfully.")

    final_path = AUDIO_OUTPUT_DIR / f"{episode_id}.mp3"
    # Merge natively using pure Python without needing FFmpeg or PyDub
    with open(final_path, "wb") as outfile:
        for seg_file in segment_files:
            with open(seg_file, "rb") as infile:
                outfile.write(infile.read())
    
    # Estimate duration: ~4000 bytes/sec for MP3
    duration_secs = final_path.stat().st_size / 4000.0

    duration_min = max(1, round(duration_secs / 60))

    # Clean up segment files
    shutil.rmtree(episode_dir, ignore_errors=True)

    print(f"🎧  TTS complete: {final_path} ({duration_min} min)")
    return final_path, duration_min


def get_audio_path(episode_id: str) -> Path | None:
    """Return the path to an episode's MP3 if it exists."""
    path = AUDIO_OUTPUT_DIR / f"{episode_id}.mp3"
    return path if path.is_file() else None
