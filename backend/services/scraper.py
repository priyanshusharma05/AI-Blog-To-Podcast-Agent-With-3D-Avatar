"""
services/scraper.py — Blog URL scraper using trafilatura.
Adapted from BlogExtraction&ConversationalScriptGenration/podcast_generator.py.
"""

from __future__ import annotations

from urllib.parse import urlparse

import requests
import trafilatura


def is_url(value: str) -> bool:
    parsed = urlparse(value)
    return parsed.scheme in {"http", "https"} and bool(parsed.netloc)


def fetch_text_from_url(url: str) -> str:
    """
    Fetch and extract main article text from a public blog URL.
    Returns the extracted text or raises ValueError on failure.
    """
    if not is_url(url):
        raise ValueError(f"Invalid URL: '{url}'. Must start with http:// or https://")

    try:
        response = requests.get(url, timeout=15, headers={"User-Agent": "Mozilla/5.0"})
        response.raise_for_status()
    except requests.exceptions.RequestException as exc:
        raise ValueError(f"Failed to fetch URL: {exc}") from exc

    extracted = trafilatura.extract(
        response.text,
        url=url,
        include_links=False,
        include_formatting=False,
        favor_precision=True,
    )

    if not extracted:
        raise ValueError(
            "Unable to extract article content from the provided URL. "
            "Make sure the URL points to a public blog post."
        )

    return extracted
