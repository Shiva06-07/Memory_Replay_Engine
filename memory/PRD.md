# Memory Replay Engine - PRD

## Architecture
- **Frontend**: React.js + Tailwind CSS + Shadcn/UI + Recharts + Framer Motion + react-force-graph-3d
- **Backend**: FastAPI (Python) + Motor (MongoDB async)
- **Database**: MongoDB
- **AI**: Claude Sonnet 4.5 + OpenAI Whisper
- **Storage**: Emergent Object Storage
- **Auth**: JWT-based (httpOnly cookies)

## All Implemented Features

### Phase 1 - MVP
- JWT auth, memory CRUD, AI emotion detection, voice transcription, image upload, dashboard, timeline

### Phase 2 - Replay
- Story Mode, Emotion Replay, Search, Emotion Analytics

### Phase 3 - Edit/Delete/Ranking
- Memory editing/deletion, AI importance ranking 1-10

### Phase 4 - Intelligence
- Memory Intelligence Insights, 3D Memory Brain Map

### Phase 5 - Social & Simulation
- "What-If" AI alternate reality simulation (3 scenarios per memory)
- Shared Memories (share by email, view shared memories)

## Remaining Backlog
- Export memories as PDF/text
- Voice narration of stories (TTS)
- Memory photo gallery view
