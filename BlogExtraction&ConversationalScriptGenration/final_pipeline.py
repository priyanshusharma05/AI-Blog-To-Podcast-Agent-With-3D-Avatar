"""
final_pipeline.py — End-to-end blog-to-podcast orchestrator.

Ties together blog extraction, text preprocessing, and podcast script
generation into a single callable pipeline.

Usage (standalone):
    python final_pipeline.py

Usage (as module):
    from final_pipeline import run_pipeline, run_pipeline_from_text
    result = run_pipeline("https://example.com/blog-post")
    result = run_pipeline_from_text("Your raw blog text here ...")
"""

from __future__ import annotations

from pathlib import Path

from podcast_generator import (
    fetch_text_from_url,
    generate_intro_outro,
    generate_script_for_chunks,
    is_url,
    read_text_from_file,
)
from preprocessing import clean_text, split_into_chunks


def run_pipeline(source: str) -> dict:
    """
    Run the full blog-to-podcast pipeline from a URL or local file path.

    Parameters
    ----------
    source : str
        A blog URL (http/https) or a local .txt file path.

    Returns
    -------
    dict
        {
            "source": str,
            "cleaned_length": int,
            "num_chunks": int,
            "final_script": str,
        }

    Raises
    ------
    ValueError
        If the source is invalid or no text could be extracted/read.
    RuntimeError
        If script generation fails.
    """
    source = source.strip()
    if not source:
        raise ValueError("Source cannot be empty. Provide a URL or file path.")

    # ── 1. Fetch / read raw text ────────────────────────────────────────────
    if is_url(source):
        raw_text = fetch_text_from_url(source)
        if raw_text.startswith("Error:"):
            raise ValueError(raw_text)
    else:
        path = Path(source).expanduser()
        if not path.is_file():
            raise ValueError(f"File not found: {source}")
        raw_text = read_text_from_file(source)
        if not raw_text:
            raise ValueError(f"Could not read file: {source}")

    return _process_text(raw_text, source=source)


def run_pipeline_from_text(raw_text: str, source: str = "raw_text") -> dict:
    """
    Run the full blog-to-podcast pipeline from raw text input.

    Parameters
    ----------
    raw_text : str
        The raw blog/article text to convert.
    source : str, optional
        Label for the source (default ``"raw_text"``).

    Returns
    -------
    dict
        Same structure as :func:`run_pipeline`.
    """
    if not raw_text or not raw_text.strip():
        raise ValueError("Input text cannot be empty.")

    return _process_text(raw_text, source=source)


def _process_text(raw_text: str, source: str) -> dict:
    """Shared processing: clean → chunk → generate script → add intro/outro."""

    # ── 2. Clean & chunk ────────────────────────────────────────────────────
    cleaned = clean_text(raw_text)
    if not cleaned:
        raise ValueError("No usable text remained after cleaning.")

    chunks = split_into_chunks(cleaned)
    if not chunks:
        raise ValueError("Text could not be split into chunks.")

    # ── 3. Generate podcast script ──────────────────────────────────────────
    script = generate_script_for_chunks(chunks)
    if not script:
        raise RuntimeError(
            "Script generation returned empty. "
            "Check your GEMINI_API_KEY environment variable."
        )

    # ── 4. Add intro & outro ────────────────────────────────────────────────
    final_script = generate_intro_outro(script)
    if not final_script:
        raise RuntimeError("Intro/outro generation failed.")

    return {
        "source": source,
        "cleaned_length": len(cleaned),
        "num_chunks": len(chunks),
        "final_script": final_script,
    }


# ── Standalone entry point ──────────────────────────────────────────────────
if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("Usage: python final_pipeline.py <URL_or_FILE_PATH>")
        sys.exit(1)

    try:
        result = run_pipeline(sys.argv[1])
        print(f"\n✅  Pipeline complete!")
        print(f"    Source        : {result['source']}")
        print(f"    Cleaned chars : {result['cleaned_length']}")
        print(f"    Chunks        : {result['num_chunks']}")
        print(f"    Script length : {len(result['final_script'])} chars")
        print(f"\n{'='*60}")
        print(result["final_script"][:500])
        print(f"{'='*60}")
        print("(Truncated — full script saved to data/final_podcast_script.txt)")
    except (ValueError, RuntimeError) as exc:
        print(f"❌  Pipeline failed: {exc}")
        sys.exit(1)