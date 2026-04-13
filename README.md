# Paladin Insurance Web App

This is a modern, modularized web application for Paladin Insurance, built using the MVC pattern.

## Tech Stack
- **Frontend:** React, React Router, (UI library placeholder)
- **Backend:** Node.js, Express, MongoDB, Mongoose

## Project Structure
```
backend/
  models/
  controllers/
  routes/
  config/
  server.js
  .env
frontend/
  src/
    components/
    pages/
    App.js
    index.js
```

## Getting Started

### Backend
1. `cd backend`
2. Install dependencies: `npm install express mongoose cors dotenv`
3. Start server: `node server.js`

#### Voice AI configuration
- The voice assistant works with Paladin's built-in knowledge responses even without an API key.
- Add `OPENAI_API_KEY` to `backend/.env` to enable OpenAI-generated responses.
- Optional: set `OPENAI_MODEL` (default: `gpt-4o-mini`).
- API endpoint used by frontend widget: `POST /api/voice-chat` with JSON body `{ "message": "..." }`.

#### ElevenLabs voice configuration
- Add `ELEVENLABS_API_KEY` to `backend/.env` to enable ElevenLabs text-to-speech output.
- Optional: set `ELEVENLABS_VOICE_ID` (default: `EXAVITQu4vr4xnSDxMaL`).
- Optional: set `ELEVENLABS_MODEL_ID` (default: `eleven_multilingual_v2`).
- Optional: set `ELEVENLABS_API_URL` (default: `https://api.elevenlabs.io/v1`).
- Backend endpoint used by frontend widget: `POST /api/voice-chat/synthesize` with JSON body `{ "text": "..." }`.
- Frontend fallback: if ElevenLabs fails, widget falls back to browser speech synthesis.

#### Agora realtime voice configuration
- Add `AGORA_APP_ID` and `AGORA_APP_CERTIFICATE` to `backend/.env`.
- Backend token endpoint for frontend: `GET /api/agora/token?channel=paladin-voice&uid=<number>`.

### Frontend
1. `cd frontend`
2. Initialize React app if not already: `npx create-react-app .`
3. Install dependencies: `npm install react-router-dom`
4. Start app: `npm start`

#### Frontend voice chat base URL
- Optional: set `REACT_APP_API_BASE_URL` in `frontend/.env` (default: `http://localhost:5000`).
- Optional: set `REACT_APP_AGORA_CHANNEL` in `frontend/.env` (default: `paladin-voice`).
- Optional: set `REACT_APP_USE_ELEVENLABS_TTS=false` to force browser voice only.

---

Replace placeholder UI library with your choice (e.g., Material-UI, Tailwind CSS).

---

## License
MIT