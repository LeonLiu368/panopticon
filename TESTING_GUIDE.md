# 🧪 Police Dispatch Service - Testing Guide

This guide will walk you through testing the police dispatch service step by step.

---

## 📋 Prerequisites Checklist

Before testing, ensure you have:

- [ ] Node.js 18.x or higher installed
- [ ] Supabase account created
- [ ] Mapbox account (for maps)
- [ ] Environment variables configured

---

## 🚀 Step 1: Environment Setup

### 1.1 Install Dependencies

```bash
cd CalHacks
npm install
```

### 1.2 Configure Environment Variables

Create a `.env.local` file in the `CalHacks` directory:

```env
# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Mapbox Configuration (REQUIRED for maps)
NEXT_PUBLIC_MAPBOX_TOKEN=your-mapbox-token-here

# VAPI Configuration (OPTIONAL - for voice assistant)
NEXT_PUBLIC_VAPI_PUBLIC_KEY=your-vapi-key-here

# Telegram Configuration (OPTIONAL - for emergency alerts)
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_CHAT_ID=your-chat-id

# Composio Configuration (OPTIONAL)
COMPOSIO_API_KEY=your-composio-key
```

**How to get these values:**

1. **Supabase**: 
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Go to Settings → API
   - Copy "Project URL" and "anon public" key

