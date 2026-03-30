"""
services/text_processor.py — Text cleaning and chunking utilities.
Adapted from BlogExtraction&ConversationalScriptGenration/preprocessing.py.
"""

from __future__ import annotations

import re


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
    """Split text into chunks of ~chunk_size chars without breaking words."""
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
