# AI Blog To Podcast Agent With 3D Avatar

This repo contains a Vite/React frontend and a FastAPI backend that turns blog content into podcast episodes with script generation, chat, and audio output.

## Structure

- `src/`: React frontend pages and UI components
- `backend/main.py`: FastAPI app entry point
- `backend/routers/`: API endpoints for auth, podcast generation, chat, episodes, and audio
- `backend/services/`: Integrated backend pipeline for scraping, text processing, Groq script generation, chat, and TTS
- `backend/audio_output/`: Generated podcast audio files at runtime

## Backend flow

1. A request hits `POST /api/podcast/generate`.
2. The backend fetches or accepts source text.
3. Text is cleaned and split into chunks in `backend/services/text_processor.py`.
4. Groq generates the podcast script and intro/outro in `backend/services/ai.py`.
5. Audio is generated from the final script in `backend/services/tts.py`.
6. Episode metadata is stored in MongoDB and the MP3 is served from `backend/routers/audio.py`.

## Notes

- Older standalone pipeline folders were consolidated into `backend/services`.
- Generated cache and audio artifacts are ignored in git.
