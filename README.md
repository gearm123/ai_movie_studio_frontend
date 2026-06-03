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

The Vite dev server proxies `/api` and `/health` to `http://127.0.0.1:8000` by default. **Leave `VITE_API_BASE_URL` empty** in `.env` so the app uses the proxy.

Start the backend separately:

```powershell
cd C:\Users\gilak\Pictures\ai_history\project\ai_history_realtime_project
pip install -r requirements-render.txt
powershell -File scripts\run-backend.ps1
```

On the setup page set **topic** (e.g. `my_mysteriosgrandfather`), fill beats, then **Generate movie**. The player appears when the job succeeds.

### Netlify + Render

The site proxies `/api/*` and `/health` to Render via `netlify.toml` (same-origin — no browser CORS).

| Where | Variable |
|-------|----------|
| Netlify | `VITE_BACKEND_API_KEY` = same as Render `BACKEND_API_KEY` |
| Netlify | **Do not set** `VITE_API_BASE_URL` (delete it if already set) |
| Render | `BACKEND_API_KEY`, `GEMINI_API_KEY`, etc. (`CORS_ORIGINS` optional when using the proxy) |

After deploy, `https://gearmstudio.netlify.app/health` should return JSON.

## Current UI

- **Beat count** — choose 2–12 story beats
- **Per-beat editor** — narration (with punctuation guidance), visual prompt, duration
- **Audio params** — backend `audio_params` keys: speaker, tone, delivery, cadence, pauses, energy, clause_pause_sec
- **Composition params** — motion_prompt, transitions, emphasis_text; promo styles also expose visual_asset / visual_delivery
- **Project settings** — style preset, mode, voice, delivery profile, composition toggles (matches CLI/job flags)
- **Generate movie** — POST `/api/v1/jobs` with draft settings + beat narration; poll until MP4 plays in-browser

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
