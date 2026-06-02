# AI Movie Studio — Web

React frontend for the AI Movie Studio pipeline. Pairs with the FastAPI backend in `ai_movie_studio` (Python).

## Local development

```powershell
cd C:\Users\gilak\Pictures\ai-movie-studio-web
copy .env.example .env
npm install
npm run dev
```

Open http://127.0.0.1:5173

The Vite dev server proxies `/api` and `/health` to `http://127.0.0.1:8000` by default. Start the backend separately:

```powershell
cd C:\Users\gilak\Pictures\ai_history\project\ai_history_realtime_project
pip install -r requirements-render.txt
powershell -File scripts\run-backend.ps1
```

## Current UI

- **Step 1:** Choose the number of beats (story shots) for your movie
- Timeline preview updates live
- More project parameters and backend job submission coming next

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |

## Project structure

```
src/
  components/   # UI (BeatSelector, timeline, layout)
  constants/    # Beat limits and duration estimates
  hooks/        # Project draft state
  types/        # Shared TypeScript types
```
