# 🔥 Orion - Wildfire Operations Dashboard

<div align="center">

![Orion Logo](public/placeholder-logo.png)

**AI-Powered Wildfire Command Center with Autonomous Agents, Live Video Streaming, and Real-Time Intelligence**

_Built at CalHacks • Transforming Emergency Response through AI_

> TartanHacks police-dispatch fork: Supabase has been replaced by an in-memory mock, so the app runs fully offline with sample incidents, stations, and units.

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Stubbed-lightgray?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

### 🔥 **Live Video Intelligence** • 🤖 **Autonomous AI Agents** • 🗣️ **Voice Operations** • 🗺️ **3D Fire Simulation** • 🚨 **Smart Alerts**

[🚀 Features](#-features) • [🎬 User Flow](#-user-flow) • [🛠️ Installation](#️-installation) • [⚙️ Configuration](#️-configuration) • [🏗️ Architecture](#️-architecture)

</div>

---

## 📋 Table of Contents

- [Feature Highlights](#-feature-highlights)
- [Overview](#-overview)
  - [Product Purpose](#-product-purpose)
  - [Key Capabilities](#-key-capabilities)
- [Features](#-features)
  - [Interactive 3D Map](#️-interactive-3d-map)
  - [AI Voice Assistant](#-ai-voice-assistant)
  - [Environmental Conditions](#️-environmental-conditions)
  - [Emergency Alert System](#-emergency-alert-system)
  - [Incident Management](#-incident-management)
  - [Video Preview System](#-video-preview-system)
  - [Autonomous AI Agent System](#-autonomous-ai-agent-system)
  - [Modern UI/UX](#-modern-uiux)
- [User Flow](#-user-flow)
  - [Complete Operational Workflow](#complete-operational-workflow)
  - [Real-Time Synchronization Flow](#-real-time-synchronization-flow)
  - [Typical Use Cases](#-typical-use-cases)
- [Technology Stack](#️-technology-stack)
- [Installation](#️-installation)
- [Configuration](#️-configuration)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [Architecture](#️-architecture)
- [API Reference](#-api-reference)
- [Database Schema](#-database-schema)
- [Components](#-components)
- [Real-Time Features](#-real-time-features)
- [Styling & Theming](#-styling--theming)
- [Testing](#-testing)
- [Performance Optimizations](#-performance-optimizations)
- [Security Considerations](#-security-considerations)
- [Future Enhancements](#-future-enhancements)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)
- [Team](#-team)
- [Acknowledgments](#-acknowledgments)
- [Resources](#-resources)

---

## 🎯 Feature Highlights

<div align="center">

### **🔥 What Makes Orion Special**

| Feature                       | Description                                                                | Technology                               |
| ----------------------------- | -------------------------------------------------------------------------- | ---------------------------------------- |
| 🤖 **Autonomous AI Agents**   | Background Python + Fetch.ai agents monitor fires and optimize routes 24/7 | Python, Fetch.ai, Real-time APIs         |
| 🗣️ **Voice AI Operations**    | Hands-free incident management with conversational AI assistant            | VAPI, Natural Language Processing        |
| 📹 **Live Video Streaming**   | Real-time fire footage embedded directly in map interface                  | Embedded video players, MP4 streaming    |
| 🗺️ **3D Fire Visualization**  | Physics-based fire spread with wind-influenced directional growth          | Mapbox GL, Multi-octave noise algorithms |
| 🚨 **Multi-Channel Alerts**   | Automated SMS + Telegram emergency alerts with intelligent routing         | Telegram Bot API, Composio               |
| 📊 **Real-Time Intelligence** | Live weather, air quality, and environmental risk assessment               | Open-Meteo API, Supabase Realtime        |
| 🛣️ **Dynamic Rerouting**      | AI-calculated evacuation routes that adapt to fire spread patterns         | Mapbox Directions API, AI optimization   |
| ⚡ **Instant Sync**           | Sub-second database updates across all connected clients                   | Supabase Realtime subscriptions          |

</div>

---

## 🌟 Overview

**Orion** is a next-generation, AI-powered wildfire operations command center designed for emergency response teams, fire departments, and incident commanders. Built during CalHacks, Orion transforms wildfire response through real-time intelligence, autonomous decision-making, and seamless human-AI collaboration.

### 🎯 Product Purpose

Orion addresses the critical challenge of wildfire response coordination by providing a **unified command platform** that combines:

- **Real-time situational awareness** across all active fires
- **AI-driven decision support** for resource deployment and routing
- **Voice-activated operations** for hands-free incident management
- **Automated emergency communications** via multiple channels
- **Live video intelligence** from fire locations
- **Predictive fire behavior modeling** with environmental data integration

**Mission**: Reduce emergency response times, optimize resource allocation, and save lives through intelligent automation and real-time coordination.

### 🚀 Key Capabilities

#### 🔥 **Intelligent Fire Operations**

- **Real-Time Incident Tracking**: Monitor active wildfires with live database updates and automatic synchronization
- **AI Agent Fire Monitoring**: Autonomous Python agent continuously monitors fire states and recommends optimal response strategies
- **Dynamic Fire Spread Visualization**: Physics-based fire simulation with wind, terrain, and fuel modeling
- **Live Video Streaming**: Real-time video feeds from active fire locations embedded in map interface

#### 🤖 **Autonomous AI Systems**

- **Agentic Voice AI**: Conversational AI assistant powered by VAPI for hands-free operations
- **AI Route Optimization**: Fetch.ai agents automatically calculate and recommend evacuation routes and fire station deployment paths
- **Intelligent Alert System**: AI-powered SMS/Telegram alerts with contextual fire information
- **Predictive Risk Assessment**: Real-time fire danger analysis based on environmental conditions

#### 🗺️ **Advanced Geospatial Intelligence**

- **3D Interactive Mapping**: Mapbox GL terrain visualization with realistic elevation and buildings
- **Live Route Planning**: Dynamic rerouting based on fire spread, road closures, and risk zones
- **Evacuation Zone Mapping**: Automatic generation of evacuation perimeters
- **Fire Station Network**: Nearest station identification with optimal response routing

#### 📊 **Real-Time Environmental Monitoring**

- **Weather Integration**: Live temperature, humidity, wind speed/direction from Open-Meteo API
- **Air Quality Tracking**: PM2.5, PM10, and AQI monitoring for health advisories
- **Fire Risk Scoring**: Dynamic fire danger index based on multiple environmental factors
- **Visibility Tracking**: Real-time visibility conditions for aviation and ground operations

#### 🚨 **Multi-Channel Emergency Communications**

- **SMS Emergency Alerts**: Automated SMS dispatch to emergency contacts and responders
- **Telegram Integration**: Instant messaging to command channels with formatted incident reports
- **Voice Notifications**: AI-generated voice alerts for critical situations
- **Alert Tracking**: Message delivery confirmation and status monitoring

---

## ✨ Features

### 🗺️ Interactive 3D Map

- **Mapbox GL 3D Terrain Visualization**

  - 3D buildings and terrain with realistic elevation
  - Dynamic day/night sky rendering
  - Smooth camera animations and transitions
  - Pan, zoom, pitch, and rotate controls

- **Fire Incident Markers**

  - Color-coded by risk level (Critical, High, Medium, Low)
  - Animated pulse effects for active fires
  - Particle trails for critical incidents
  - Clickable markers with detailed popups
  - Fire name labels with risk-based styling

- **Dynamic Fire Spread Visualization**

  - Realistic organic fire spread patterns using multi-octave noise algorithms
  - Directional growth simulation (wind, terrain, fuel)
  - Non-uniform expansion with emergence from center
  - Subtle edge flickering for dynamic appearance
  - Color-coded heat intensity gradients

- **Fire Station Network**
  - Visual fire station markers across California
  - Station information popups (name, city, county)
  - Automatic routing to nearest station
  - Blue route lines showing optimal response paths
  - Directional arrow animations on routes

### 🤖 AI Voice Assistant

- **VAPI Integration**

  - Natural language processing for voice commands
  - Real-time transcription of conversations
  - Voice-activated incident reporting
  - Contextual responses about fire conditions
  - Volume level visualization
  - Session management (start/stop)

- **Conversation Interface**
  - Timestamped message history
  - User/Assistant role differentiation
  - Speaking status indicators
  - Offline/Live session states
  - Collapsible panel design

### 🌤️ Environmental Conditions

- **Real-Time Weather Data** (Open-Meteo API)

  - Temperature (°F) with color-coded risk levels
  - Relative humidity with fire risk indicators
  - Wind speed (mph) and direction
  - Visibility conditions (miles)
  - Weather descriptions

- **Air Quality Monitoring**

  - US AQI (Air Quality Index)
  - PM2.5 and PM10 particulate matter
  - Risk-based color coding (Good to Very Unhealthy)
  - Real-time updates based on map location

- **Fire Risk Analysis**
  - Fire Danger Index (Extreme to Low)
  - Fuel Moisture levels
  - Combined environmental risk assessment
  - Visual progress bars for risk factors

### 🚨 Emergency Alert System

- **Telegram Integration** (via Composio)

  - One-click emergency alert dispatch
  - Formatted alert messages with incident details
  - Fire name, location, risk level, containment
  - Timestamp and coordinates
  - Custom message support
  - Multi-chat broadcasting capability

- **Alert Management**
  - Selected incident targeting
  - Success/failure status notifications
  - Message ID tracking
  - Retry mechanisms

### 🚒 Emergency Responder System

- **Response Team Management**

  - Track available, dispatched, and on-scene teams
  - Each fire station has multiple response teams (default: 3)
  - Real-time team status updates
  - Automatic nearest station selection

- **Dynamic Dispatch**

  - One-click responder deployment
  - Automatic route calculation to fire location
  - Animated firetruck markers moving along routes
  - Travel time estimation (configurable ~30 seconds)
  - Status updates: available → dispatched → en route → on scene

- **Fire Containment**

  - Fires automatically shrink when responders arrive
  - Containment rate: 60 seconds per responder team
  - Multiple teams speed up containment
  - Real-time containment percentage updates
  - Visual fire size reduction on map

- **Team Tracking**
  - Live position updates every 2 seconds
  - Team number identification (Team 1, 2, 3, etc.)
  - Station association and deployment history
  - Arrival detection and automatic status change

### 📊 Incident Management

- **Real-Time Incident List**

  - Live updates via Supabase Realtime
  - Risk-based badge indicators
  - Containment percentages
  - Incident ID tracking
  - Last update timestamps
  - Coordinates display

- **Incident Details**
  - Name, status, and description
  - Precise GPS coordinates
  - Risk level classification
  - Containment progress
  - Video feed availability
  - Historical update tracking

### 🎥 Video Preview System

- **Live Fire Footage**
  - Embedded video players in map popups
  - Auto-play with mute
  - Click to play/pause
  - Video thumbnails
  - Fallback for unavailable feeds
  - Dynamic video mapping by fire name

### 🤖 Autonomous AI Agent System

#### **Python Fire Monitoring Agent**

- **Autonomous Fire State Tracking**: Background Python agent continuously monitors fire database for changes
- **Risk Assessment**: Automatically calculates risk scores based on spread rate, containment, and environmental factors
- **Anomaly Detection**: Identifies unusual fire behavior patterns requiring immediate attention
- **Smart Alerting**: Triggers notifications when fires meet specific risk thresholds
- **Polling Interval**: 60-second intervals for near-real-time monitoring
- **State Comparison**: Tracks historical states to detect changes in containment, risk, or location

#### **Fetch.ai Route Optimization Agent**

- **Dynamic Route Calculation**: AI agent computes optimal routes from fire stations to fire locations
- **Evacuation Planning**: Automatically generates evacuation perimeters and safe exit routes
- **Road Network Analysis**: Considers traffic, road conditions, and fire proximity
- **Real-Time Rerouting**: Updates routes when fire spreads or roads become unsafe
- **Multi-Objective Optimization**: Balances fastest response time with safest paths
- **Visualization**: Routes displayed as orange dashed lines on map interface

#### **AI-Powered Decision Support**

- **Resource Allocation**: Suggests optimal deployment of firefighting resources
- **Priority Ranking**: Orders incidents by urgency based on multiple factors
- **Predictive Modeling**: Forecasts fire spread patterns using weather + terrain data
- **Coordination Intelligence**: Identifies conflicts in resource allocation across multiple fires
- **Historical Learning**: Improves recommendations based on past incident outcomes

#### **Integration Architecture**

```
┌──────────────────────────────────────────────────────────┐
│           Orion AI Agent Ecosystem                       │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────┐      ┌──────────────┐                 │
│  │   Python     │      │  Fetch.ai    │                 │
│  │   Agent      │◄────►│   Agent      │                 │
│  │ (Monitoring) │      │  (Routing)   │                 │
│  └──────┬───────┘      └──────┬───────┘                 │
│         │                      │                          │
│         └──────────┬───────────┘                          │
│                    │                                      │
│         ┌──────────▼───────────┐                         │
│         │   API Routes         │                         │
│         │ /api/fire-state      │                         │
│         │ /api/update-routes   │                         │
│         └──────────┬───────────┘                         │
│                    │                                      │
│         ┌──────────▼───────────┐                         │
│         │   Dashboard UI       │                         │
│         │ - Map visualization  │                         │
│         │ - Route display      │                         │
│         │ - Alert notifications│                         │
│         └──────────────────────┘                         │
└──────────────────────────────────────────────────────────┘
```

#### **Agent Communication Flow**

```
Fire State Change (Supabase) → Python Agent Detects →
Risk Analysis → Fetch.ai Route Calculation →
API Push to Dashboard → Map Updates →
User Notification → Emergency Response
```

### 💎 Modern UI/UX

- **Glass Morphism Design**

  - Frosted glass panels with backdrop blur
  - Semi-transparent overlays
  - Smooth shadows and borders
  - Depth-based layering

- **Responsive Layout**

  - Left sidebar: Active Incidents list
  - Right sidebar: AI Assistant, Environmental Conditions, Emergency Alerts
  - Center: Full-screen interactive map
  - Collapsible panels to maximize map space
  - Mobile-responsive design patterns

- **Visual Feedback**

  - Hover effects and transitions
  - Fire glow effects for critical elements
  - Cyan glow for active status indicators
  - Smooth animations and fades
  - Scale transformations on interaction

- **Dark Theme Optimized**
  - Dark background for reduced eye strain
  - High contrast text for readability
  - Color-coded risk indicators
  - Vignette overlay for depth

---

## 🎬 User Flow

### Complete Operational Workflow

#### 1️⃣ **Dashboard Launch & Initialization**

```
User opens Orion → California map loads with 3D terrain →
Real-time fire incidents populate → Fire spread animations begin →
Weather data loads for current view → AI systems initialize
```

**What You See:**

- Full-screen interactive 3D map of California
- Active fire markers with pulsing animations (color-coded by risk)
- Left sidebar showing active incidents list with real-time updates
- Right sidebar with AI Voice Assistant (offline state)
- Environmental conditions panel (hidden until fire selected)
- Top navigation with current wind conditions

#### 2️⃣ **Incident Discovery & Navigation**

```
User clicks on fire incident (map marker or sidebar list) →
Map flies to incident location with smooth animation →
Popup appears showing incident details + live video feed →
Nearest fire station identified automatically →
Optimal response route calculated and displayed →
Environmental conditions panel appears with local weather
```

**Interactive Elements:**

- **Click Fire Marker**: Zoom to location, show popup with video
- **Click Sidebar Incident**: Navigate to fire location on map
- **View Live Video**: Embedded video player with click-to-play controls
- **Route Visualization**: Blue route line from nearest fire station to fire
- **Fire Label**: Name label appears on selected fire

#### 3️⃣ **AI Voice Assistant Activation**

```
User clicks microphone button → Voice session starts →
User speaks: "What's the status of Pine Ridge Fire?" →
VAPI transcribes speech → AI processes query →
Assistant responds with current containment, risk level, conditions →
Response appears in message history with timestamp →
Audio plays through speakers
```

**Voice Commands You Can Use:**

- "Show me all critical fires"
- "What's the weather at [fire name]?"
- "How many fires are currently active?"
- "What's the containment status of [fire name]?"
- "Report a new fire at [location]"
- "What's the air quality near [fire name]?"

**Visual Feedback:**

- Volume level indicator shows microphone input
- Speaking status animation when AI is responding
- Timestamped message history for full conversation
- Live/Offline status indicator

#### 4️⃣ **AI Agent Recommendations (Background)**

```
Python agent monitors fire state changes →
Detects risk increase or spread pattern change →
Fetch.ai agent calculates optimal evacuation routes →
Recommendations pushed to dashboard via API →
Orange dashed lines appear on map showing AI-recommended routes →
Evacuation zones displayed as red polygons →
Command center receives real-time intelligence
```

**Autonomous Operations:**

- **Fire State Monitoring**: Python agent polls fire data every 60 seconds
- **Route Optimization**: AI calculates safest paths avoiding fire zones
- **Evacuation Planning**: Automatic evacuation boundary generation
- **Risk Scoring**: Continuous risk assessment based on spread patterns
- **Resource Allocation**: Suggests optimal fire station deployment

**Map Visualization:**

- **AI Routes**: Orange dashed lines (fire station → fire, updated paths)
- **Evacuation Zones**: Red translucent polygons with dashed borders
- **Fire Spread**: Growing organic polygons showing fire perimeter
- **Station Routes**: Blue solid lines for current response paths

#### 5️⃣ **Environmental Monitoring**

```
User views selected fire → Environmental Conditions panel expands →
Shows real-time weather data from Open-Meteo API →
Displays humidity, temperature, visibility, air quality →
Color-coded indicators show risk levels →
Fire danger index and fuel moisture displayed →
Updates automatically as map moves
```

**Risk-Based Color Coding:**

- **Humidity**: <20% = Critical (Red), 20-30% = High (Orange), >50% = Good (Cyan)
- **Temperature**: >100°F = Extreme (Red), 90-100°F = High (Orange), <70°F = Good (Cyan)
- **Air Quality**: >201 AQI = Very Unhealthy (Maroon), 151-200 = Unhealthy (Red)
- **Fire Danger**: Extreme = 95% bar (Red), Critical = 88% bar (Orange)

#### 6️⃣ **Emergency Alert Dispatch**

```
User selects critical fire incident →
Environmental panel shows dangerous conditions →
User clicks "Alert: [Fire Name]" button →
System sends formatted alert via Telegram + SMS →
Alert includes: Fire name, location, risk level, containment →
Coordinates, timestamp, and current conditions →
Success confirmation appears with message ID →
Emergency responders receive alert on devices
```

**Alert Content Example:**

```
🚨 WILDFIRE ALERT 🚨

Fire: Pine Ridge Fire
Risk Level: CRITICAL
Location: 38.5°N, -121.8°W
Containment: 15%

Conditions:
- Temperature: 98°F
- Humidity: 18%
- Wind: 25 mph ESE
- Fire Danger: EXTREME

Timestamp: 2024-10-26 14:30 UTC

Nearest Station: Station 3
Response Route: Active
```

**Alert Channels:**

- ✅ Telegram bot messages to command channels
- ✅ SMS alerts to emergency contacts
- ✅ In-dashboard confirmation with message ID
- ✅ Delivery status tracking

#### 7️⃣ **Live Fire Spread Monitoring**

```
Fire polygons animate in real-time →
Wind-influenced directional growth (physics-based) →
Organic edges with multi-octave noise patterns →
Fire grows from center outward over 4 minutes →
Color gradient shows heat intensity →
Pulse animation on critical fires →
Containment percentages update live via Supabase
```

**Fire Visualization Features:**

- **Realistic Spread**: Wind direction influences growth patterns
- **Organic Shapes**: Multi-octave noise for natural-looking edges
- **Time-Based Growth**: Starts small, expands over 240 seconds
- **Color Intensity**: Dark red (core) → Orange (edges) gradient
- **Glow Effects**: Outer glow for depth and realism
- **Stable Rendering**: Smooth animation without flickering

#### 8️⃣ **Live Video Intelligence**

```
User clicks fire marker → Popup displays →
Video feed loads from fire location →
Auto-plays on mute with click-to-play controls →
Shows real-time footage from drone or fixed camera →
User can observe smoke, flames, spread direction →
Visual intelligence aids decision-making
```

**Video Features:**

- **Embedded Player**: Video in map popup for immediate context
- **Auto-Play**: Muted auto-play for quick awareness
- **Interactive Controls**: Click to play/pause
- **Fallback State**: "Livestream Unavailable" for fires without video
- **Thumbnail Support**: Video thumbnails for preview

#### 9️⃣ **Multi-Fire Coordination**

```
Dashboard shows 3+ active fires simultaneously →
Each fire has independent spread simulation →
Priority indicated by risk badges (Critical, High, Medium, Low) →
User can toggle between fires quickly →
All fire states tracked in left sidebar →
Real-time count badge shows total active incidents →
Command center maintains awareness of all situations
```

**Coordination Features:**

- **Incident List**: Scrollable list with containment percentages
- **Quick Navigation**: Click any incident to jump to location
- **Risk Sorting**: Incidents ordered by last update time
- **Status Badges**: Color-coded risk indicators
- **Count Display**: Total active incidents in badge
- **Real-time Sync**: Automatic updates via Supabase Realtime

#### 🔟 **Map Controls & Reset**

```
User explores map freely →
Pan, zoom, pitch, rotate controls →
Click-drag to move, scroll to zoom →
Right-click-drag to rotate bearing →
Ctrl+drag to adjust pitch angle →
"Reset View" button returns to California overview →
All selections cleared, routes removed
```

**Navigation:**

- **Pan**: Click + drag
- **Zoom**: Scroll or pinch
- **Rotate**: Right-click + drag
- **Pitch**: Ctrl + drag up/down
- **Reset**: Bottom-left reset button
- **Scale**: Imperial scale indicator (miles)

### 🔄 Real-Time Synchronization Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      Orion Dashboard                         │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
   ┌────▼────┐    ┌────▼────┐    ┌────▼────┐
   │Supabase │    │  APIs   │    │AI Agents│
   │Realtime │    │(Weather)│    │(Fetch.ai│
   │         │    │         │    │ Python) │
   └────┬────┘    └────┬────┘    └────┬────┘
        │               │               │
        │          ┌────▼────┐          │
        │          │  Map    │          │
        │          │ Updates │          │
        │          └─────────┘          │
        │                               │
   ┌────▼────────────────────────────────▼────┐
   │  Fire Updates → AI Processing →          │
   │  Route Calculations → Map Display →      │
   │  User Actions → Emergency Alerts         │
   └──────────────────────────────────────────┘
```

### 🎯 Typical Use Cases

#### **Scenario 1: New Fire Detected**

1. AI agent detects new fire entry in database
2. Fire appears on map with spreading animation
3. Nearest fire station automatically identified
4. Response route calculated and displayed
5. Voice assistant notifies: "New critical fire detected: [Name]"
6. User clicks to view details
7. Emergency alert dispatched to responders

#### **Scenario 2: Fire Containment Increases**

1. Fire crew updates containment percentage in field
2. Database update triggers Realtime subscription
3. Dashboard updates containment value instantly
4. Risk level automatically recalculated
5. If contained, fire marker changes color
6. Voice assistant can report updated status on request

#### **Scenario 3: Wind Conditions Change**

1. User pans map to new area
2. Weather API fetched for new coordinates
3. Environmental panel updates with new wind data
4. Fire spread visualization adjusts (for new fires)
5. Risk assessment recalculated with new conditions
6. AI agent recommends route adjustments if needed

#### **Scenario 4: Mass Evacuation Required**

1. Fire spreads rapidly (critical risk)
2. AI agent calculates evacuation zones
3. Red polygons appear on map showing danger areas
4. Optimal evacuation routes recommended (green/orange paths)
5. Emergency alerts sent to affected areas via SMS/Telegram
6. Voice assistant provides evacuation instructions
7. Command center coordinates response with real-time intelligence

---

## 🛠️ Technology Stack

### Frontend

- **[Next.js 16](https://nextjs.org/)** - React framework with App Router
- **[React 18](https://react.dev/)** - UI library
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Headless UI components
- **[Lucide React](https://lucide.dev/)** - Icon library
- **[class-variance-authority](https://cva.style/)** - Component variants

### Mapping & Visualization

- **[Mapbox GL JS](https://www.mapbox.com/mapbox-gljs)** - Interactive 3D maps
- **[react-map-gl](https://visgl.github.io/react-map-gl/)** - React wrapper for Mapbox
- **Custom Fire Simulation** - Procedural fire spread algorithms

### Backend & Database

- **[Supabase](https://supabase.com/)** - PostgreSQL database with real-time subscriptions
- **Supabase Realtime** - Live database change notifications
- **Next.js API Routes** - Serverless API endpoints

### AI & Voice

- **[VAPI](https://vapi.ai/)** - Voice AI platform
- **Natural Language Processing** - Voice command interpretation
- **Real-time Transcription** - Speech-to-text conversion

### External APIs

- **[Open-Meteo](https://open-meteo.com/)** - Weather and air quality data (free, no API key)
- **[Telegram Bot API](https://core.telegram.org/bots/api)** - Emergency alert messaging
- **[Composio](https://composio.dev/)** - Integration platform for Telegram
- **[Mapbox Directions API](https://docs.mapbox.com/api/navigation/directions/)** - Route optimization

### Development Tools

- **[ESLint](https://eslint.org/)** - Code linting
- **[PostCSS](https://postcss.org/)** - CSS processing
- **[Lightning CSS](https://lightningcss.dev/)** - Fast CSS bundling

---

## 🚀 Installation

### Prerequisites

- **Node.js** 18.x or higher
- **npm** or **pnpm** package manager
- **Git** for version control
- **Supabase account** for database
- **Mapbox account** for map API
- **VAPI account** for voice AI
- **Telegram Bot** for emergency alerts

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-org/orion.git
cd orion
```

### Step 2: Install Dependencies

```bash
npm install
# or
pnpm install
```

### Step 3: Environment Configuration

Create a `.env.local` file in the root directory:

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

# Composio Configuration
COMPOSIO_API_KEY=your_composio_api_key
```

### Step 4: Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the following SQL in your Supabase SQL Editor:

```sql
-- Create incidents table
CREATE TABLE incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  status TEXT CHECK (status IN ('active', 'contained', 'extinguished')),
  risk TEXT CHECK (risk IN ('low', 'medium', 'high', 'critical')),
  lat NUMERIC,
  lon NUMERIC,
  containment NUMERIC,
  start_time TIMESTAMPTZ DEFAULT NOW(),
  last_update TIMESTAMPTZ DEFAULT NOW(),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create firestations table
CREATE TABLE firestations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT,
  county TEXT,
  lat NUMERIC NOT NULL,
  lon NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE incidents;
ALTER PUBLICATION supabase_realtime ADD TABLE firestations;

-- Create indexes for performance
CREATE INDEX incidents_last_update_idx ON incidents(last_update DESC);
CREATE INDEX incidents_status_idx ON incidents(status);
CREATE INDEX firestations_location_idx ON firestations(lat, lon);
```

3. Insert sample fire station data (optional):

```sql
INSERT INTO firestations (name, city, county, lat, lon) VALUES
('Station 1', 'San Francisco', 'San Francisco', 37.7749, -122.4194),
('Station 2', 'Los Angeles', 'Los Angeles', 34.0522, -118.2437),
('Station 3', 'San Diego', 'San Diego', 32.7157, -117.1611);
```

4. Run the responder system migration:

Copy and run the SQL from `supabase/migrations/create_responders.sql` in your Supabase SQL Editor. This will:

- Create the `responders` table
- Seed initial response teams (3 per fire station)
- Create indexes for performance
- Set up the `responder_stats` view

### Step 5: Mapbox Setup

1. Sign up at [mapbox.com](https://www.mapbox.com/)
2. Create an access token with the following scopes:
   - `styles:read`
   - `fonts:read`
   - `datasets:read`
3. Add the token to `.env.local`

### Step 6: VAPI Setup

1. Sign up at [vapi.ai](https://vapi.ai/)
2. Create a voice assistant in the VAPI dashboard
3. Configure the assistant with wildfire-specific prompts:
   - "You are an AI assistant for a wildfire operations dashboard..."
   - Enable voice-to-text and text-to-voice
4. Copy the assistant ID and update in `hooks/use-vapi.ts` (line 107)
5. Copy the public key to `.env.local`

### Step 7: Telegram Setup

1. Create a bot with [@BotFather](https://t.me/BotFather) on Telegram
2. Get your bot token
3. Get your chat ID by messaging [@userinfobot](https://t.me/userinfobot)
4. Add credentials to `.env.local`

### Step 8: Run Development Server

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Configuration

### Mapbox Token Configuration

Update the Mapbox token in `components/california-map.tsx` (line 718):

```typescript
mapboxgl.accessToken = "your_token_here";
```

Or set it via environment variable and reference it:

```typescript
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;
```

### VAPI Assistant ID

Update the assistant ID in `hooks/use-vapi.ts` (line 107):

```typescript
await vapi.start("your-assistant-id");
```

### Video Mapping

To add video support for specific fires, update `lib/video-mapping.ts`:

```typescript
export const FIRE_VIDEOS: FireVideoMap = {
  "Pine Ridge Fire": {
    videoUrl: "/videos/pine-ridge-fire.mp4",
    thumbnailUrl: "/videos/pine-ridge-fire-thumb.jpg",
  },
  "Redwood Valley Fire": {
    videoUrl: "/videos/redwood-valley-fire.mp4",
    thumbnailUrl: "/videos/redwood-valley-fire-thumb.jpg",
  },
  // Add more fires here
};
```

Place video files in the `public/videos/` directory.

### Fire Simulation Parameters

Adjust fire spread behavior in `components/california-map.tsx`:

```typescript
// Base radius multiplier (line 818)
baseRadius: getBaseRadiusMeters(incident) * 2.5,

// Growth rate (line 822)
expansionRate: getExpansionRate(incident),

// Spread duration (line 914)
const growthProgress = Math.min(elapsedSeconds / 120, 1); // 120 seconds
```

---

## 📖 Usage

### Starting the Dashboard

1. **Launch Application**: Run `npm run dev` and navigate to `http://localhost:3000`
2. **Initial View**: You'll see California centered with active fire incidents
3. **Map Navigation**:
   - Click and drag to pan
   - Scroll to zoom
   - Right-click + drag to rotate
   - Ctrl + drag to adjust pitch

### Monitoring Incidents

1. **View Active Incidents**: Check the left sidebar "Active Incidents" panel
2. **Click on Incident**: Navigate to fire location on map
3. **View Details**: Popup shows:
   - Fire name and description
   - Status and intensity
   - Containment percentage
   - Video feed (if available)
4. **Route Display**: Blue line shows optimal route from nearest fire station

### Using Voice Assistant

1. **Activate**: Click the microphone button in the AI Assistant panel
2. **Speak Naturally**: Ask questions like:
   - "What fires are currently active?"
   - "What's the status of Pine Ridge Fire?"
   - "Show me weather conditions"
3. **View Responses**: Assistant replies appear in real-time with timestamps
4. **Deactivate**: Click the red microphone icon to end session

### Checking Environmental Conditions

1. **Select Fire**: Click on a fire incident marker
2. **View Panel**: Environmental Conditions panel appears on right sidebar
3. **Monitor Metrics**:
   - Humidity (critical if < 20%)
   - Temperature (extreme if > 100°F)
   - Visibility (poor if < 1 mile)
   - Air Quality Index
   - Fire Danger level
   - Fuel Moisture

### Sending Emergency Alerts

1. **Select Incident**: Click on a fire from the map or sidebar
2. **Click Alert Button**: Orange "Alert: [Fire Name]" button at bottom right
3. **Confirmation**: Status message appears showing success/failure
4. **Telegram Delivery**: Alert sent to configured Telegram chat

### Managing Panel Views

- **Collapse Panels**: Click the minimize icon to save screen space
- **Expand Panels**: Click on collapsed panel header to expand
- **Reset View**: Click "Reset View" button at bottom left to return to California overview

---

## 📁 Project Structure

```
CalHacks/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── send-emergency-alert/ # Telegram alert endpoint
│   │   │   └── route.ts
│   │   └── weather/              # Weather API proxy
│   │       └── route.ts
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Main dashboard page
│   └── test-video/               # Video testing page
│       └── page.tsx
├── components/                   # React components
│   ├── ui/                       # Reusable UI components (Radix)
│   │   ├── button.tsx
│   │   ├── badge.tsx
│   │   ├── card.tsx
│   │   └── ...                   # 50+ UI components
│   ├── california-map.tsx        # Main map component
│   ├── IncidentsList.tsx         # Incidents sidebar
│   ├── VideoPreview.tsx          # Video player component
│   └── voice-assistant.tsx       # Voice AI interface
├── hooks/                        # Custom React hooks
│   ├── use-vapi.ts              # VAPI voice integration
│   ├── use-weather.ts           # Weather data fetching
│   ├── use-mobile.ts            # Mobile detection
│   └── use-toast.ts             # Toast notifications
├── lib/                          # Utility libraries
│   ├── composio-telegram-service.ts  # Telegram integration
│   ├── supabase-client.ts            # Supabase client setup
│   ├── utils.ts                      # Helper functions
│   └── video-mapping.ts              # Fire video mappings
├── public/                       # Static assets
│   ├── videos/                   # Fire video files
│   │   ├── pine-ridge-fire.mp4
│   │   ├── redwood-valley-fire.mp4
│   │   └── README.md
│   └── *.svg, *.png             # Images and logos
├── styles/                       # Additional stylesheets
│   └── globals.css
├── .env.local                    # Environment variables (create this)
├── amplify.yml                   # AWS Amplify config
├── components.json               # shadcn/ui config
├── mcp.json                      # MCP config
├── next.config.mjs               # Next.js configuration
├── package.json                  # Dependencies
├── postcss.config.mjs            # PostCSS configuration
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # This file
```

---

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Orion Dashboard                         │
│                    (Next.js Frontend)                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌───────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Map View     │  │  AI Voice    │  │  Incidents   │     │
│  │  (Mapbox)     │  │  (VAPI)      │  │  (Supabase)  │     │
│  └───────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│          │                  │                  │              │
│          └──────────────────┴──────────────────┘              │
│                             │                                 │
└─────────────────────────────┼─────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              │                               │
    ┌─────────▼─────────┐         ┌──────────▼──────────┐
    │   External APIs   │         │   Backend Services   │
    ├───────────────────┤         ├─────────────────────┤
    │ - Open-Meteo      │         │ - Supabase DB       │
    │ - Mapbox API      │         │ - Realtime Subs     │
    │ - Telegram Bot    │         │ - API Routes        │
    │ - Composio        │         │ - Serverless Funcs  │
    └───────────────────┘         └─────────────────────┘
```

### Data Flow

1. **Incident Updates**:

   ```
   Supabase DB → Realtime Subscription → React State → UI Update
   ```

2. **Map Interactions**:

   ```
   User Click → Map Event → Incident Selection → Popup Display
   ```

3. **Weather Updates**:

   ```
   Map Move → Coordinates → API Route → Open-Meteo → Weather Display
   ```

4. **Emergency Alerts**:

   ```
   Button Click → API Route → Composio → Telegram Bot → User Notification
   ```

5. **Voice Commands**:
   ```
   Microphone Input → VAPI → Transcription → Assistant Response → Audio Output
   ```

### Component Hierarchy

```
OrionDashboard (page.tsx)
├── CaliforniaMap
│   ├── Mapbox GL Map
│   ├── Fire Markers
│   ├── Fire Station Markers
│   ├── Fire Spread Polygons
│   ├── Route Visualization
│   └── Popups
├── Left Sidebar
│   └── IncidentsList
│       ├── Incident Cards
│       └── Real-time Updates
└── Right Sidebar
    ├── AI Assistant
    │   ├── Voice Control
    │   ├── Message History
    │   └── Volume Indicator
    ├── Environmental Conditions
    │   ├── Weather Metrics
    │   └── Risk Indicators
    └── Emergency Alert Button
```

### State Management

- **Local State**: React `useState` for component-specific data
- **Real-time State**: Supabase subscriptions for live updates
- **Derived State**: Calculated values from multiple sources
- **Ref State**: Map instances, animation frames, markers

### Real-time Architecture

```typescript
// Supabase Realtime Subscription
const channel = supabase
  .channel("incidents-rt")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "incidents" },
    (payload) => {
      // Handle INSERT, UPDATE, DELETE events
      updateIncidentsState(payload);
    }
  )
  .subscribe();
```

---

## 📡 API Reference

### Weather API

**Endpoint**: `GET /api/weather`

**Parameters**:

- `lat` (required): Latitude coordinate
- `lon` (required): Longitude coordinate

**Response**:

```json
{
  "wind": {
    "speed": 15,
    "deg": 270,
    "direction": "W"
  },
  "temp": 78,
  "humidity": 35,
  "visibility": 10,
  "airQuality": {
    "aqi": 65,
    "pm2_5": 18.5,
    "pm10": 25.3
  },
  "description": "Clear sky",
  "location": "Current Location"
}
```

### Emergency Alert API

**Endpoint**: `POST /api/send-emergency-alert`

**Request Body**:

```json
{
  "incident": {
    "id": "uuid",
    "name": "Pine Ridge Fire",
    "risk": "critical",
    "lat": 37.7749,
    "lon": -122.4194,
    "containment": 25,
    "last_update": "2024-01-15T10:30:00Z",
    "description": "Active wildfire with high winds"
  },
  "customMessage": "Optional custom message"
}
```

**Response**:

```json
{
  "success": true,
  "messageSid": "123456",
  "message": "Emergency alert sent successfully via Telegram"
}
```

---

## 🗄️ Database Schema

### `incidents` Table

| Column      | Type        | Description                     |
| ----------- | ----------- | ------------------------------- |
| id          | UUID        | Primary key                     |
| name        | TEXT        | Fire incident name              |
| status      | TEXT        | active, contained, extinguished |
| risk        | TEXT        | low, medium, high, critical     |
| lat         | NUMERIC     | Latitude coordinate             |
| lon         | NUMERIC     | Longitude coordinate            |
| containment | NUMERIC     | Containment percentage (0-100)  |
| start_time  | TIMESTAMPTZ | When fire started               |
| last_update | TIMESTAMPTZ | Last update timestamp           |
| description | TEXT        | Incident description            |
| created_at  | TIMESTAMPTZ | Record creation time            |

### `firestations` Table

| Column      | Type        | Description          |
| ----------- | ----------- | -------------------- |
| id          | BIGINT      | Primary key          |
| name        | TEXT        | Station name         |
| city        | TEXT        | City location        |
| county      | TEXT        | County location      |
| lat         | NUMERIC     | Latitude coordinate  |
| lon         | NUMERIC     | Longitude coordinate |
| total_teams | INTEGER     | Number of teams (3)  |
| created_at  | TIMESTAMPTZ | Record creation time |

### `responders` Table

| Column         | Type        | Description                                   |
| -------------- | ----------- | --------------------------------------------- |
| id             | UUID        | Primary key                                   |
| firestation_id | BIGINT      | References firestations.id                    |
| incident_id    | UUID        | References incidents.id (null when available) |
| status         | TEXT        | available, dispatched, en_route, on_scene     |
| team_number    | INTEGER     | Team number (1-3 per station)                 |
| current_lat    | NUMERIC     | Current latitude position                     |
| current_lon    | NUMERIC     | Current longitude position                    |
| dispatched_at  | TIMESTAMPTZ | Timestamp when dispatched                     |
| arrived_at     | TIMESTAMPTZ | Timestamp when arrived on scene               |
| created_at     | TIMESTAMPTZ | Record creation time                          |
| updated_at     | TIMESTAMPTZ | Last update time                              |

### `responder_stats` View

Real-time view for quick team statistics:

| Column                 | Type    | Description                  |
| ---------------------- | ------- | ---------------------------- |
| firestation_id         | BIGINT  | Fire station ID              |
| firestation_name       | TEXT    | Fire station name            |
| available_teams        | INTEGER | Count of available teams     |
| dispatched_teams       | INTEGER | Count of en route teams      |
| active_teams           | INTEGER | Count of on-scene teams      |
| total_teams_runtime    | INTEGER | Total teams for this station |
| total_teams_configured | INTEGER | Configured team capacity     |

---

## 🧩 Components

### Core Components

#### `california-map.tsx`

Main map component with Mapbox GL integration, fire markers, fire stations, routes, and fire spread visualization.

**Props**:

- `className?: string` - CSS classes
- `onMapReady?: (navigateToIncident) => void` - Callback when map is ready
- `onMapMove?: (center) => void` - Callback on map movement
- `onIncidentSelect?: (incident) => void` - Callback on incident selection

#### `IncidentsList.tsx`

Real-time list of active fire incidents with Supabase integration.

**Props**:

- `onIncidentClick?: (incident) => void` - Click handler
- `onIncidentCountChange?: (count) => void` - Count change callback
- `onIncidentsUpdate?: (incidents) => void` - Incidents update callback

#### `voice-assistant.tsx`

Voice AI interface with VAPI integration for hands-free operation.

**Features**:

- Voice activation/deactivation
- Real-time transcription
- Volume level visualization
- Message history

### UI Components

Located in `components/ui/`, including:

- `button.tsx` - Button variants
- `badge.tsx` - Status badges
- `card.tsx` - Card containers
- `dialog.tsx` - Modal dialogs
- `toast.tsx` - Notifications
- And 50+ more components from Radix UI

---

## 🔄 Real-Time Features

### Supabase Realtime Subscriptions

The dashboard maintains live connections to the database for instant updates:

```typescript
// Subscribe to incidents changes
const channel = supabase
  .channel("incidents-rt")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "incidents" },
    handleIncidentChange
  )
  .subscribe();
```

### Fire Spread Animation

Realistic fire spread using procedural generation:

```typescript
// Multi-octave noise for organic edges
const multiNoise = (x, y, seed, octaves = 3) => {
  let value = 0;
  let amplitude = 1;
  let frequency = 1;
  // ... combine octaves for natural patterns
};

// Generate irregular polygon coordinates
const generateFirePolygonCoordinates = (center, radius, options) => {
  // ... use noise, growth vectors, and time for dynamic spread
};
```

### Weather Updates

Debounced weather fetching based on map position:

```typescript
useEffect(() => {
  if (lat && lon) {
    const timeoutId = setTimeout(() => {
      fetchWeather(lat, lon);
    }, 1000); // Wait 1 second after map stops moving
    return () => clearTimeout(timeoutId);
  }
}, [lat, lon]);
```

---

## 🎨 Styling & Theming

### Color System

```css
/* Risk Levels */
--critical: #ff6b00; /* Fire orange */
--high: #ff4444; /* Bright red */
--medium: #ffa800; /* Amber */
--low: #00c2ff; /* Cyan */

/* System Colors */
--background: #0a0a0a; /* Near black */
--text: #ffffff; /* White */
--border: rgba(255, 255, 255, 0.1); /* 10% white */
```

### Glass Morphism

```css
.glass-panel {
  background: rgba(10, 10, 10, 0.3);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### Glow Effects

```css
.fire-glow {
  box-shadow: 0 0 20px rgba(255, 107, 0, 0.4);
}

.cyan-glow {
  box-shadow: 0 0 10px rgba(0, 194, 255, 0.6);
}
```

---

## 🧪 Testing

### Local Testing

1. **Test Incident Creation**:

```sql
INSERT INTO incidents (name, status, risk, lat, lon, containment, description)
VALUES ('Test Fire', 'active', 'high', 37.7749, -122.4194, 15, 'Test description');
```

2. **Test Emergency Alerts**:

- Select a fire on the map
- Click the orange alert button
- Check your Telegram for the message

3. **Test Voice Assistant**:

- Click microphone button
- Speak a query: "What fires are active?"
- Verify response appears

### Production Deployment

**Vercel** (Recommended):

```bash
npm run build
vercel --prod
```

**AWS Amplify**:

- Connect GitHub repository
- Use `amplify.yml` for build config
- Deploy automatically on push

---

## 🚀 Performance Optimizations

### Implemented Optimizations

1. **Map Performance**:

   - GeoJSON source for fire polygons
   - Efficient marker clustering
   - Animation frame optimization
   - Cleanup on unmount

2. **Data Fetching**:

   - Debounced weather API calls
   - Cached video mappings
   - Limit database queries to 25 incidents

3. **Real-time Updates**:

   - Single Supabase subscription per component
   - State batching for multiple updates
   - Cleanup on component unmount

4. **Asset Loading**:
   - Video preloading with metadata
   - Lazy loading for large images
   - Progressive enhancement

---

## 🔐 Security Considerations

### Environment Variables

- Never commit `.env.local` to version control
- Use `.gitignore` to exclude sensitive files
- Rotate API keys regularly

### API Key Restrictions

1. **Mapbox**: Restrict to your domain in Mapbox dashboard
2. **Supabase**: Use Row Level Security (RLS) policies
3. **VAPI**: Restrict to specific origins
4. **Telegram**: Keep bot token secret

### Supabase Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE firestations ENABLE ROW LEVEL SECURITY;

-- Read-only access for authenticated users
CREATE POLICY "Allow public read access" ON incidents
  FOR SELECT USING (true);

-- Admin-only write access
CREATE POLICY "Allow admin write access" ON incidents
  FOR INSERT WITH CHECK (auth.role() = 'admin');
```

---

## 📈 Future Enhancements

### Planned Features

- [ ] **Historical Data Analysis**: View past fire incidents and trends
- [ ] **Predictive Fire Risk**: Machine learning for fire risk prediction
- [ ] **Resource Management**: Track firefighting equipment and personnel
- [ ] **Multi-User Collaboration**: Real-time collaboration between teams
- [ ] **Mobile App**: Native iOS/Android applications
- [ ] **Satellite Imagery Integration**: Real-time satellite fire detection
- [ ] **Evacuation Route Planning**: Automated evacuation route generation
- [ ] **Public Alert System**: SMS and email alert distribution
- [ ] **Advanced Analytics Dashboard**: Historical trends and insights
- [ ] **Integration with CAL FIRE**: Direct feed from official sources

### Technical Improvements

- [ ] WebSocket fallback for Realtime
- [ ] Offline mode with service workers
- [ ] Enhanced error boundaries
- [ ] Automated testing suite
- [ ] Performance monitoring (Sentry, DataDog)
- [ ] CDN integration for video delivery
- [ ] GraphQL API layer
- [ ] Multi-region deployment

---

## 🐛 Troubleshooting

### Common Issues

#### Map Not Loading

- **Check Mapbox token**: Ensure `NEXT_PUBLIC_MAPBOX_TOKEN` is set
- **Check browser console**: Look for CORS or token errors
- **Verify domain**: Add your domain to Mapbox allowed URLs

#### Incidents Not Appearing

- **Check Supabase connection**: Verify URL and anon key
- **Check database**: Ensure incidents table has data
- **Check browser console**: Look for subscription errors
- **Verify RLS policies**: Ensure public read access is enabled

#### Voice Assistant Not Working

- **Check VAPI key**: Verify `NEXT_PUBLIC_VAPI_PUBLIC_KEY` is set
- **Check assistant ID**: Update ID in `use-vapi.ts` line 107
- **Check microphone permissions**: Browser must have mic access
- **Check browser compatibility**: Use Chrome or Edge for best results

#### Emergency Alerts Failing

- **Check Telegram credentials**: Verify bot token and chat ID
- **Check bot permissions**: Ensure bot can send messages
- **Check Composio API**: Verify Composio key is valid
- **Test bot manually**: Send a test message via Telegram API

#### Weather Data Not Loading

- **Check coordinates**: Ensure lat/lon are valid
- **Check API availability**: Open-Meteo may have rate limits
- **Check network**: Ensure external API calls are allowed
- **Check browser console**: Look for CORS errors

### Debug Mode

Enable debug logging:

```typescript
// In components/california-map.tsx
console.log("Map loaded:", mapRef.current);
console.log("Incidents:", incidents);

// In hooks/use-vapi.ts
console.log("VAPI message:", message);
console.log("Session active:", isSessionActive);
```

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Style

- Use TypeScript for type safety
- Follow ESLint rules
- Use Prettier for formatting
- Write descriptive commit messages
- Add comments for complex logic

### Areas for Contribution

- 🐛 Bug fixes
- ✨ New features
- 📝 Documentation improvements
- 🎨 UI/UX enhancements
- ⚡ Performance optimizations
- 🧪 Test coverage
- 🌐 Internationalization

---

## 📄 License

This project is proprietary software developed for wildfire operations management. All rights reserved.

For licensing inquiries, please contact the development team.

---

## 👥 Team

**Orion Dashboard** was built during CalHacks by a team of passionate developers committed to improving emergency response technology.

### Contact

- **GitHub**: [github.com/your-org/orion](https://github.com/your-org/orion)
- **Email**: orion-team@example.com
- **Website**: [orion-dashboard.com](https://orion-dashboard.com)

---

## 🙏 Acknowledgments

- **CalHacks** for hosting the hackathon
- **Mapbox** for providing powerful mapping tools
- **Supabase** for real-time database infrastructure
- **VAPI** for voice AI technology
- **Open-Meteo** for free weather data
- **Vercel** for hosting platform
- **Radix UI** for accessible components
- **Tailwind CSS** for styling framework

---

## 📚 Resources

### Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Mapbox GL JS Documentation](https://docs.mapbox.com/mapbox-gl-js/)
- [Supabase Documentation](https://supabase.com/docs)
- [VAPI Documentation](https://docs.vapi.ai/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### APIs

- [Open-Meteo API](https://open-meteo.com/en/docs)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Mapbox Directions API](https://docs.mapbox.com/api/navigation/directions/)

### Related Projects

- [CAL FIRE](https://www.fire.ca.gov/) - Official California fire authority
- [InciWeb](https://inciweb.nwcg.gov/) - Incident information system
- [NASA FIRMS](https://firms.modaps.eosdis.nasa.gov/) - Active fire data

---

<div align="center">

**Built with ❤️ for emergency responders and communities affected by wildfires**

[⬆ Back to Top](#-orion---wildfire-operations-dashboard)

</div>
