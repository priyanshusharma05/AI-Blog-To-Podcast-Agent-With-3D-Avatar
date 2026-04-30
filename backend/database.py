"""
database.py — MongoDB async connection via Motor.

DB: voicecast
Collections:
  - users
  - episodes

Visible in MongoDB Compass at: Your Atlas Connection String
"""

import os
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from env_config import load_backend_env

load_backend_env()

MONGO_URI: str = os.getenv("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB_NAME: str = os.getenv("MONGO_DB_NAME", "voicecast")

# Module-level client — shared across all requests
_client: AsyncIOMotorClient | None = None


def get_client() -> AsyncIOMotorClient:
    global _client
    if _client is None:
        if "mongodb+srv" in MONGO_URI:
            _client = AsyncIOMotorClient(MONGO_URI, tlsCAFile=certifi.where())
        else:
            _client = AsyncIOMotorClient(MONGO_URI)

    return _client


def get_db():
    """Return the voicecast database object."""
    return get_client()[MONGO_DB_NAME]


async def connect_db() -> None:
    """Called on app startup — verifies the connection."""
    client = get_client()
    await client.admin.command("ping")
    print(f"[DB] Connected to MongoDB: {MONGO_URI} / {MONGO_DB_NAME}")


async def close_db() -> None:
    """Called on app shutdown."""
    global _client
    if _client is not None:
        _client.close()
        _client = None
        print("[DB] MongoDB connection closed.")
