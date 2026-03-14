"""Text preprocessing utilities for the blog-to-podcast pipeline."""

from __future__ import annotations

import re


def clean_text(text: str) -> str:
    """Remove URLs, duplicate lines, and normalize whitespace."""
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
    """Split text into sentences using punctuation boundaries."""
    normalized_text = " ".join(text.split()).strip()
    if not normalized_text:
        return []

    sentences = re.split(r"(?<=[.!?])\s+", normalized_text)
    return [sentence.strip() for sentence in sentences if sentence.strip()]


def split_into_chunks(text: str, chunk_size: int = 3000) -> list[str]:
    """Split text into chunks near the target size without breaking words."""
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

