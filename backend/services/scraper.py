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

    # Try trafilatura's native fetcher first (handles more sites)
    downloaded = trafilatura.fetch_url(url)

    # Fallback to requests with browser-like headers
    if not downloaded:
        headers = {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/124.0.0.0 Safari/537.36"
            ),
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
        }
        try:
            response = requests.get(url, timeout=15, headers=headers)
            response.raise_for_status()
            downloaded = response.text
        except requests.exceptions.RequestException as exc:
            raise ValueError(f"Failed to fetch URL: {exc}") from exc

    if not downloaded:
        raise ValueError(
            "Could not download page content from the provided URL. "
            "Make sure the URL is publicly accessible."
        )

    extracted = trafilatura.extract(
        downloaded,
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
