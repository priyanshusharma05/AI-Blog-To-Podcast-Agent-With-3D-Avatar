"""
Helpers for loading the backend's .env file from a stable absolute path.
"""

from __future__ import annotations

from pathlib import Path

from dotenv import load_dotenv

BACKEND_DIR = Path(__file__).resolve().parent
ENV_PATH = BACKEND_DIR / ".env"


def load_backend_env(*, override: bool = False) -> bool:
    """Load backend/.env explicitly so config does not depend on the cwd."""
    return load_dotenv(ENV_PATH, override=override)
