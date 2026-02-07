# PANOPTICON

AI-powered law enforcement command & control console. Built for TartanHacks 2026.

## What it does

PANOPTICON is a real-time police dispatch system where dispatchers speak natural language commands and an AI agent parses intent, selects the optimal unit, and executes the dispatch. A dual-map system provides 2D tactical and 3D immersive views with live unit tracking along real road routes. The autonomous DAEDALUS agent independently generates incidents, dispatches units by severity priority, and resolves cases — all with a transparent annotation feed.

## Features

- **Voice Dispatch** — Hold spacebar and speak ("send K9 to the robbery downtown"). Dedalus SDK parses the command and dispatches the best unit.
- **Dual Maps** — Leaflet (2D) with CARTO dark tiles and Mapbox GL (3D) with terrain, building extrusions, and sky atmosphere.
- **DAEDALUS Autonomous Agent** — AI agent that generates incidents across Pittsburgh neighborhoods, auto-dispatches units, and clears resolved cases.
- **AI Bodycam Analysis** — Vision model analyzes bodycam frames every 5 seconds. Threat level, person count, and tactical observations overlay the feed.
- **AI Incident Reports** — One-click generation of structured law enforcement reports with narrative, timeline, and recommendations.
- **Real Road Routing** — Units follow actual road paths via Mapbox Directions API with progress tracking and ETA.
- **Police Flash** — Red/blue alternating animation on dispatched unit markers.
- **Search** — Geocode addresses/landmarks via Photon (OSM). Drops a marker and flies to the result.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite |
| 2D Map | Leaflet (CDN ESM) |
| 3D Map | Mapbox GL JS (npm) |
| Voice | Web Speech API (push-to-talk) |
| Backend | Flask, Flask-CORS |
| AI Engine | Dedalus SDK (DedalusRunner) |
| LLMs | GPT-4o-mini, Claude Sonnet, Claude Vision |
| State | In-memory (useState / Python dicts) |

## Architecture

```
React (Vite :5173)  --/api proxy-->  Flask (:5001)  -->  Dedalus SDK  -->  GPT-4o / Claude
```

Vite proxies `/api/*` to Flask. All AI calls are server-side (API key never exposed to browser). Every AI feature has a frontend regex fallback if the server is offline.

## Getting Started

### Frontend

```bash
npm install
npm run dev
```

### Backend

```bash
cd server
pip install -r requirements.txt
python -m server.app
```

### Environment

Create a `.env` file in the project root:

```
VITE_MAPBOX_TOKEN=your_mapbox_token
DEDALUS_API_KEY=your_dedalus_key
```

## Dedalus Integration

### Tool Calling Prize

6 custom local tools the AI agent can invoke:

- `list_available_units()` — all unit positions and status
- `get_unit_status(unit_id)` — single unit details
- `get_crime_zone_details(zone_id)` — incident severity and location
- `find_nearest_unit(target_id, unit_type)` — spatial proximity with type filtering
- `dispatch_unit(unit_id, target_id)` — execute dispatch, return structured JSON
- `navigate_to_location(target_name)` — fuzzy-match and return coordinates

### Multimodal Prize

Model handoffs route tasks to the right LLM:

- **GPT-4o-mini** — fast dispatch parsing and tool execution
- **Claude Sonnet** — complex reasoning and report generation
- **Claude Vision** — bodycam frame analysis

## Voice Commands

Speak naturally while holding spacebar:

- "Send K9 to the robbery downtown"
- "Dispatch nearest unit to East Liberty"
- "We need someone at Cohon Center"
- "Bike Squad to South Side disturbance"
- "Navigate to Shadyside"

The AI interprets intent and matches units/locations by name, type, and proximity.

## Project Structure

```
src/
  App.jsx                    # Main app, state, dispatch logic
  components/
    LeafletView.jsx          # 2D map
    Map3DView.jsx            # 3D map (Mapbox GL)
    DispatchPanel.jsx         # Sidebar dispatch board
    TranscriptRecorder.jsx    # Voice FAB with AI integration
    DaedalusAgent.jsx         # Autonomous AI agent
    AIRecommendation.jsx      # Floating AI suggestion panel
    IncidentReport.jsx        # AI report modal
  services/
    api.js                   # Frontend API client
  styles.css                 # Full theme (black & white UI)

server/
  app.py                     # Flask entry point
  config.py                  # Environment config
  store.py                   # In-memory state
  ai/
    prompts.py               # Centralized system prompts
    dispatch_ai.py           # AI dispatch parsing (6 tools)
    bodycam_ai.py            # Vision analysis
    report_ai.py             # Report generation
  routes/
    dispatch.py              # POST /api/dispatch/parse
    bodycam.py               # POST /api/bodycam/analyze
    reports.py               # POST /api/reports/generate
    state.py                 # POST /api/state/sync
```
