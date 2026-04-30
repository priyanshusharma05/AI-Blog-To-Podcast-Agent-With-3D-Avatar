# AI Blog-to-Podcast Agent

A full-stack web application that transforms blog articles into engaging, conversational podcast episodes using AI. It features web scraping, script generation, text-to-speech, and an integrated podcast player.

## 🌟 Features

- **URL Scraping**: Automatically fetch and extract the main content from any public blog URL.
- **AI Script Generation**: Powered by Groq (Llama 3), it converts dry articles into dynamic, two-speaker conversational podcast scripts.
- **Text-to-Speech (TTS)**: Synthesizes the generated scripts into downloadable and playable MP3 audio files.
- **Interactive Podcast Player**: A custom, cinema-style UI to listen to your generated episodes.
- **User Authentication**: Secure signup and login system to save and manage your personal podcast library.
- **Chat Interface**: An integrated AI chat interface (currently in development/expansion) to interact with the podcast data.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS + Framer Motion for animations
- **Icons**: Lucide React
- **Routing**: React Router DOM

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **Database**: MongoDB (async via Motor)
- **AI / LLM**: Groq API (`llama-3.3-70b-versatile`)
- **Audio Processing**: gTTS, pydub
- **Web Scraping**: Trafilatura
- **Authentication**: JWT, bcrypt

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (3.11+)
- MongoDB instance (local or Atlas)
- FFmpeg (required by `pydub` for audio processing)
- Groq API Key

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd AI-Blog-To-Podcast-Agent-With-3D-Avatar
```

### 2. Backend Setup
Navigate to the backend directory and set up the Python environment:
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory with the following variables:
```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
GROQ_FALLBACK_MODEL=llama-3.1-8b-instant
SECRET_KEY=your_secret_jwt_key
MONGO_URI=mongodb://localhost:27017  # Or your MongoDB Atlas connection string
MONGO_DB_NAME=voicecast
```

Start the FastAPI server:
```bash
uvicorn main:app --reload --port 8000
```
*The API will be available at `http://127.0.0.1:8000`. Swagger docs are at `/docs`.*

### 3. Frontend Setup
Open a new terminal window and navigate to the project root:
```bash
npm install
npm run dev
```
*The frontend will be available at `http://localhost:5173`.*

---

## 📦 Deployment

### Backend (Render)
This project is configured for deployment on [Render](https://render.com/) as a Web Service.
1. Connect your repository to Render.
2. Set the Environment to **Python**.
3. Set the Build Command to: `pip install -r requirements.txt`
4. Set the Start Command to: `python main.py`
5. **Crucial:** Add all the variables from your `.env` file to the Render Environment Variables tab. 

*Note: The `backend/runtime.txt` enforces Python 3.11 to ensure compatibility with audio processing libraries.*

### Frontend (Vercel/Netlify)
1. Connect your repository to Vercel or Netlify.
2. Set the Root Directory to the base folder (where `package.json` is located).
3. Build Command: `npm run build`
4. Output Directory: `dist`

---

## 📁 Project Structure

- `src/`: React frontend pages, hooks, and UI components.
- `backend/main.py`: FastAPI app entry point.
- `backend/routers/`: API endpoints for auth, podcast generation, chat, episodes, and audio serving.
- `backend/services/`: Core logic for web scraping, text chunking, Groq script generation, and TTS conversion.
- `backend/audio_output/`: Temporary storage for generated MP3 files before they are streamed to the client.
