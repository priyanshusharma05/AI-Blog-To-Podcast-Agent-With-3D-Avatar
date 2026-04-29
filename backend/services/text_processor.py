"""
services/text_processor.py - Text cleaning, chunking, and TTS prep utilities.
Integrated from the modular pipeline work that previously lived in Model/.
"""

from __future__ import annotations

import re

TTS_MIN_SEGMENT_LENGTH = 200
TTS_MAX_SEGMENT_LENGTH = 350


def clean_text(text: str) -> str:
    """Remove URLs, duplicate lines, and normalize whitespace."""
    text = re.sub(r"https?://\S+", "", text)

    seen_lines: set[str] = set()
    cleaned_lines: list[str] = []

    for line in text.splitlines():
        normalized = " ".join(line.split()).strip()
        if not normalized or normalized in seen_lines:
            continue
        seen_lines.add(normalized)
        cleaned_lines.append(normalized)

    cleaned_text = "\n".join(cleaned_lines)
    return re.sub(r"\s+", " ", cleaned_text).strip()


def split_into_chunks(text: str, chunk_size: int = 3000) -> list[str]:
    """Split text into chunks of about chunk_size chars without breaking words."""
    normalized = " ".join(text.split()).strip()
    if not normalized:
        return []
    if chunk_size <= 0:
        raise ValueError("chunk_size must be greater than 0.")

    words = normalized.split()
    chunks: list[str] = []
    current_chunk: list[str] = []
    current_length = 0

    for word in words:
        additional = len(word) if not current_chunk else len(word) + 1
        if current_chunk and current_length + additional > chunk_size:
            chunks.append(" ".join(current_chunk))
            current_chunk = [word]
            current_length = len(word)
            continue

        current_chunk.append(word)
        current_length += additional

    if current_chunk:
        chunks.append(" ".join(current_chunk))

    return chunks


def split_into_sentences(text: str) -> list[str]:
    """Split text into sentences on sentence-ending punctuation."""
    normalized = " ".join(text.split()).strip()
    if not normalized:
        return []

    sentences = re.split(r"(?<=[.!?])\s+", normalized)
    return [sentence.strip() for sentence in sentences if sentence.strip()]


def build_tts_segments(
    sentences: list[str],
    min_segment_length: int = TTS_MIN_SEGMENT_LENGTH,
    max_segment_length: int = TTS_MAX_SEGMENT_LENGTH,
) -> list[str]:
    """Combine sentences into speech-friendly TTS segments."""
    if min_segment_length <= 0 or max_segment_length <= 0:
        raise ValueError("Segment lengths must be greater than 0.")
    if min_segment_length > max_segment_length:
        raise ValueError("min_segment_length cannot be greater than max_segment_length.")

    segments: list[str] = []
    current_segment = ""

    for sentence in sentences:
        proposed = sentence if not current_segment else f"{current_segment} {sentence}"

        if len(proposed) <= max_segment_length:
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

    merged_segments: list[str] = []
    for segment in segments:
        if (
            merged_segments
            and len(segment) < min_segment_length
            and len(merged_segments[-1]) + len(segment) + 1 <= max_segment_length
        ):
            merged_segments[-1] = f"{merged_segments[-1]} {segment}"
        else:
            merged_segments.append(segment)

    return merged_segments
