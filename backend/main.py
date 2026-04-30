"""
main.py — FastAPI application entry point.

Start with:
    uvicorn main:app --reload --port 8000

Swagger docs available at: http://127.0.0.1:8000/docs
MongoDB Compass: connect using your Atlas Connection String
"""

import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import close_db, connect_db
from routers import auth, audio, chat, episodes, podcast


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: connect to MongoDB. Shutdown: close connection."""
    await connect_db()
    yield
    await close_db()


app = FastAPI(
    title="VoiceCast AI — Blog to Podcast API",
    description=(
        "Converts blog posts into AI-generated podcast scripts using Groq. "
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
        os.getenv("FRONTEND_URL", "https://your-frontend.vercel.app")
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
app.include_router(audio.router)


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


if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
