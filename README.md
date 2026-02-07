# Metro Dispatch Console

A lightweight React + Vite prototype for a police dispatch console featuring:
- 3D map (MapLibre) with click-to-place and click-to-delete markers
- Dispatch dashboard with quick stats and ETA calculator
- Voice control using Web Speech API for add/remove/navigate commands
- Camera access (mocked fallback) and ability to show street feed URLs

## Getting started (full-stack)
```bash
npm install
npm run server   # starts lightweight API on http://localhost:4000
npm run dev      # starts Vite frontend on http://localhost:5173
```
Set `VITE_API_URL` in `.env` if your API runs elsewhere.

## Map style (actual tiles / backend)
Create a `.env` file and add one of (priority order):

```
VITE_BACKEND_STYLE=https://your-backend/tiles/hd/style.json  # preferred: custom high-detail style served by your backend
VITE_MAPTILER_KEY=your_key_here   # uses MapTiler Streets v2
# or provide any style URL
VITE_MAP_STYLE=https://your-style-url/style.json
```

Without any of these, the app falls back to the MapLibre demo tiles.

## Map engines
- MapLibre (3D-capable) with 2D/3D toggle and custom vector styles.
- Leaflet (2D) with OSM or your own raster tiles. Set `VITE_LEAFLET_TILES` and optional `VITE_LEAFLET_ATTRIB` for attribution.
Switch engines via the top-right button; markers, navigation, and search stay in sync.

## Voice commands (examples)
- "Add marker at 40.44 -79.99 high priority"
- "Navigate to 40.45 -79.98"
- "Delete marker <id>" (or just click a pin)

## 2D / 3D switch
Use the toggle above the map. Both modes support placing/removing markers and camera/ETA workflows; 3D re-enables building extrusions and pitched view.

## Search bar
Type an address or landmark and hit Enter/Go to geocode via Nominatim (OSM). The map flies to the result and drops a marker. Replace with your own geocoder endpoint if needed.

## Notes
- Markers: click the map to add; click a pin or the list button to remove.
- ETA: straight-line distance with simple speed presets (cruiser/bike/foot) for fast estimates.
- Camera: uses `getUserMedia`; if blocked/unavailable, falls back to a short demo clip. Pass a `streetUrl` to `CameraFeed` for remote streams.
