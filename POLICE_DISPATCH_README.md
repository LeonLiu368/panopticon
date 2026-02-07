# 🚓 Police Dispatch Control Center

**Full-Stack AI-Powered Police Dispatch Service**

Built on the CalHacks Orion architecture, adapted for police operations with real-time incident tracking, unit dispatch, voice AI assistance, and emergency alerting.

---

## 📋 Overview

This is a comprehensive police dispatch control center that provides:

- **Real-Time Incident Management**: Track active police incidents with live updates
- **Unit Dispatch System**: Automatically assign nearest available units to incidents
- **Interactive 3D Map**: Mapbox GL visualization with incident markers, unit tracking, and routes
- **AI Voice Assistant**: Hands-free operations with VAPI integration
- **Emergency Alerts**: Automated Telegram/SMS notifications
- **Live Unit Tracking**: Real-time position updates for dispatched units
- **Environmental Conditions**: Weather and visibility data for operations

---

## 🏗️ Architecture

### Technology Stack

- **Frontend**: Next.js 16, React 18, TypeScript, Tailwind CSS 4
- **Backend**: Next.js API Routes, Supabase (PostgreSQL + Realtime)
- **Mapping**: Mapbox GL JS with 3D terrain
- **Voice AI**: VAPI for conversational AI
- **Alerts**: Telegram Bot API via Composio
- **Weather**: Open-Meteo API

### Database Schema

The system uses Supabase with the following tables:

- `incidents` - Police incidents/crimes
- `police_stations` - Police station locations
- `units` - Police units (patrol cars, K9, etc.)
- `dispatches` - Unit assignments to incidents
- `checkpoints` - Manual markers on map

See `supabase/police_dispatch_schema.sql` for full schema.

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18.x or higher
- npm or pnpm
- Supabase account
- Mapbox account (for maps)
- VAPI account (for voice AI)
- Telegram Bot (for alerts)

### Step 1: Install Dependencies

```bash
cd CalHacks
npm install
```

### Step 2: Set Up Environment Variables

Create a `.env.local` file in the `CalHacks` directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Mapbox Configuration
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_access_token

# VAPI Configuration (Voice AI)
NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_vapi_public_key

# Telegram Configuration (Emergency Alerts)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id

