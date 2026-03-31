"""
main.py — FastAPI application entry point.

Start with:
    uvicorn main:app --reload --port 8000

Swagger docs available at: http://127.0.0.1:8000/docs
MongoDB Compass: connect to mongodb://localhost:27017  (DB: voicecast)
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import close_db, connect_db
from routers import auth, chat, episodes, podcast


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: connect to MongoDB. Shutdown: close connection."""
    await connect_db()
    yield
    await close_db()


app = FastAPI(
    title="VoiceCast AI — Blog to Podcast API",
    description=(
        "Converts blog posts into AI-generated podcast scripts using Gemini 2.5 Flash. "
        "Data is stored in MongoDB (voicecast DB). "
        "Swagger UI available at /docs."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

# ── CORS — allow frontend (Vite dev server) & production origin ───────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ────────────────────────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(episodes.router)
app.include_router(podcast.router)
app.include_router(chat.router)


@app.get("/", tags=["Health"])
async def root():
    return {
        "status": "ok",
        "message": "VoiceCast AI Backend is running 🎙️",
        "docs": "/docs",
    }


@app.get("/api/health", tags=["Health"])
async def health():
    return {"status": "ok"}