2. **Mapbox**:
   - Go to [mapbox.com](https://mapbox.com)
   - Sign up/login
   - Go to Account → Access tokens
   - Create a new token with `styles:read` and `fonts:read` scopes

3. **Telegram** (optional):
   - Message [@BotFather](https://t.me/BotFather) on Telegram
   - Create a bot: `/newbot`
   - Copy the bot token
   - Message [@userinfobot](https://t.me/userinfobot) to get your chat ID

---

## 🗄️ Step 2: Database Setup

### 2.1 Run the Schema

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Click **New Query**
4. Copy the entire contents of `supabase/police_dispatch_schema.sql`
5. Paste into the SQL Editor
6. Click **Run** (or press Cmd/Ctrl + Enter)

**Expected Result:**
- ✅ Tables created: `incidents`, `police_stations`, `units`, `dispatches`, `checkpoints`
- ✅ Sample data inserted (3 police stations, 9 units, 1 sample incident)
- ✅ Realtime subscriptions enabled

### 2.2 Verify Database Setup

In Supabase SQL Editor, run:

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('incidents', 'police_stations', 'units', 'dispatches', 'checkpoints');

-- Check sample data
SELECT COUNT(*) as station_count FROM police_stations;
SELECT COUNT(*) as unit_count FROM units;
SELECT COUNT(*) as incident_count FROM incidents;
```

**Expected Results:**
- `station_count`: 3
- `unit_count`: 9 (3 units per station)
- `incident_count`: 1

---

## 🏃 Step 3: Start the Development Server

```bash
cd CalHacks
npm run dev
```

**Expected Output:**
```
▲ Next.js 16.0.0
- Local:        http://localhost:3000
- Ready in 2.3s
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ✅ Step 4: Basic Functionality Tests

### Test 1: Dashboard Loads

**What to check:**
- [ ] Page loads without errors
- [ ] Map displays (California view)
- [ ] Left sidebar shows "Active Incidents"
- [ ] Right sidebar shows "AI Voice Assistant"
- [ ] Header shows "Police Dispatch Control Center"

**If map doesn't load:**
- Check browser console for errors
- Verify `NEXT_PUBLIC_MAPBOX_TOKEN` is set correctly
- Check Mapbox token has correct scopes

### Test 2: Incidents Display

**What to check:**
- [ ] Left sidebar shows the sample incident ("Robbery at Forbes & Morewood")
- [ ] Incident has a priority badge (High)
- [ ] Incident shows coordinates
- [ ] Incident shows status (0% resolved)

**If no incidents show:**
- Check Supabase connection in browser console
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Check Supabase SQL Editor for data

### Test 3: Map Markers

**What to check:**
- [ ] Map shows incident marker (red/orange pin)
- [ ] Map shows police station markers (blue pins)
- [ ] Clicking incident marker shows popup
- [ ] Popup displays incident details

**If markers don't show:**
- Check browser console for errors
- Verify coordinates are valid (not null/0)
- Check map zoom level (may need to zoom in)

---

## 🚓 Step 5: Unit Dispatch Testing

### Test 4: Create a Test Incident

In Supabase SQL Editor, run:

```sql
INSERT INTO incidents (name, status, priority, lat, lon, description, incident_type, reported_by)
VALUES 
('Test Assault', 'active', 'critical', 40.4433, -79.9436, 'Test incident for dispatch', 'assault', 'Test User');
```

**What to check:**
- [ ] New incident appears in left sidebar (within 1-2 seconds)
- [ ] New marker appears on map
- [ ] Real-time update works (no page refresh needed)

### Test 5: Dispatch a Unit

1. **Click on the incident** in the sidebar or map
2. **Check the "Available Units" panel** appears (bottom of left sidebar)
3. **Verify it shows:**
   - Available units count (should be 9)
   - "Send Unit" button is enabled
4. **Click "Send Unit" button**

**What to check:**
- [ ] Button shows "Dispatching..." briefly
- [ ] Available units count decreases by 1
- [ ] "En Route" count increases by 1
- [ ] Blue route line appears on map (from station to incident)
- [ ] Unit marker (blue car icon) appears and moves along route
- [ ] ETA displays in the panel

**If dispatch fails:**
- Check browser console for errors
- Verify API route `/api/dispatch-unit` is accessible
- Check Supabase `units` table for status updates

### Test 6: Unit Movement

**What to check:**
- [ ] Unit marker moves smoothly along the route
- [ ] Unit reaches incident location
- [ ] Status changes to "On Scene" automatically
- [ ] "On Scene" count increases
- [ ] Route line disappears when unit arrives

**Timing:**
- Route animation takes ~10 seconds (configurable)
- Unit should arrive at incident location

### Test 7: Multiple Dispatches

1. Create another incident:
```sql
INSERT INTO incidents (name, status, priority, lat, lon, description, incident_type, reported_by)
VALUES 
('Test Theft', 'active', 'medium', 40.4450, -79.9400, 'Another test', 'theft', 'Test');
```

2. Dispatch a unit to this new incident
3. **What to check:**
   - [ ] Both units can be dispatched simultaneously
   - [ ] Each unit has its own route
   - [ ] Unit stats update correctly for each incident

---

## 🗺️ Step 6: Map Interaction Tests

### Test 8: Incident Selection

1. **Click incident in sidebar**
2. **What to check:**
   - [ ] Map flies to incident location
   - [ ] Popup appears with incident details
   - [ ] Blue route line appears (from nearest station)
   - [ ] Environmental conditions panel appears (right sidebar)

### Test 9: Map Navigation

- [ ] Pan map (click and drag)
- [ ] Zoom in/out (scroll or pinch)
- [ ] Rotate map (right-click + drag)
- [ ] Adjust pitch (Ctrl + drag)
- [ ] Click "Reset View" button (bottom left)
- [ ] Map returns to California overview

### Test 10: Police Station Markers

1. **Click a blue police station marker**
2. **What to check:**
   - [ ] Popup shows station name
   - [ ] Popup shows city/county
   - [ ] Station information is correct

---

## 📊 Step 7: Real-Time Updates Test

### Test 11: Database Update Propagation

1. **Open Supabase SQL Editor** in a separate tab
2. **Update an incident:**
```sql
UPDATE incidents 
SET containment = 50, last_update = NOW()
WHERE name = 'Robbery at Forbes & Morewood';
```

3. **What to check:**
   - [ ] Dashboard updates automatically (within 1-2 seconds)
   - [ ] No page refresh needed
   - [ ] Containment percentage updates in sidebar
   - [ ] Real-time subscription works

### Test 12: New Incident Creation

1. **In Supabase SQL Editor:**
```sql
INSERT INTO incidents (name, status, priority, lat, lon, description, incident_type, reported_by)
VALUES 
('Live Test', 'active', 'high', 40.4400, -79.9500, 'Testing real-time', 'disturbance', 'Test');
```

2. **What to check:**
   - [ ] New incident appears in sidebar immediately
   - [ ] New marker appears on map
   - [ ] Count badge updates

---

## 🚨 Step 8: Emergency Alert Test

### Test 13: Send Emergency Alert

**Prerequisites:** Telegram bot configured

1. **Select an incident** (click on map or sidebar)
2. **Click "Alert: [Incident Name]" button** (bottom right)
3. **What to check:**
   - [ ] Button shows "Sending Alert..."
   - [ ] Success message appears
   - [ ] Telegram message received (if configured)
   - [ ] Message contains incident details

**If alert fails:**
- Check `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`
- Verify bot token is valid
- Check browser console for errors

---

## 🗣️ Step 9: Voice Assistant Test (Optional)

**Prerequisites:** VAPI account and assistant configured

1. **Click microphone button** in AI Assistant panel
2. **Allow microphone access** when prompted
3. **Speak a command:**
   - "What incidents are currently active?"
   - "What's the status of the robbery?"
   - "Show me available units"
4. **What to check:**
   - [ ] Microphone activates (red indicator)
   - [ ] Voice is transcribed
   - [ ] Assistant responds
   - [ ] Response appears in message history

---

## 🔍 Step 10: API Endpoint Tests

### Test 14: Incident State API

```bash
curl http://localhost:3000/api/incident-state
```

**Expected Response:**
```json
{
  "incidents": [
    {
      "id": "...",
      "name": "Robbery at Forbes & Morewood",
      "lat": 40.4427,
      "lon": -79.9425,
      "priority": "high",
      ...
    }
  ],
  "stations": [...],
  "count": {
    "active_incidents": 1,
    "stations": 3
  }
}
```

### Test 15: Dispatch Unit API

```bash
curl -X POST http://localhost:3000/api/dispatch-unit \
  -H "Content-Type: application/json" \
  -d '{
    "incidentId": "your-incident-id-here",
    "incidentLat": 40.4427,
    "incidentLon": -79.9425
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "unit": {
    "id": "...",
    "unit_number": "Unit 1-1",
    "station_name": "Station 1 - Downtown",
    ...
  },
  "route": {
    "geometry": {...},
    "distance": 2500,
    "duration": 300
  }
}
```

### Test 16: Unit Stats API

```bash
curl http://localhost:3000/api/dispatch-unit
```

**Expected Response:**
```json
{
  "stats": [...],
  "activeUnits": [...],
  "totals": {
    "available": 8,
    "dispatched": 1,
    "on_scene": 0,
    "total": 9
  }
}
```

---

## 🐛 Troubleshooting

### Issue: Map doesn't load

**Solutions:**
- Check `NEXT_PUBLIC_MAPBOX_TOKEN` in `.env.local`
- Verify token has correct scopes in Mapbox dashboard
- Check browser console for CORS or token errors
- Try hard refresh (Cmd/Ctrl + Shift + R)

### Issue: No incidents showing

**Solutions:**
- Verify Supabase connection (check browser console)
- Run database schema SQL again
- Check `incidents` table has data:
  ```sql
  SELECT * FROM incidents;
  ```
- Verify realtime is enabled:
  ```sql
  SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';
  ```

### Issue: Units don't dispatch

**Solutions:**
- Check browser console for API errors
- Verify units exist and are available:
  ```sql
  SELECT * FROM units WHERE status = 'available';
  ```
- Check API route is accessible: `http://localhost:3000/api/dispatch-unit`
- Verify Mapbox token for route calculation

### Issue: Real-time updates don't work

**Solutions:**
- Check Supabase realtime is enabled for tables
- Verify `NEXT_PUBLIC_SUPABASE_URL` and key are correct
- Check browser console for subscription errors
- Try refreshing the page

### Issue: Database errors

**Solutions:**
- Verify schema was run completely
- Check table names match (police_stations vs firestations)
- Verify foreign key relationships
- Check Supabase logs in dashboard

---

## 📝 Test Data Scripts

### Create Multiple Test Incidents

```sql
INSERT INTO incidents (name, status, priority, lat, lon, description, incident_type, reported_by)
VALUES 
('Robbery at Forbes & Morewood', 'active', 'high', 40.4427, -79.9425, 'Reported robbery', 'robbery', 'Dispatch'),
('Assault at Schenley Park', 'active', 'critical', 40.4387, -79.9438, 'Physical altercation', 'assault', 'Dispatch'),
('Traffic Accident on Fifth Ave', 'active', 'medium', 40.4406, -79.9959, 'Multi-car collision', 'traffic', 'Dispatch'),
('Disturbance at CMU', 'active', 'low', 40.4433, -79.9436, 'Noise complaint', 'disturbance', 'Dispatch');
```

### Reset All Units to Available

```sql
UPDATE units 
SET status = 'available', 
    incident_id = NULL, 
    dispatched_at = NULL, 
    arrived_at = NULL;
```

### Clear All Dispatches

```sql
DELETE FROM dispatches;
```

---

## ✅ Testing Checklist Summary

- [ ] Environment variables configured
- [ ] Database schema run successfully
- [ ] Development server starts without errors
- [ ] Dashboard loads and displays map
- [ ] Incidents appear in sidebar
- [ ] Map markers display correctly
- [ ] Can select incidents
- [ ] Can dispatch units
- [ ] Units move along routes
- [ ] Units arrive at incidents
- [ ] Real-time updates work
- [ ] Emergency alerts send (if configured)
- [ ] API endpoints respond correctly
- [ ] Map navigation works
- [ ] Police stations display

---

## 🎯 Next Steps After Testing

Once basic functionality is verified:

1. **Add more test data** (incidents, units)
2. **Test edge cases** (no available units, invalid coordinates)
3. **Test performance** (many incidents, many units)
4. **Configure voice assistant** (if needed)
5. **Set up production deployment**

---

**Happy Testing! 🚓**

If you encounter issues, check:
- Browser console for errors
- Supabase logs in dashboard
- Network tab for failed API calls
- Database queries for data issues