# Composio Configuration (optional)
COMPOSIO_API_KEY=your_composio_api_key
```

### Step 3: Set Up Database

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL schema in your Supabase SQL Editor:

```bash
# Copy and paste the contents of:
supabase/police_dispatch_schema.sql
```

This will create:
- All required tables
- Indexes for performance
- Sample police stations and units
- Realtime subscriptions

### Step 4: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📖 Usage Guide

### Dashboard Overview

The dashboard consists of:

1. **Left Sidebar**: Active incidents list with real-time updates
2. **Center**: Full-screen interactive 3D map
3. **Right Sidebar**: 
   - AI Voice Assistant
   - Environmental Conditions (when incident selected)
   - Emergency Alert button

### Managing Incidents

1. **View Active Incidents**: Check the left sidebar "Active Incidents" panel
2. **Click on Incident**: Navigate to incident location on map
3. **View Details**: Popup shows:
   - Incident name and description
   - Priority level
   - Status and containment percentage
   - Coordinates
4. **Dispatch Units**: Click "Send Unit" button to automatically assign nearest available unit

### Using Voice Assistant

1. **Activate**: Click the microphone button in the AI Assistant panel
2. **Speak Naturally**: Ask questions like:
   - "What incidents are currently active?"
   - "What's the status of the robbery at Forbes?"
   - "Show me available units"
   - "Dispatch a unit to incident [ID]"
3. **View Responses**: Assistant replies appear in real-time with timestamps
4. **Deactivate**: Click the red microphone icon to end session

### Dispatching Units

1. **Select Incident**: Click on an incident from the map or sidebar
2. **View Available Units**: Check the "Response Teams" panel showing:
   - Available units
   - Units en route
   - Units on scene
3. **Dispatch**: Click "Send Unit" button
4. **Track Progress**: Unit moves along route on map, status updates automatically

### Sending Emergency Alerts

1. **Select Incident**: Click on an incident
2. **Click Alert Button**: Orange "Alert: [Incident Name]" button at bottom right
3. **Confirmation**: Status message appears showing success/failure
4. **Telegram Delivery**: Alert sent to configured Telegram chat

---

## 🔌 API Endpoints

### `GET /api/incident-state`

Fetch current state of all active incidents and police stations.

**Response:**
```json
{
  "incidents": [
    {
      "id": "uuid",
      "name": "Robbery at Forbes & Morewood",
      "lat": 40.4427,
      "lon": -79.9425,
      "priority": "high",
      "containment": 0,
      "polygon_coords": [...],
      "estimated_radius": 300
    }
  ],
  "stations": [...],
  "count": {
    "active_incidents": 1,
    "stations": 3
  }
}
```

### `POST /api/dispatch-unit`

Dispatch nearest available unit to an incident.

**Request:**
```json
{
  "incidentId": "uuid",
  "incidentLat": 40.4427,
  "incidentLon": -79.9425
}
```

**Response:**
```json
{
  "success": true,
  "unit": {
    "id": "uuid",
    "unit_number": "Unit 1-1",
    "station_name": "Station 1 - Downtown",
    "estimated_arrival": "2024-01-15T10:35:00Z",
    "estimated_duration": 300
  },
  "route": {
    "geometry": {...},
    "distance": 2500,
    "duration": 300
  }
}
```

### `GET /api/dispatch-unit`

Get unit statistics and active dispatches.

### `POST /api/send-emergency-alert`

Send emergency alert via Telegram.

**Request:**
```json
{
  "incident": {
    "id": "uuid",
    "name": "Robbery at Forbes",
    "priority": "high",
    "lat": 40.4427,
    "lon": -79.9425,
    "last_update": "2024-01-15T10:30:00Z"
  }
}
```

---

## 🗄️ Database Schema

### `incidents` Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | TEXT | Incident name |
| status | TEXT | active, resolved, closed |
| priority | TEXT | low, medium, high, critical |
| lat | NUMERIC | Latitude |
| lon | NUMERIC | Longitude |
| containment | NUMERIC | Resolution progress (0-100) |
| incident_type | TEXT | Type of incident |
| description | TEXT | Incident details |
| start_time | TIMESTAMPTZ | When incident started |
| last_update | TIMESTAMPTZ | Last update timestamp |

### `units` Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| station_id | BIGINT | References police_stations |
| incident_id | UUID | References incidents (null when available) |
| status | TEXT | available, dispatched, en_route, on_scene, off_duty |
| unit_number | TEXT | Unit identifier (e.g., "Unit A1") |
| unit_type | TEXT | patrol, k9, bike, traffic, swat |
| current_lat | NUMERIC | Current latitude |
| current_lon | NUMERIC | Current longitude |

### `dispatches` Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| incident_id | UUID | References incidents |
| unit_id | UUID | References units |
| status | TEXT | assigned, en_route, on_scene, completed, cancelled |
| eta_seconds | INTEGER | Estimated time of arrival |
| route_geometry | JSONB | Mapbox route geometry |

---

## 🎨 Customization

### Map Configuration

Update Mapbox token in `components/california-map.tsx` or via environment variable.

### Voice Assistant

Update VAPI assistant ID in `hooks/use-vapi.ts` (line 107).

### Police Stations

Add/modify stations in Supabase `police_stations` table or via the SQL schema.

### Incident Types

Supported incident types:
- `robbery`
- `assault`
- `traffic`
- `disturbance`
- `theft`
- `vandalism`
- Custom types

---

## 🔄 Real-Time Features

### Supabase Realtime

All tables have realtime subscriptions enabled:
- Incident updates appear instantly
- Unit status changes sync across clients
- Dispatch assignments update in real-time

### Unit Movement

Units automatically move along routes when dispatched:
- Updates every 2 seconds
- Status changes: available → dispatched → en_route → on_scene
- Automatic arrival detection

---

## 🧪 Testing

### Create Test Incident

```sql
INSERT INTO incidents (name, status, priority, lat, lon, description, incident_type, reported_by)
VALUES 
('Test Robbery', 'active', 'high', 40.4427, -79.9425, 'Test incident', 'robbery', 'Test');
```

### Test Unit Dispatch

1. Select an incident on the map
2. Click "Send Unit" button
3. Watch unit move along route
4. Check unit status updates

### Test Voice Assistant

1. Click microphone button
2. Say: "What incidents are active?"
3. Verify response appears

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm run build
vercel --prod
```

### AWS Amplify

- Connect GitHub repository
- Use `amplify.yml` for build config
- Deploy automatically on push

---

## 📝 Notes

- **Map Style**: Uses Mapbox Streets v2 by default. Can be customized via `VITE_MAP_STYLE` or `VITE_MAPTILER_KEY`
- **Voice AI**: Requires VAPI account and configured assistant
- **Alerts**: Requires Telegram bot token and chat ID
- **Database**: Uses Supabase Realtime for live updates

---

## 🔐 Security

- Never commit `.env.local` to version control
- Use Row Level Security (RLS) in Supabase
- Restrict API keys to specific domains
- Rotate credentials regularly

---

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/)
- [Supabase Documentation](https://supabase.com/docs)
- [VAPI Documentation](https://docs.vapi.ai/)
- [Telegram Bot API](https://core.telegram.org/bots/api)

---

## 🤝 Contributing

This project is based on the CalHacks Orion wildfire dashboard, adapted for police dispatch operations. Contributions welcome!

---

**Built with ❤️ for police dispatch operations**
