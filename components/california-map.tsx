'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import type { Feature, FeatureCollection } from 'geojson';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/lib/supabase-client';
import VideoPreview from './VideoPreview';
import { getFireVideo } from '@/lib/video-mapping';

// Incident type for navigation callback
type Incident = {
  id: string | number;
  name: string | null;
  risk?: 'low' | 'medium' | 'high' | 'critical' | null;
  lat: number | null;
  lon: number | null;
  containment?: number | null;
  description?: string | null;
  last_update?: string;
};

// California coordinates and bounds
const CALIFORNIA_BOUNDS = {
  north: 42.0,
  south: 32.5,
  east: -114.0,
  west: -124.5
};

const getMarkerColor = (intensity: string) => {
  switch (intensity) {
    case 'critical': return '#FF6B00'; // Fire orange
    case 'high': return '#FF4444'; // Bright red
    case 'medium': return '#FF8C00'; // Dark orange
    case 'low': return '#00C2FF'; // Cyan
    default: return '#6b7280'; // gray
  }
};

const getMarkerSize = (intensity: string) => {
  switch (intensity) {
    case 'critical': return 24;
    case 'high': return 20;
    case 'medium': return 16;
    case 'low': return 12;
    default: return 14;
  }
};

const getPulseSize = (intensity: string) => {
  switch (intensity) {
    case 'critical': return 60;
    case 'high': return 50;
    case 'medium': return 40;
    case 'low': return 30;
    default: return 35;
  }
};

const METERS_PER_DEGREE_LAT = 111320;

// Supabase incident type
type SupabaseIncident = {
  id: string;
  name: string | null;
  status: 'active' | 'contained' | 'extinguished' | null;
  risk: 'low' | 'medium' | 'high' | 'critical' | null;
  lat: number | null;
  lon: number | null;
  containment: number | null;
  start_time: string;
  last_update: string;
  description: string | null;
};

// Supabase police station type
type SupabasePoliceStation = {
  id: number;
  name: string;
  city: string | null;
  county: string | null;
  lat: number;
  lon: number;
  created_at: string;
};

// Keep old name for backward compatibility
type SupabaseFirestation = SupabasePoliceStation;

// Convert Supabase incident to map incident format
type WildfireIncident = {
  id: number | string; // Support both number and UUID string
  name: string;
  status: string;
  intensity: string;
  coordinates: [number, number];
  acres?: number;
  description?: string;
  containment?: number;
  last_update?: string;
};

type FireFeatureProperties = {
  id: number;
  intensity: number;
  name: string;
};

interface FireState {
  baseRadius: number; // meters
  roughness: number;
  waveSpeed: number;
  amplitude: number;
  expansionRate: number;
  seed: number;
  growthVectors: number[]; // Random growth direction for each angle
  startTime: number; // When this fire started
  initialWindSpeed: number; // Wind speed when fire was created (locked)
  initialWindDirection: number; // Wind direction when fire was created (locked)
  containmentStartTime?: number; // When containment started
  containmentRate?: number; // How fast fire shrinks (0-1 scale)
  respondersOnScene?: number; // Number of responders actively containing fire
  maxRadiusBeforeContainment?: number; // Lock fire size when containment starts
}

// Unit type (police unit/patrol car)
type Unit = {
  id: string;
  station_id: number;
  firestation_id?: number; // Backward compatibility
  incident_id: string;
  unit_number?: string;
  team_number?: number; // Backward compatibility
  status: 'available' | 'dispatched' | 'en_route' | 'on_scene' | 'returning';
  current_lat: number;
  current_lon: number;
  dispatched_at: string;
  route?: any; // GeoJSON route
  progress?: number; // 0-1, position along route
  marker?: mapboxgl.Marker;
}

// Keep old name for backward compatibility
type Responder = Unit;

// Convert Supabase incident to WildfireIncident format
const convertSupabaseIncident = (incident: SupabaseIncident): WildfireIncident => {
  return {
    id: incident.id as any, // Keep UUID as string, cast to number type for compatibility
    name: incident.name || 'Unnamed Fire',
    status: incident.status || 'active',
    intensity: incident.risk || 'low',
    coordinates: [incident.lon || 0, incident.lat || 0],
    containment: incident.containment || 0,
    description: incident.description || undefined,
    last_update: incident.last_update
  };
};

// Create popup content HTML
const createPopupContent = (incident: WildfireIncident): string => {
  const videoInfo = getFireVideo(incident.name);
  const hasVideo = Boolean(videoInfo?.videoUrl);
  const intensityColor = getMarkerColor(incident.intensity);
  
  return `
    <div class="rounded-lg overflow-hidden" style="min-width: 320px;">
      <div class="px-4 pt-3 pb-2 bg-black/50 border-b border-white/10">
        <h3 class="text-base font-semibold text-white">${incident.name}</h3>
        ${incident.description ? `<p class="mt-1" style="font-size: 14px; color: ${intensityColor}; line-height: 1.4; font-weight: 600;">${incident.description}</p>` : ''}
      </div>
      ${hasVideo ? `
        <div data-video-wrapper="true" class="relative" style="width: 100%; height: 140px; background: #000;">
          <video 
            data-video-element="true"
            style="width: 100%; height: 100%; object-fit: cover; cursor: pointer;" 
            poster="${videoInfo?.thumbnailUrl || ''}"
            preload="metadata" autoplay muted playsinline loop
            onclick="this.paused ? this.play() : this.pause()"
          >
            <source src="${videoInfo?.videoUrl}" type="video/mp4">
            Your browser does not support the video tag.
          </video>
          <!-- Fullscreen removed per request -->
        </div>
      ` : `
        <div class="px-4 py-3 bg-black/40 border-b border-white/10">
          <p class="text-sm font-semibold" style="color: ${intensityColor}">Livestream Unavailable</p>
        </div>
      `}
      <div class="p-4 bg-black/40">
        <div class="space-y-1 text-sm">
          <div class="flex justify-between">
            <span class="text-white/70">Status:</span>
            <span class="font-semibold text-white">${incident.status}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-white/70">Intensity:</span>
            <span class="font-semibold" style="color: ${intensityColor}">${incident.intensity}</span>
          </div>
          ${incident.containment !== undefined ? `
            <div class="flex justify-between">
              <span class="text-white/70">Containment:</span>
              <span class="font-semibold text-[#00C2FF]">${incident.containment}%</span>
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;
};

// Create popup content for police station
const createPoliceStationPopupContent = (station: SupabasePoliceStation): string => {
  return createFirestationPopupContent(station);
}

// Keep old function for backward compatibility
const createFirestationPopupContent = (firestation: SupabaseFirestation | SupabasePoliceStation): string => {
  return `
    <div class="rounded-lg overflow-hidden bg-black/40 p-4" style="min-width: 250px;">
      <h3 class="text-lg font-bold text-white mb-2">${firestation.name}</h3>
      <div class="space-y-1 text-sm">
        ${firestation.city ? `
          <div class="flex justify-between">
            <span class="text-white/70">City:</span>
            <span class="font-semibold text-white">${firestation.city}</span>
          </div>
        ` : ''}
        ${firestation.county ? `
          <div class="flex justify-between">
            <span class="text-white/70">County:</span>
            <span class="font-semibold text-white">${firestation.county}</span>
          </div>
        ` : ''}
        <div class="flex justify-between">
          <span class="text-white/70">Type:</span>
          <span class="font-semibold text-[#00C2FF]">Fire Station</span>
        </div>
      </div>
    </div>
  `;
};

// Create firestation marker element with custom SVG icon
const createFirestationMarker = () => {
  const markerEl = document.createElement('div');
  markerEl.className = 'relative';
  markerEl.style.cursor = 'pointer';
  markerEl.style.width = '24px';
  markerEl.style.height = '24px';
  markerEl.style.zIndex = '50'; // Lower z-index so fires appear on top
  
  // Create a smaller, more subtle firestation icon
  markerEl.innerHTML = `
    <div style="
      width: 24px;
      height: 24px;
      background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
      border: 2px solid #60a5fa;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 10px rgba(96, 165, 250, 0.6), 0 2px 4px rgba(0, 0, 0, 0.3);
      transition: transform 0.2s;
    " 
    onmouseover="this.style.transform='scale(1.3)'"
    onmouseout="this.style.transform='scale(1)'">
      <span style="font-size: 14px; line-height: 1;">🚒</span>
    </div>
  `;
  
  return markerEl;
};

// Create animated firetruck marker
const createFiretruckMarker = (teamNumber: number) => {
  const markerEl = document.createElement('div');
  markerEl.className = 'relative';
  markerEl.style.width = '32px';
  markerEl.style.height = '32px';
  markerEl.style.zIndex = '200'; // Very high z-index so trucks appear on top
  
  markerEl.innerHTML = `
    <div style="
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #FF6B00 0%, #FF4444 100%);
      border: 3px solid white;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 20px rgba(255, 107, 0, 0.8), 0 4px 8px rgba(0, 0, 0, 0.4);
      animation: pulse-truck 1.5s ease-in-out infinite;
      position: relative;
    ">
      <span style="font-size: 18px; line-height: 1; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.5));">🚒</span>
    </div>
    <style>
      @keyframes pulse-truck {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
      }
    </style>
  `;
  
  return markerEl;
};

// Calculate a point along a line at a given progress (0-1)
const getPointAlongLine = (coordinates: [number, number][], progress: number): [number, number] => {
  // Validate input
  if (!coordinates || coordinates.length === 0) {
    console.error('[getPointAlongLine] Empty coordinates array');
    return [0, 0];
  }
  
  if (coordinates.length === 1) {
    return coordinates[0];
  }
  
  if (progress <= 0) return coordinates[0];
  if (progress >= 1) return coordinates[coordinates.length - 1];
  
  // Calculate total line length
  let totalLength = 0;
  const segmentLengths: number[] = [];
  
  for (let i = 0; i < coordinates.length - 1; i++) {
    const coord1 = coordinates[i];
    const coord2 = coordinates[i + 1];
    
    // Validate coordinate pairs
    if (!coord1 || !coord2 || coord1.length < 2 || coord2.length < 2) {
      console.error(`[getPointAlongLine] Invalid coordinate pair at index ${i}:`, coord1, coord2);
      return coordinates[0];
    }
    
    const [lon1, lat1] = coord1;
    const [lon2, lat2] = coord2;
    
    // Validate numeric values
    if (isNaN(lon1) || isNaN(lat1) || isNaN(lon2) || isNaN(lat2)) {
      console.error(`[getPointAlongLine] NaN in coordinates at index ${i}:`, [lon1, lat1], [lon2, lat2]);
      return coordinates[0];
    }
    
    const segmentLength = Math.sqrt(
      Math.pow(lon2 - lon1, 2) + Math.pow(lat2 - lat1, 2)
    );
    
    if (isNaN(segmentLength) || segmentLength < 0) {
      console.error(`[getPointAlongLine] Invalid segment length at index ${i}:`, segmentLength);
      return coordinates[0];
    }
    
    segmentLengths.push(segmentLength);
    totalLength += segmentLength;
  }
  
  // Handle edge case where all segments are zero length
  if (totalLength === 0) {
    return coordinates[0];
  }
  
  // Find target position along line
  const targetLength = totalLength * progress;
  let currentLength = 0;
  
  for (let i = 0; i < segmentLengths.length; i++) {
    if (currentLength + segmentLengths[i] >= targetLength) {
      // Interpolate within this segment
      const segmentLength = segmentLengths[i];
      
      // Avoid division by zero
      if (segmentLength === 0) {
        return coordinates[i];
      }
      
      const segmentProgress = (targetLength - currentLength) / segmentLength;
      const [lon1, lat1] = coordinates[i];
      const [lon2, lat2] = coordinates[i + 1];
      
      const resultLon = lon1 + (lon2 - lon1) * segmentProgress;
      const resultLat = lat1 + (lat2 - lat1) * segmentProgress;
      
      // Final validation
      if (isNaN(resultLon) || isNaN(resultLat)) {
        console.error('[getPointAlongLine] Calculated NaN position:', {
          lon1, lat1, lon2, lat2, segmentProgress
        });
        return coordinates[i];
      }
      
      return [resultLon, resultLat];
    }
    currentLength += segmentLengths[i];
  }
  
  return coordinates[coordinates.length - 1];
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

// Calculate distance between two points using Haversine formula (in kilometers)
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Find nearest fire station to a given location
const findNearestFirestation = (
  lat: number, 
  lon: number, 
  firestations: SupabaseFirestation[]
): SupabaseFirestation | null => {
  if (firestations.length === 0) return null;
  
  let nearest = firestations[0];
  let minDistance = calculateDistance(lat, lon, nearest.lat, nearest.lon);
  
  for (let i = 1; i < firestations.length; i++) {
    const distance = calculateDistance(lat, lon, firestations[i].lat, firestations[i].lon);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = firestations[i];
    }
  }
  
  return nearest;
};

const getIntensityMultiplier = (intensity: string) => {
  switch (intensity) {
    case 'critical': return 1.25;
    case 'high': return 1.1;
    case 'medium': return 0.9;
    case 'low':
    default:
      return 0.75;
  }
};

const getBaseRadiusMeters = (incident: WildfireIncident) => {
  const acres = incident.acres ?? 500;
  const intensityMultiplier = getIntensityMultiplier(incident.intensity);
  const base = 150 + Math.sqrt(acres) * 2.5;
  return base * intensityMultiplier;
};

const getExpansionRate = (incident: WildfireIncident) => {
  const intensityMultiplier = getIntensityMultiplier(incident.intensity);
  return 18 * intensityMultiplier;
};

/**
 * Generate wind-influenced growth vectors
 * Wind direction is where wind comes FROM (meteorological convention)
 * Fire spreads in the OPPOSITE direction (downwind)
 * 
 * @param numVectors - Number of directional segments
 * @param windSpeed - Wind speed in mph (higher = more directional bias)
 * @param windDirection - Wind direction in degrees (0=N, 90=E, 180=S, 270=W)
 * @returns Array of growth multipliers for each direction
 */
const generateWindInfluencedGrowthVectors = (
  numVectors: number,
  windSpeed: number,
  windDirection: number
): number[] => {
  const growthVectors: number[] = [];
  
  // Convert wind direction to radians
  // Fire spreads OPPOSITE to wind direction (add 180°)
  const fireSpreadDirection = ((windDirection + 180) % 360) * (Math.PI / 180);
  
  // Wind influence factor (0-1): stronger winds = more directional spread
  // 0 mph = no influence, 20+ mph = maximum influence
  const windInfluence = Math.min(windSpeed / 20, 1);
  
  for (let i = 0; i < numVectors; i++) {
    const angle = (i / numVectors) * Math.PI * 2;
    
    // Calculate how aligned this angle is with fire spread direction
    // cos gives 1 when aligned, -1 when opposite
    const alignment = Math.cos(angle - fireSpreadDirection);
    
    // Convert alignment to growth multiplier
    // Downwind direction (aligned): higher growth
    // Upwind direction (opposite): lower growth
    // Perpendicular: neutral growth
    const windEffect = 0.5 + (alignment * windInfluence * 0.7);
    
    // Add some random variation for organic spread
    const randomVariation = 0.85 + Math.random() * 0.3;
    
    // Combine wind effect with random variation
    const growthMultiplier = windEffect * randomVariation;
    
    growthVectors.push(growthMultiplier);
  }
  
  return growthVectors;
};

/**
 * REALISTIC WIND-DRIVEN FIRE SPREAD SIMULATION
 * 
 * This system creates organic, realistic fire spread patterns using:
 * 1. Real-time wind data (speed & direction from weather API)
 * 2. Wind-influenced directional growth (fires spread downwind)
 * 3. Multi-octave noise for irregular, natural edges
 * 4. Emergence from center (starts small, grows outward)
 * 5. Subtle edge movement for dynamic appearance
 * 6. Non-uniform expansion based on wind conditions
 * 
 * Wind behavior:
 * - Stronger winds (>15 mph) create more directional spread
 * - Fire spreads opposite to wind direction (downwind)
 * - Perpendicular directions have neutral growth
 * - Upwind direction has reduced spread
 */

// Simple noise function for organic fire spread
const noise = (x: number, y: number, seed: number): number => {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453;
  return n - Math.floor(n);
};

// Multi-octave noise for more organic patterns
const multiNoise = (x: number, y: number, seed: number, octaves: number = 3): number => {
  let value = 0;
  let amplitude = 1;
  let frequency = 1;
  let maxValue = 0;

  for (let i = 0; i < octaves; i++) {
    value += noise(x * frequency, y * frequency, seed + i) * amplitude;
    maxValue += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }

  return value / maxValue;
};

const generateFirePolygonCoordinates = (
  center: [number, number],
  radiusMeters: number,
  options: { 
    roughness?: number; 
    points?: number; 
    time?: number; 
    seed?: number;
    growthVectors?: number[];
    elapsedTime?: number;
  } = {}
) => {
  const { 
    roughness = 0.4, 
    points = 64, 
    time = 0, 
    seed = 0,
    growthVectors = [],
    elapsedTime = 0
  } = options;
  
  const coords: [number, number][] = [];
  const latRadians = (center[1] * Math.PI) / 180;
  const cosLat = Math.cos(latRadians);

  // Calculate emergence factor (fire starts small and grows)
  // Goes from 0 to 1 over first 8 seconds for slow visible emergence, then stays at 1
  const emergenceFactor = Math.min(elapsedTime / 8, 1);
  
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * Math.PI * 2;
    
    // Get growth vector for this angle (or generate a random one)
    const vectorIndex = Math.floor((i / points) * growthVectors.length);
    const growthVector = growthVectors[vectorIndex] || 1.0;
    
    // Use static noise (not time-dependent) for stable organic edges
    // Only use angle for variation, not time
    const noiseValue = multiNoise(
      Math.cos(angle) * 2,
      Math.sin(angle) * 2,
      seed,
      3 // 3 octaves for smoother shapes
    );
    
    // Very subtle, slow edge movement (not flicker)
    const subtleMovement = 1 + Math.sin(angle * 5 + time * 0.5 + seed) * 0.02;
    
    // Combine all factors for realistic but stable fire spread
    // - Base radius grows with time
    // - Growth vectors create asymmetric spread (wind, terrain)
    // - Noise creates organic, irregular edges (STABLE)
    // - Subtle movement adds very slow dynamic changes
    // - Emergence factor makes it start from center
    const irregularity = 0.8 + (noiseValue * roughness * 0.8);
    const effectiveRadius = radiusMeters * 
      emergenceFactor *    // Emerge from center
      growthVector *       // Directional growth
      irregularity *       // Organic variation (stable)
      subtleMovement;      // Very subtle slow movement

    const dx = Math.cos(angle) * effectiveRadius;
    const dy = Math.sin(angle) * effectiveRadius;

    const lngOffset = dx / (METERS_PER_DEGREE_LAT * cosLat);
    const latOffset = dy / METERS_PER_DEGREE_LAT;

    coords.push([center[0] + lngOffset, center[1] + latOffset]);
  }

  if (coords.length) {
    coords.push(coords[0]);
  }

  return coords;
};

const createFireFeature = (
  incident: WildfireIncident,
  radiusMeters: number,
  options: { 
    time?: number; 
    roughness?: number; 
    seed?: number; 
    intensity?: number; 
    points?: number;
    growthVectors?: number[];
    elapsedTime?: number;
  } = {}
): Feature<GeoJSON.Polygon, FireFeatureProperties> => {
  const { 
    time = 0, 
    roughness = 0.4, 
    seed = 0, 
    intensity = 0.6, 
    points = 64,
    growthVectors = [],
    elapsedTime = 0
  } = options;

  return {
    type: 'Feature',
    properties: {
      id: typeof incident.id === 'number' ? incident.id : parseInt(String(incident.id), 10),
      intensity,
      name: incident.name
    },
    geometry: {
      type: 'Polygon',
      coordinates: [generateFirePolygonCoordinates(
        incident.coordinates as [number, number], 
        radiusMeters, 
        { roughness, time, seed, points, growthVectors, elapsedTime }
      )]
    }
  };
};

interface CaliforniaMapProps {
  className?: string;
  onMapReady?: (navigateToIncident: (incident: Incident) => void) => void;
  onMapMove?: (center: { lat: number; lon: number }) => void;
  windSpeed?: number;      // Wind speed in mph
  windDirection?: number;  // Wind direction in degrees (meteorological: where wind comes FROM)
  onIncidentSelect?: (incident: Incident) => void;
  onUnitUpdate?: (units: { available: number; dispatched: number; active: number }, activeUnits?: any[]) => void;
  refreshUnitTrigger?: number; // Trigger to refresh unit data
  selectedIncidentId?: string | null; // Currently selected incident ID
  // Backward compatibility
  onResponderUpdate?: (responders: { available: number; dispatched: number; active: number }, activeResponders?: any[]) => void;
  refreshResponderTrigger?: number;
}

export default function CaliforniaMap({ className = '', onMapReady, onMapMove, windSpeed = 10, windDirection = 270, onIncidentSelect, onUnitUpdate, refreshUnitTrigger, selectedIncidentId, onResponderUpdate, refreshResponderTrigger }: CaliforniaMapProps) {
  // Support both new and old prop names
  const unitUpdateCallback = onUnitUpdate || onResponderUpdate;
  const refreshTrigger = refreshUnitTrigger || refreshResponderTrigger;
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const fireStateRef = useRef<Record<number, FireState>>({});
  const fireAnimationRef = useRef<number | null>(null);
  const fireStartTimeRef = useRef<number | null>(null);
  
  // State for Supabase incidents
  const [incidents, setIncidents] = useState<WildfireIncident[]>([]);
  const [firestations, setFirestations] = useState<SupabaseFirestation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiRecommendedRoutes, setAiRecommendedRoutes] = useState<any[]>([]);
  const [evacuationZones, setEvacuationZones] = useState<any[]>([]);
  const [selectedFireId, setSelectedFireId] = useState<number | null>(null);
  const [responders, setResponders] = useState<Responder[]>([]);
  const latestRespondersRef = useRef<Responder[]>([]); // Tracks latest responders state for fire animation
  const responderAnimationRef = useRef<number | null>(null);
  
  const activeIncidents = incidents.filter((incident) => incident.status === 'active');
  const fireSourceId = 'fire-zones';
  const fireLayerId = 'fire-heat';
  const routeSourceId = 'route-source';
  const routeLayerId = 'route-layer';
  const routeArrowLayerId = 'route-arrows';
  const aiRouteSourceId = 'ai-route-source';
  const aiRouteLayerId = 'ai-route-layer';
  const evacuationSourceId = 'evacuation-source';
  const evacuationLayerId = 'evacuation-layer';

  // Function to fetch and display route from fire station to fire
  const displayRouteToFire = useCallback(async (
    fireLat: number,
    fireLon: number,
    stationLat: number,
    stationLon: number
  ) => {
    if (!mapRef.current) return;

    try {
      // Fetch route from Mapbox Directions API
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${stationLon},${stationLat};${fireLon},${fireLat}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0].geometry;

        // Remove existing route if any
        const map = mapRef.current;
        if (map.getLayer(routeArrowLayerId)) {
          map.removeLayer(routeArrowLayerId);
        }
        if (map.getLayer(routeLayerId)) {
          map.removeLayer(routeLayerId);
        }
        if (map.getSource(routeSourceId)) {
          map.removeSource(routeSourceId);
        }

        // Add the route as a source
        map.addSource(routeSourceId, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: route
          }
        });

        // Add the route layer
        map.addLayer({
          id: routeLayerId,
          type: 'line',
          source: routeSourceId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3b82f6', // Blue color for route
            'line-width': 6,
            'line-opacity': 0.8
          }
        });

        // Add animated arrow layer to show direction
        map.addLayer({
          id: routeArrowLayerId,
          type: 'line',
          source: routeSourceId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#60a5fa', // Lighter blue for arrows
            'line-width': 3,
            'line-opacity': 0.6,
            'line-dasharray': [0, 2, 2]
          }
        });
      }
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  }, []);

  // Define navigation function for incident selection
  const navigateToIncident = useCallback((incident: Incident) => {
    if (!mapRef.current) return;
    
    const lat = incident.lat;
    const lon = incident.lon;
    
    if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
      console.warn('Invalid incident coordinates:', { lat, lon, incident });
      return;
    }

    // Set selected fire ID
    const fireId = typeof incident.id === 'string' ? parseInt(incident.id) : incident.id;
    setSelectedFireId(fireId);

    // Notify parent component that this incident was selected
    if (onIncidentSelect) {
      onIncidentSelect(incident);
    }
    
    // Find nearest fire station and display route (for active incidents)
    const nearestStation = findNearestFirestation(lat, lon, firestations);
    if (nearestStation) {
      displayRouteToFire(lat, lon, nearestStation.lat, nearestStation.lon);
    }

    // First, remove any existing popup
    if (popupRef.current) {
      popupRef.current.remove();
      popupRef.current = null;
    }

    // Convert Incident to WildfireIncident for popup content
    const wildfireIncident: WildfireIncident = {
      id: typeof incident.id === 'string' ? parseInt(incident.id) : incident.id,
      name: incident.name || 'Unnamed Fire',
      status: 'active',
      intensity: incident.risk || 'low',
      coordinates: [lon, lat],
      containment: incident.containment || undefined,
      description: incident.description || undefined
    };

    // Create the popup immediately so sidebar clicks show content without delay
    try {
      const popupContent = createPopupContent(wildfireIncident);

      const isPalace = (wildfireIncident.name || '').toLowerCase().includes('palace of fine arts');
      const sidebarOffset = isPalace ? 56 : 28; // push lower to avoid header overlap for Palace

      popupRef.current = new mapboxgl.Popup({ 
        closeButton: true, 
        closeOnClick: true,
        maxWidth: '380px',
        offset: sidebarOffset,
        anchor: 'bottom'
      })
        .setLngLat([lon, lat])
        .setHTML(popupContent)
        .addTo(mapRef.current);

      // Wire up fullscreen behavior
      try {
        const popupNode = popupRef.current?.getElement();
        if (popupNode) {
          const content = popupNode.querySelector('.mapboxgl-popup-content') as HTMLElement | null;
          const videoEl = content?.querySelector('video[data-video-element="true"]') as HTMLVideoElement | null;
          // Toggle play/pause when clicking anywhere inside popup when video exists
          if (videoEl && content) {
            content.onclick = (e: MouseEvent) => {
              const target = e.target as HTMLElement;
              // Ignore clicks on the fullscreen button itself
              if (target.closest('button[data-fullscreen-toggle="true"]')) return;
              if (videoEl.paused) videoEl.play(); else videoEl.pause();
            };
          }
          // Remove fullscreen behavior entirely
        }
      } catch {}
    } catch (error) {
      console.error('Error creating popup:', error);
    }

    // Then fly to the incident location (popup will reposition automatically)
    mapRef.current.flyTo({
      center: [lon, lat],
      zoom: 17,
      pitch: 60,
      bearing: mapRef.current.getBearing(),
      duration: 3500,
      padding: { top: 260, bottom: 40, left: 40, right: 40 },
      essential: true
    });
  }, [onIncidentSelect, firestations, displayRouteToFire]);

  // Fetch incidents and firestations from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch incidents
        const { data: incidentsData, error: incidentsError } = await supabase
          .from('incidents')
          .select('*')
          .order('last_update', { ascending: false });

        if (incidentsError) {
          setError(incidentsError.message);
          return;
        }

        // Fetch police stations (try police_stations first, fallback to firestations for backward compatibility)
        const { data: policeStationsData, error: policeStationsError } = await supabase
          .from('police_stations')
          .select('*')
          .order('id');
        
        // Fallback to firestations if police_stations doesn't exist
        let firestationsData = policeStationsData;
        let firestationsError = policeStationsError;
        if (policeStationsError && policeStationsError.code === 'PGRST116') {
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('firestations')
            .select('*')
            .order('id');
          firestationsData = fallbackData;
          firestationsError = fallbackError;
        }

        if (firestationsError) {
          console.error('Error fetching police stations:', firestationsError);
        }

        const convertedIncidents = (incidentsData || []).map(convertSupabaseIncident);
        setIncidents(convertedIncidents);
        setFirestations(firestationsData || []);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();

    // Set up real-time updates
    const channel = supabase
      .channel('incidents-rt')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'incidents' },
        (payload) => {
          const newIncident = payload.new as SupabaseIncident;
          const convertedIncident = convertSupabaseIncident(newIncident);
          
          setIncidents(prev => {
            const without = prev.filter(i => i.id !== convertedIncident.id);
            return [convertedIncident, ...without];
          });
        })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Poll for AI-recommended routes and evacuations
  useEffect(() => {
    const pollRoutes = async () => {
      try {
        const response = await fetch('/api/update-routes');
        if (!response.ok) {
          console.warn('Failed to fetch AI routes:', response.statusText);
          return;
        }
        
        const data = await response.json();
        setAiRecommendedRoutes(data.routes || []);
        setEvacuationZones(data.evacuations || []);
        
        if (data.routes && data.routes.length > 0) {
          console.log(`[AI Agent] Received ${data.routes.length} route updates`);
        }
      } catch (error) {
        console.error('Error polling AI routes:', error);
      }
    };
    
    // Initial poll
    pollRoutes();
    
    // Poll every 30 seconds
    const interval = setInterval(pollRoutes, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Poll for active units and update their positions
  useEffect(() => {
    const pollUnits = async () => {
      try {
        const response = await fetch('/api/dispatch-unit');
        if (!response.ok) return;
        
        const data = await response.json();
        
        // Update unit stats - pass active units so parent can filter by incident
        if (unitUpdateCallback && data.totals) {
          unitUpdateCallback(
            {
              available: data.totals.available || 0,
              dispatched: data.totals.dispatched || 0,
              active: data.totals.on_scene || data.totals.active || 0
            },
            data.activeUnits || data.activeResponders || []
          );
        }
        
        // Update active units state (support both activeUnits and activeResponders for backward compatibility)
        const activeUnitsData = data.activeUnits || data.activeResponders || [];
        if (activeUnitsData.length > 0) {
          const newUnits = activeUnitsData.map((dbUnit: any) => ({
            id: dbUnit.id,
            station_id: dbUnit.station_id || dbUnit.firestation_id,
            firestation_id: dbUnit.firestation_id || dbUnit.station_id, // Backward compatibility
            incident_id: dbUnit.incident_id,
            unit_number: dbUnit.unit_number,
            team_number: dbUnit.team_number || parseInt(dbUnit.unit_number?.match(/\d+/)?.[0] || '1'), // Extract number from unit_number
            status: dbUnit.status,
            current_lat: dbUnit.current_lat,
            current_lon: dbUnit.current_lon,
            dispatched_at: dbUnit.dispatched_at,
            progress: 0
          }));
          setResponders(newUnits as Responder[]);
          latestRespondersRef.current = newUnits as Responder[];
        } else {
          setResponders([]);
          latestRespondersRef.current = [];
        }
      } catch (error) {
        console.error('Error polling units:', error);
      }
    };
    
    // Initial poll
    pollUnits();
    
    // Poll every 5 seconds for active units
    const interval = setInterval(pollUnits, 5000);
    
    return () => clearInterval(interval);
  }, [refreshTrigger, unitUpdateCallback]);

  // Animate responders moving along routes
  useEffect(() => {
    if (!mapRef.current) return;
    
    const map = mapRef.current;
    
    if (responders.length === 0) {
      console.log('[Responder Animation] No responders to animate');
      return;
    }
    
    console.log('[Responder Animation] Starting animation for', responders.length, 'responders');

    let animationFrameId: number;
    const respondersRef: Responder[] = responders.map(r => ({...r})); // Copy to avoid state mutation

    const animateResponders = async () => {
      for (const responder of respondersRef) {
        // Check if this responder's incident is selected
        const isIncidentSelected = selectedIncidentId && String(responder.incident_id) === String(selectedIncidentId);
        
        // If responder doesn't have a marker yet, create one
        if (!responder.marker) {
          console.log(`[Marker] Creating marker for Team ${responder.team_number} at [${responder.current_lon}, ${responder.current_lat}]`);
          const markerEl = createFiretruckMarker(responder.team_number);
          const marker = new mapboxgl.Marker({ element: markerEl, anchor: 'center' })
            .setLngLat([responder.current_lon, responder.current_lat])
            .addTo(map);
          
          // Hide by default (only show when incident is selected)
          markerEl.style.display = isIncidentSelected ? 'block' : 'none';
          
          responder.marker = marker;
        } else {
          // Update visibility based on selection
          const markerEl = responder.marker.getElement();
          if (markerEl) {
            markerEl.style.display = isIncidentSelected ? 'block' : 'none';
          }
        }

        // If responder doesn't have a route yet and is dispatched, fetch it
        if (!responder.route && (responder.status === 'dispatched' || responder.status === 'en_route')) {
          const incident = incidents.find(i => String(i.id) === String(responder.incident_id));
          console.log(`[Route] Team ${responder.team_number} - Looking for incident ${responder.incident_id}, found:`, !!incident);
          
          if (incident) {
            try {
              const mapboxToken = 'pk.eyJ1Ijoic3BhbnVnYW50aTMxIiwiYSI6ImNtaDVwbzBlYzA1bTkybnB6azQxZnEwOGEifQ.eCNufvFartJqVo8Nwkwkeg';
              const [fireLon, fireLat] = incident.coordinates;
              // Validate responder position
              if (isNaN(responder.current_lon) || isNaN(responder.current_lat)) {
                console.error(`[Route] ❌ Invalid responder position for Team ${responder.team_number}:`, {
                  lat: responder.current_lat,
                  lon: responder.current_lon
                });
                continue;
              }
              
              // Validate fire position
              if (isNaN(fireLon) || isNaN(fireLat)) {
                console.error(`[Route] ❌ Invalid fire position for incident ${responder.incident_id}:`, {
                  lat: fireLat,
                  lon: fireLon
                });
                continue;
              }
              
              const routeUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${responder.current_lon},${responder.current_lat};${fireLon},${fireLat}?geometries=geojson&access_token=${mapboxToken}`;
              
              console.log(`[Route] Fetching route for Team ${responder.team_number} from [${responder.current_lon}, ${responder.current_lat}] to [${fireLon}, ${fireLat}]`);
              const response = await fetch(routeUrl);
              const data = await response.json();
              
              // Check for Mapbox API errors
              if (data.code && data.code !== 'Ok') {
                console.error(`[Route] ❌ Mapbox API error for Team ${responder.team_number}:`, data);
                continue;
              }
              
              if (data.routes && data.routes.length > 0) {
                const geometry = data.routes[0].geometry;
                
                // Validate geometry structure
                if (!geometry || !geometry.coordinates || !Array.isArray(geometry.coordinates) || geometry.coordinates.length === 0) {
                  console.error(`[Route] ❌ Invalid route geometry for Team ${responder.team_number}:`, geometry);
                  continue;
                }
                
                // Validate first few coordinates to ensure they're valid numbers
                const coords = geometry.coordinates;
                let hasInvalidCoords = false;
                for (let i = 0; i < Math.min(3, coords.length); i++) {
                  const coord = coords[i];
                  if (!coord || !Array.isArray(coord) || coord.length < 2 || 
                      isNaN(coord[0]) || isNaN(coord[1])) {
                    console.error(`[Route] ❌ Invalid coordinate at index ${i} for Team ${responder.team_number}:`, coord);
                    hasInvalidCoords = true;
                    break;
                  }
                }
                
                if (hasInvalidCoords) {
                  console.error(`[Route] ❌ Skipping invalid route for Team ${responder.team_number}`);
                  continue;
                }
                
                responder.route = geometry;
                responder.progress = 0;
                console.log(`[Route] ✅ Route fetched for Team ${responder.team_number}, ${responder.route.coordinates.length} points, duration: ${Math.round(data.routes[0].duration / 60)} min`);
                
                // Add route to map as blue line (only if map style is loaded)
                if (map && map.isStyleLoaded && map.isStyleLoaded()) {
                  try {
                    const routeSourceId = `responder-route-${responder.id}`;
                    const routeLayerId = `responder-route-layer-${responder.id}`;
                    
                    // Remove existing route if any
                    if (map.getLayer && map.getLayer(routeLayerId)) {
                      map.removeLayer(routeLayerId);
                    }
                    if (map.getSource && map.getSource(routeSourceId)) {
                      map.removeSource(routeSourceId);
                    }
                    
                    // Add route source and layer
                    if (map.addSource && map.addLayer) {
                      map.addSource(routeSourceId, {
                        type: 'geojson',
                        data: {
                          type: 'Feature',
                          properties: {},
                          geometry: responder.route
                        }
                      });
                      
                      map.addLayer({
                        id: routeLayerId,
                        type: 'line',
                        source: routeSourceId,
                        layout: {
                          'line-join': 'round',
                          'line-cap': 'round'
                        },
                        paint: {
                          'line-color': '#3b82f6', // Blue color for route
                          'line-width': 4,
                          'line-opacity': 0.8
                        }
                      });
                    }
                  } catch (error) {
                    console.error(`[Route] Error adding route to map:`, error);
                  }
                }
                
                // Update status to en_route if not already
                if (responder.status === 'dispatched') {
                  // Try units table first, fallback to responders for backward compatibility
                  const updateTable = async () => {
                    try {
                      await supabase.from('units').update({ status: 'en_route' }).eq('id', responder.id);
                    } catch {
                      await supabase.from('responders').update({ status: 'en_route' }).eq('id', responder.id);
                    }
                  };
                  await updateTable();
                  responder.status = 'en_route';
                  console.log(`[Route] Updated Team ${responder.team_number} status to en_route`);
                }
              } else {
                console.error(`[Route] ❌ No routes found in response for Team ${responder.team_number}`);
              }
            } catch (error) {
              console.error(`[Route] ❌ Error fetching route for Team ${responder.team_number}:`, error);
            }
          } else {
            console.warn(`[Route] ⚠️ Could not find incident ${responder.incident_id} for Team ${responder.team_number}`);
          }
        }

        // Animate responder along route
        if (responder.route && (responder.status === 'en_route' || responder.status === 'dispatched') && responder.progress !== undefined) {
          // Move at a steady pace (complete route in 10 seconds)
          responder.progress = Math.min(responder.progress + (1 / (10 * 60)), 1); // 60fps, 10 seconds total

          // Validate route structure
          if (!responder.route || typeof responder.route !== 'object') {
            console.error(`[Animation] Invalid route object for Team ${responder.team_number}:`, responder.route);
            continue;
          }

          const coordinates = responder.route.coordinates;
          if (!coordinates || !Array.isArray(coordinates) || coordinates.length === 0) {
            console.error(`[Animation] Invalid route coordinates for Team ${responder.team_number}:`, {
              hasCoordinates: !!coordinates,
              isArray: Array.isArray(coordinates),
              length: coordinates?.length,
              route: responder.route
            });
            continue;
          }

          // Validate first coordinate
          if (!coordinates[0] || !Array.isArray(coordinates[0]) || coordinates[0].length < 2) {
            console.error(`[Animation] Invalid coordinate format for Team ${responder.team_number}:`, coordinates[0]);
            continue;
          }

          const currentPos = getPointAlongLine(coordinates, responder.progress);
          
          // Validate calculated position
          if (!currentPos || !Array.isArray(currentPos) || isNaN(currentPos[0]) || isNaN(currentPos[1])) {
            console.error(`[Animation] Invalid calculated position for Team ${responder.team_number}:`, {
              currentPos,
              progress: responder.progress,
              coordCount: coordinates.length,
              firstCoord: coordinates[0],
              lastCoord: coordinates[coordinates.length - 1]
            });
            continue;
          }

          // Update marker position
          if (responder.marker) {
            responder.marker.setLngLat(currentPos);
            
            // Log less frequently - only every 10%
            if (Math.abs((responder.progress * 100) % 10) < 2) {
              console.log(`[Animation] Team ${responder.team_number} at ${Math.round(responder.progress * 100)}% progress`);
            }
          }

          // CHECK FOR FIRE COLLISION WHILE MOVING
          const incident = incidents.find(i => String(i.id) === String(responder.incident_id));
          if (incident && responder.status === 'en_route') {
            const [fireLon, fireLat] = incident.coordinates;
            const [truckLon, truckLat] = currentPos;
            
            // Get fire state to calculate ACTUAL current fire radius
            const incidentKey = typeof incident.id === 'number' ? incident.id : parseInt(String(incident.id), 10);
            const fireState = fireStateRef.current[incidentKey];
            if (fireState) {
              // Calculate the current radius multiplier (same logic as in animateFire)
              const now = Date.now();
              const elapsedSeconds = (now - (fireState.startTime || now)) / 1000;
              
              // Check if other responders are already on scene
              const othersOnScene = latestRespondersRef.current.filter(
                r => String(r.incident_id) === String(incident.id) && r.status === 'on_scene' && r.id !== responder.id
              ).length;
              
              let currentRadiusMultiplier = 1.0;
              if (othersOnScene > 0 && fireState.containmentStartTime) {
                // Fire is already being contained
                const containmentSeconds = (now - fireState.containmentStartTime) / 1000;
                const shrinkProgress = Math.min(containmentSeconds / (20 / othersOnScene), 1);
                currentRadiusMultiplier = 1 - (shrinkProgress * 0.95);
              } else {
                // Fire is still growing
                const growthProgress = Math.min(elapsedSeconds / 240, 1);
                const easedGrowth = 1 - Math.pow(1 - growthProgress, 1.8);
                const pulse = Math.sin(elapsedSeconds * fireState.waveSpeed + fireState.seed) * 0.01;
                currentRadiusMultiplier = 0.02 + (easedGrowth * 0.98) + pulse;
              }
              
              const currentRadius = fireState.baseRadius * currentRadiusMultiplier;
              
              // Calculate distance from truck to fire center
              const distanceKm = calculateDistance(truckLat, truckLon, fireLat, fireLon);
              const distanceMeters = distanceKm * 1000;
              
              // If truck touches fire edge, STOP and mark as on_scene immediately!
              if (distanceMeters <= currentRadius + 50) {
                responder.status = 'on_scene';
                responder.progress = 1; // Stop movement
                
                // Try units table first, fallback to responders for backward compatibility
                const updateOnScene = async () => {
                  try {
                    await supabase.from('units').update({
                      status: 'on_scene',
                      arrived_at: new Date().toISOString(),
                      current_lat: truckLat,
                      current_lon: truckLon
                    }).eq('id', responder.id);
                  } catch {
                    await supabase.from('responders').update({
                      status: 'on_scene',
                      arrived_at: new Date().toISOString(),
                      current_lat: truckLat,
                      current_lon: truckLon
                    }).eq('id', responder.id);
                  }
                };
                await updateOnScene();
                
                // CRITICAL: Update React state AND ref immediately
                setResponders(prev => {
                  const updated = prev.map(r => 
                    r.id === responder.id 
                      ? { ...r, status: 'on_scene' as const }
                      : r
                  );
                  latestRespondersRef.current = updated;
                  return updated;
                });
                
                // Remove route from map
                if (map && map.isStyleLoaded && map.isStyleLoaded()) {
                  try {
                    const routeSourceId = `responder-route-${responder.id}`;
                    const routeLayerId = `responder-route-layer-${responder.id}`;
                    if (map.getLayer && map.getLayer(routeLayerId)) {
                      map.removeLayer(routeLayerId);
                    }
                    if (map.getSource && map.getSource(routeSourceId)) {
                      map.removeSource(routeSourceId);
                    }
                  } catch (error) {
                    console.error(`[Route] Error removing route from map:`, error);
                  }
                }
                
                console.log(`[Responder] ✅ Team ${responder.team_number} TOUCHED FIRE EDGE at ${distanceMeters.toFixed(0)}m from center! ON SCENE`);
                console.log(`[Responder] 🔥 Fire radius: ${currentRadius.toFixed(0)}m - Beginning suppression operations!`);
                
                // Skip the rest of the animation for this responder
                continue;
              }
            }
          }

          // Update current position in database every 5 seconds
          if (Math.random() < 0.012) { // ~5 seconds at 60fps
            // Try units table first, fallback to responders for backward compatibility
            const updatePosition = async () => {
              try {
                await supabase.from('units').update({
                  current_lat: currentPos[1],
                  current_lon: currentPos[0]
                }).eq('id', responder.id);
              } catch {
                await supabase.from('responders').update({
                  current_lat: currentPos[1],
                  current_lon: currentPos[0]
                }).eq('id', responder.id);
              }
            };
            updatePosition();
          }

          // When responder reaches destination, keep them en_route until they touch the fire
          if (responder.progress >= 1 && responder.status === 'dispatched') {
            responder.status = 'en_route';
            
            // Update database to en_route
            const updateToEnRoute = async () => {
              try {
                await supabase.from('units').update({ status: 'en_route' }).eq('id', responder.id);
              } catch {
                await supabase.from('responders').update({ status: 'en_route' }).eq('id', responder.id);
              }
            };
            await updateToEnRoute();
            
            console.log(`[Responder] Team ${responder.team_number} arrived at fire location, approaching fire edge...`);
            
            // Remove route from map when arrived at location
            if (map && map.isStyleLoaded && map.isStyleLoaded()) {
              try {
                const routeSourceId = `responder-route-${responder.id}`;
                const routeLayerId = `responder-route-layer-${responder.id}`;
                if (map.getLayer && map.getLayer(routeLayerId)) {
                  map.removeLayer(routeLayerId);
                }
                if (map.getSource && map.getSource(routeSourceId)) {
                  map.removeSource(routeSourceId);
                }
              } catch (error) {
                console.error(`[Route] Error removing route from map:`, error);
              }
            }
          }
          
          // FALLBACK: Check if responder touches fire edge (after reaching destination)
          // This should rarely trigger since we check during movement above
          if (responder.progress >= 1 && responder.status === 'en_route') {
            const incident = incidents.find(i => String(i.id) === String(responder.incident_id));
            if (incident) {
              const [fireLon, fireLat] = incident.coordinates;
              const [truckLon, truckLat] = responder.marker?.getLngLat ? [responder.marker.getLngLat().lng, responder.marker.getLngLat().lat] : [fireLon, fireLat];
              
              // Get fire state to calculate ACTUAL current fire radius
              const incidentKey = typeof incident.id === 'number' ? incident.id : parseInt(String(incident.id), 10);
              const fireState = fireStateRef.current[incidentKey];
              if (fireState) {
                // Calculate the current radius multiplier (same logic as in animateFire)
                const now = Date.now();
                const elapsedSeconds = (now - (fireState.startTime || now)) / 1000;
                
                // Check if other responders are already on scene (use ref for latest value)
                const othersOnScene = latestRespondersRef.current.filter(
                  r => String(r.incident_id) === String(incident.id) && r.status === 'on_scene' && r.id !== responder.id
                ).length;
                
                let currentRadiusMultiplier = 1.0;
                if (othersOnScene > 0 && fireState.containmentStartTime) {
                  // Fire is already being contained
                  const containmentSeconds = (now - fireState.containmentStartTime) / 1000;
                  const shrinkProgress = Math.min(containmentSeconds / (20 / othersOnScene), 1);
                  currentRadiusMultiplier = 1 - (shrinkProgress * 0.95);
                } else {
                  // Fire is still growing
                  const growthProgress = Math.min(elapsedSeconds / 240, 1);
                  const easedGrowth = 1 - Math.pow(1 - growthProgress, 1.8);
                  const pulse = Math.sin(elapsedSeconds * fireState.waveSpeed + fireState.seed) * 0.01;
                  currentRadiusMultiplier = 0.02 + (easedGrowth * 0.98) + pulse;
                }
                
                const currentRadius = fireState.baseRadius * currentRadiusMultiplier;
                
                // Calculate distance from truck to fire center
                const distanceKm = calculateDistance(truckLat, truckLon, fireLat, fireLon);
                const distanceMeters = distanceKm * 1000;
                
                console.log(`[Responder] Team ${responder.team_number} distance to fire: ${distanceMeters.toFixed(0)}m, fire radius: ${currentRadius.toFixed(0)}m`);
                
                // If truck is within fire radius + 50m buffer (touching fire edge)
                if (distanceMeters <= currentRadius + 50) {
                  responder.status = 'on_scene';
                  
                  const updateToOnScene = async () => {
                    try {
                      await supabase.from('units').update({
                        status: 'on_scene',
                        arrived_at: new Date().toISOString()
                      }).eq('id', responder.id);
                    } catch {
                      await supabase.from('responders').update({
                        status: 'on_scene',
                        arrived_at: new Date().toISOString()
                      }).eq('id', responder.id);
                    }
                  };
                  await updateToOnScene();
                  
                  // CRITICAL: Update React state AND ref immediately so fire animation sees the responder on scene
                  setResponders(prev => {
                    const updated = prev.map(r => 
                      r.id === responder.id 
                        ? { ...r, status: 'on_scene' as const }
                        : r
                    );
                    latestRespondersRef.current = updated;
                    return updated;
                  });
                  
                  console.log(`[Responder] ✅ Team ${responder.team_number} made contact with fire! ON SCENE`);
                  console.log(`[Responder] 🔥 Beginning fire suppression operations`);
                }
              }
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(animateResponders);
    };

    animateResponders();

    return () => {
      console.log('[Responder Animation] Cleanup');
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      
      // Clean up markers and routes
      respondersRef.forEach(r => {
        if (r.marker) {
          try {
            r.marker.remove();
          } catch (error) {
            console.error('Error removing marker:', error);
          }
        }
        // Clean up route layers
        if (map && map.isStyleLoaded && map.isStyleLoaded()) {
          try {
            const routeSourceId = `responder-route-${r.id}`;
            const routeLayerId = `responder-route-layer-${r.id}`;
            if (map.getLayer && map.getLayer(routeLayerId)) {
              map.removeLayer(routeLayerId);
            }
            if (map.getSource && map.getSource(routeSourceId)) {
              map.removeSource(routeSourceId);
            }
          } catch (error) {
            console.error('Error cleaning up route:', error);
          }
        }
      });
    };
  }, [responders, incidents, selectedIncidentId, firestations, unitUpdateCallback]);

  // Update AI routes and evacuation zones on map
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    // Wait for map to be fully loaded with all sources
    const updateSources = () => {
      try {
        // Update AI routes only if source exists
        if (map.getSource(aiRouteSourceId)) {
          const aiSource = map.getSource(aiRouteSourceId) as mapboxgl.GeoJSONSource;
          if (aiSource && typeof aiSource.setData === 'function') {
            const routeFeatures = aiRecommendedRoutes.map((route: any) => ({
              type: 'Feature' as const,
              properties: {
                station_id: route.station_id,
                reason: route.reason,
                risk_score: route.risk_score
              },
              geometry: route.new_route?.geometry || {
                type: 'LineString' as const,
                coordinates: route.new_route?.waypoints || []
              }
            }));

            aiSource.setData({
              type: 'FeatureCollection',
              features: routeFeatures
            });
          }
        }

        // Update evacuation zones only if source exists
        if (map.getSource(evacuationSourceId)) {
          const evacSource = map.getSource(evacuationSourceId) as mapboxgl.GeoJSONSource;
          if (evacSource && typeof evacSource.setData === 'function') {
            const evacuationFeatures = evacuationZones.map((zone: any) => ({
              type: 'Feature' as const,
              properties: {
                fire_id: zone.fire_id,
                zone_name: zone.zone_name
              },
              geometry: {
                type: 'Polygon' as const,
                coordinates: [zone.polygon || []]
              }
            }));

            evacSource.setData({
              type: 'FeatureCollection',
              features: evacuationFeatures
            });
          }
        }
      } catch (error) {
        console.error('Error updating map sources:', error);
      }
    };

    // If map is already loaded, update immediately
    if (map.loaded()) {
      updateSources();
    } else {
      // Otherwise wait for load event
      map.once('load', updateSources);
    }
  }, [aiRecommendedRoutes, evacuationZones]);

  useEffect(() => {
    if (!mapContainerRef.current || loading) return;

    // Set Mapbox access token
    mapboxgl.accessToken = 'pk.eyJ1Ijoic3BhbnVnYW50aTMxIiwiYSI6ImNtaDVwbzBlYzA1bTkybnB6azQxZnEwOGEifQ.eCNufvFartJqVo8Nwkwkeg';

    // Initialize map
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-122.0, 38.5],
      zoom: 7.5,
      pitch: 45,
      bearing: 0,
      attributionControl: false
    });

    const map = mapRef.current;

    // Navigation and fullscreen controls removed per user request
    
    // Add scale control
    map.addControl(new mapboxgl.ScaleControl({ maxWidth: 100, unit: 'imperial' }), 'bottom-left');

    // Emit initial map center
    if (onMapMove) {
      const center = map.getCenter();
      onMapMove({ lat: center.lat, lon: center.lng });
    }

    // Track map movement
    map.on('moveend', () => {
      if (onMapMove) {
        const center = map.getCenter();
        onMapMove({ lat: center.lat, lon: center.lng });
      }
    });

    // Call onMapReady callback with navigation function
    if (onMapReady) {
      onMapReady(navigateToIncident);
    }

    // Wait for map to load
    map.on('load', () => {
    // Add terrain source
    map.addSource('mapbox-dem', {
      type: 'raster-dem',
      url: 'mapbox://mapbox.terrain-rgb',
      tileSize: 512,
      maxzoom: 14
    });

      // Set terrain with exaggeration
    map.setTerrain({ 
      source: 'mapbox-dem', 
      exaggeration: 1.5 
    });

    // Add 3D buildings layer
    map.addLayer({
      id: '3d-buildings',
      source: 'composite',
      'source-layer': 'building',
      filter: ['==', 'extrude', 'true'],
      type: 'fill-extrusion',
      paint: {
        'fill-extrusion-color': '#888',
        'fill-extrusion-height': ['get', 'height'],
        'fill-extrusion-opacity': 0.6
      }
    });

      // Add sky layer
    map.addLayer({
      id: 'sky',
      type: 'sky',
      paint: {
        'sky-type': 'atmosphere',
        'sky-atmosphere-sun': [0.0, 0.0],
        'sky-atmosphere-sun-intensity': 15
      }
    });

      // Initialize dynamic fire polygons for active incidents
      activeIncidents.forEach((incident) => {
        const seed = Math.random() * Math.PI * 2;
        
        // Generate wind-influenced growth vectors using CURRENT wind
        // These values will be LOCKED for this fire and won't change
        const numVectors = 16; // Fewer directional segments for simpler shapes
        const growthVectors = generateWindInfluencedGrowthVectors(
          numVectors,
          windSpeed,
          windDirection
        );
        
        const incidentKey = typeof incident.id === 'number' ? incident.id : parseInt(String(incident.id), 10);
        fireStateRef.current[incidentKey] = {
          baseRadius: getBaseRadiusMeters(incident) * 2.5, // Allow larger expansion (2.5x larger)
          roughness: 0.2 + Math.random() * 0.15, // Less roughness for more stable edges
          waveSpeed: 0.3 + Math.random() * 0.3,  // Slower wave speed
          amplitude: 90 + Math.random() * 110,
          expansionRate: getExpansionRate(incident),
          seed,
          growthVectors,
          startTime: Date.now(), // Track when this fire started
          initialWindSpeed: windSpeed, // Lock initial wind speed
          initialWindDirection: windDirection // Lock initial wind direction
        };
      });

      const initialFireFeatures: FeatureCollection<GeoJSON.Polygon, FireFeatureProperties> = {
        type: 'FeatureCollection',
        features: activeIncidents.map((incident) => {
          const incidentKey = typeof incident.id === 'number' ? incident.id : parseInt(String(incident.id), 10);
          const state = fireStateRef.current[incidentKey];
          return createFireFeature(incident, state.baseRadius * 0.02, { // Start tiny (2% of base)
            roughness: state.roughness,
            seed: state.seed,
            intensity: 0.55,
            points: 24, // Fewer edges for simpler polygon
            growthVectors: state.growthVectors,
            elapsedTime: 0 // Just starting
          });
        })
      };

      map.addSource(fireSourceId, {
        type: 'geojson',
        data: initialFireFeatures
      });

      map.addLayer({
        id: fireLayerId,
        type: 'fill',
        source: fireSourceId,
        paint: {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'intensity'],
            0, 'rgba(140, 20, 0, 0.35)',      // Very dark red (core/oldest)
            0.2, 'rgba(180, 35, 5, 0.45)',    // Deep maroon-red
            0.35, 'rgba(200, 50, 10, 0.55)',  // Dark burnt orange
            0.5, 'rgba(220, 70, 15, 0.65)',   // Rich orange-red
            0.65, 'rgba(235, 90, 25, 0.7)',   // Deeper orange
            0.8, 'rgba(245, 110, 35, 0.75)',  // Bright orange
            1, 'rgba(255, 130, 50, 0.8)'      // Lighter orange (edges/newest)
          ],
          'fill-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            7, 0.5,    // More visible at far zoom
            10, 0.65,  // Increased opacity
            13, 0.75,
            16, 0.85   // Very visible when zoomed in
          ],
          'fill-outline-color': 'rgba(200, 60, 0, 0.5)' // Darker orange-red outline
        }
      });

      map.addLayer(
        {
          id: 'fire-glow-outline',
          type: 'line',
          source: fireSourceId,
          paint: {
            'line-color': 'rgba(240, 100, 40, 0.7)',  // Brighter orange glow for edge
            'line-width': [
              'interpolate',
              ['linear'],
              ['zoom'],
              7, 1.5,
              12, 3,
              15, 5
            ],
            'line-blur': 4,
            'line-opacity': 0.75
          }
        },
        fireLayerId
      );

      // Add AI-recommended routes source and layer
      map.addSource(aiRouteSourceId, {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });

      map.addLayer({
        id: aiRouteLayerId,
        type: 'line',
        source: aiRouteSourceId,
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#FF8C00', // Dark orange for AI routes
          'line-width': 5,
          'line-dasharray': [2, 2], // Dashed line
          'line-opacity': 0.9
        }
      });

      // Add evacuation zones source and layer
      map.addSource(evacuationSourceId, {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });

      map.addLayer({
        id: evacuationLayerId,
        type: 'fill',
        source: evacuationSourceId,
        paint: {
          'fill-color': '#DC2626', // Red for evacuation zones
          'fill-opacity': 0.15
        }
      });

      map.addLayer({
        id: 'evacuation-outline',
        type: 'line',
        source: evacuationSourceId,
        paint: {
          'line-color': '#DC2626',
          'line-width': 2,
          'line-dasharray': [4, 2],
          'line-opacity': 0.8
        }
      });

      const animateFire = (timestamp: number) => {
        if (!mapRef.current) return;
        if (fireStartTimeRef.current === null) {
          fireStartTimeRef.current = timestamp;
        }

        const elapsedSeconds = (timestamp - fireStartTimeRef.current) / 1000;

        const features = activeIncidents.map((incident) => {
          const incidentKey = typeof incident.id === 'number' ? incident.id : parseInt(String(incident.id), 10);
          const state = fireStateRef.current[incidentKey];
          if (!state) {
            return createFireFeature(incident, getBaseRadiusMeters(incident));
          }

          // Check if responders are on scene for this fire (use ref to get latest value)
          const respondersOnScene = latestRespondersRef.current.filter(
            r => String(r.incident_id) === String(incident.id) && r.status === 'on_scene'
          ).length;

          let radiusMultiplier = 1.0;

          if (respondersOnScene > 0) {
            // Responders are containing the fire - STOP GROWTH and start shrinking
            if (!state.containmentStartTime) {
              state.containmentStartTime = timestamp;
              state.containmentRate = 0.15 * respondersOnScene; // More responders = faster containment
              state.respondersOnScene = respondersOnScene;
              // Lock the fire size at the moment containment starts
              state.maxRadiusBeforeContainment = state.baseRadius * radiusMultiplier;
              console.log(`[Fire Containment] ${respondersOnScene} responders on scene at ${incident.name}, STOPPING fire growth and beginning containment`);
            }

            const containmentSeconds = (timestamp - state.containmentStartTime) / 1000;
            // Fire shrinks over 20 seconds per responder (fast demo)
            const shrinkProgress = Math.min(containmentSeconds / (20 / respondersOnScene), 1);
            
            // Start from the locked size (when containment began) and shrink to 5%
            // This ensures fire doesn't grow after responders arrive
            radiusMultiplier = 1 - (shrinkProgress * 0.95);

            // Update containment percentage in Supabase
            const newContainment = Math.min(Math.floor(shrinkProgress * 100), 100);
            if (newContainment !== incident.containment && newContainment % 10 === 0) {
              // Update every 10% for faster updates
              console.log(`[Fire Containment] ${incident.name} containment: ${newContainment}%`);
              supabase
                .from('incidents')
                .update({ 
                  containment: newContainment,
                  status: newContainment >= 100 ? 'contained' : 'active'
                })
                .eq('id', String(incident.id))
                .then(({ error }) => {
                  if (error) console.error('Error updating containment:', error);
                });
            }
            
            // If fully contained, return responders to available
            if (shrinkProgress >= 1 && newContainment >= 100) {
              console.log(`[Fire Containment] ✅ ${incident.name} fully contained!`);
              
              // Reset all responders on this fire back to available (use ref for latest value)
              // Include both on_scene AND en_route responders
              const respondersToReset = latestRespondersRef.current.filter(
                r => String(r.incident_id) === String(incident.id) && 
                     (r.status === 'on_scene' || r.status === 'en_route' || r.status === 'dispatched')
              );
              
              const onScene = respondersToReset.filter(r => r.status === 'on_scene').length;
              const enRoute = respondersToReset.filter(r => r.status === 'en_route').length;
              const dispatched = respondersToReset.filter(r => r.status === 'dispatched').length;
              console.log(`[Fire Containment] 🚒 Returning ${respondersToReset.length} responders to station (${onScene} on-scene, ${enRoute} en-route, ${dispatched} dispatched)`);
              
              // Reset all responders asynchronously
              const resetPromises = respondersToReset.map(responder => {
                // Get the firestation to reset position
                const station = firestations.find(fs => fs.id === responder.firestation_id);
                if (station) {
                  // Remove marker if it exists
                  if (responder.marker) {
                    try {
                      responder.marker.remove();
                    } catch (e) {
                      console.error('Error removing marker:', e);
                    }
                  }
                  
                  // Try units table first, fallback to responders
                  const resetUnit = async () => {
                    try {
                      return await supabase.from('units').update({
                        status: 'available',
                        incident_id: null,
                        current_lat: station.lat,
                        current_lon: station.lon,
                        dispatched_at: null,
                        arrived_at: null
                      }).eq('id', responder.id);
                    } catch {
                      return await supabase.from('responders').update({
                        status: 'available',
                        incident_id: null,
                        current_lat: station.lat,
                        current_lon: station.lon,
                        dispatched_at: null,
                        arrived_at: null
                      }).eq('id', responder.id);
                    }
                  };
                  return resetUnit()
                    .then(({ error }) => {
                      if (!error) {
                        console.log(`[Fire Containment] ✅ Team ${responder.team_number} returned to available at ${station.name}`);
                      } else {
                        console.error(`[Fire Containment] Error resetting team ${responder.team_number}:`, error);
                      }
                    });
                }
                return Promise.resolve();
              });
              
              // Wait for all responders to be reset, then update UI state
              Promise.all(resetPromises).then(() => {
                // Update local state to remove ALL responders for this incident
                setResponders(prev => {
                  const updated = prev.filter(r => 
                    String(r.incident_id) !== String(incident.id)
                  );
                  latestRespondersRef.current = updated;
                  return updated;
                });
                
                // Trigger responder stats refresh to update UI counts
                if (onResponderUpdate) {
                  setTimeout(() => {
                    console.log('[Fire Containment] Triggering responder stats refresh');
                    // Force a refresh by re-fetching stats
                    fetch('/api/dispatch-unit')
                      .then(res => res.json())
                      .then(data => {
                        if (unitUpdateCallback && data.totals) {
                          unitUpdateCallback(
                            {
                              available: data.totals.available || 0,
                              dispatched: data.totals.dispatched || 0,
                              active: data.totals.on_scene || data.totals.active || 0
                            },
                            data.activeUnits || data.activeResponders || []
                          );
                        }
                      })
                      .catch(err => console.error('Error refreshing unit stats:', err));
                  }, 500); // Small delay to ensure DB updates complete
                }
              });
              
              // Clear containment state and reset counters
              state.containmentStartTime = undefined;
              state.respondersOnScene = 0;
              state.maxRadiusBeforeContainment = undefined;
              
              console.log('[Fire Containment] Fire state fully reset, ready for next incident');
            }
          } else {
            // Only grow if containment hasn't started
            // Once containment starts, this branch never executes again for this fire
            if (!state.containmentStartTime) {
              // Calculate growth over time with very slow, steady expansion
              // Fire spreads slowly but visibly over 240 seconds (4 minutes)
              const growthProgress = Math.min(elapsedSeconds / 240, 1); // 240 seconds to reach full size
              const easedGrowth = 1 - Math.pow(1 - growthProgress, 1.8); // Even slower ease out
              
              // Add extremely subtle pulsing variation (barely noticeable)
              const pulse = Math.sin(elapsedSeconds * state.waveSpeed + state.seed) * 0.01;
              
              // Calculate final radius with slow natural growth curve
              // Starts at 2%, grows to 100% over 4 minutes (starts smaller)
              radiusMultiplier = 0.02 + (easedGrowth * 0.98) + pulse;
            } else {
              // Containment started but responders left - keep fire at locked size
              radiusMultiplier = 1.0;
            }
          }

          const radiusMeters = state.baseRadius * radiusMultiplier;

          // Very subtle intensity variation for stable appearance
          const intensity = clamp(
            0.6 + 0.15 * Math.abs(Math.sin(elapsedSeconds * 0.8 + state.seed)),
            0.55,
            0.85
          );

          return createFireFeature(incident, radiusMeters, {
            time: elapsedSeconds,
            roughness: state.roughness,
            seed: state.seed,
            intensity,
            points: 24, // Fewer edges for simpler polygon
            growthVectors: state.growthVectors,
            elapsedTime: elapsedSeconds
          });
        });

        const source = map.getSource(fireSourceId) as mapboxgl.GeoJSONSource | undefined;
        if (source) {
          source.setData({
            type: 'FeatureCollection',
            features
          });
        }

        fireAnimationRef.current = requestAnimationFrame(animateFire);
      };

      fireAnimationRef.current = requestAnimationFrame(animateFire);

      // Add static wildfire markers
      incidents.forEach((incident) => {
        const [lng, lat] = incident.coordinates;
        if (typeof lng !== 'number' || typeof lat !== 'number') return;

        const intensity = incident.intensity || 'low';
        const isActive = incident.status === 'active';

        // Create marker element
        const markerEl = document.createElement('div');
        markerEl.className = 'relative';
        markerEl.style.cursor = 'pointer';
        markerEl.style.zIndex = '100'; // Fire incidents always on top

        if (isActive) {
          const pulseEl = document.createElement('div');
          pulseEl.className = 'absolute rounded-full border-2 opacity-30 pulse-animation';
          pulseEl.style.width = `${getPulseSize(intensity)}px`;
          pulseEl.style.height = `${getPulseSize(intensity)}px`;
          pulseEl.style.borderColor = getMarkerColor(intensity);
          pulseEl.style.transform = 'translate(-50%, -50%)';
          pulseEl.style.top = '50%';
          pulseEl.style.left = '50%';
          pulseEl.style.position = 'absolute';
          pulseEl.style.zIndex = '1';
          markerEl.appendChild(pulseEl);
        }

        const mainMarker = document.createElement('div');
        mainMarker.className = 'rounded-full border-2 border-white shadow-lg relative';
        mainMarker.style.width = `${getMarkerSize(intensity)}px`;
        mainMarker.style.height = `${getMarkerSize(intensity)}px`;
        mainMarker.style.backgroundColor = getMarkerColor(intensity);
        mainMarker.style.transform = 'translate(-50%, -50%)';
        mainMarker.style.position = 'absolute';
        mainMarker.style.top = '50%';
        mainMarker.style.left = '50%';
        mainMarker.style.zIndex = '100'; // Higher z-index for fire markers
        mainMarker.style.boxShadow = `0 0 20px ${getMarkerColor(intensity)}40`;
        markerEl.appendChild(mainMarker);

        if (intensity === 'critical') {
          const particleEl = document.createElement('div');
          particleEl.className = 'particle-trail';
          markerEl.appendChild(particleEl);
        }

        // Add fire name label (hidden by default, shown when selected)
        const labelEl = document.createElement('div');
        labelEl.className = 'absolute whitespace-nowrap fire-label';
        labelEl.style.left = '50%';
        labelEl.style.top = '100%';
        labelEl.style.transform = 'translateX(-50%)';
        labelEl.style.marginTop = '8px';
        labelEl.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
        labelEl.style.color = 'white';
        labelEl.style.padding = '4px 8px';
        labelEl.style.borderRadius = '6px';
        labelEl.style.fontSize = '11px';
        labelEl.style.fontWeight = '600';
        labelEl.style.border = `1px solid ${getMarkerColor(intensity)}`;
        labelEl.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
        labelEl.style.pointerEvents = 'none';
        labelEl.style.zIndex = '101';
        labelEl.style.display = 'none'; // Hidden by default
        labelEl.textContent = incident.name;
        labelEl.setAttribute('data-fire-id', incident.id.toString());
        markerEl.appendChild(labelEl);

        const marker = new mapboxgl.Marker({ element: markerEl })
          .setLngLat([lng, lat])
          .addTo(map);

        markerEl.addEventListener('click', () => {
          // Set selected fire ID
          const numericId = typeof incident.id === 'number' ? incident.id : parseInt(String(incident.id), 10);
          setSelectedFireId(numericId);
          
          // Notify parent component that this incident was selected
          if (onIncidentSelect) {
            // Find the original incident to get all required fields
            const originalIncident = incidents.find(i => i.id === incident.id);
            if (originalIncident) {
              onIncidentSelect({
                id: originalIncident.id.toString(),
                name: originalIncident.name,
                risk: originalIncident.intensity as 'low' | 'medium' | 'high' | 'critical',
                lat: lat,
                lon: lng,
                containment: originalIncident.containment || 0,
                last_update: originalIncident.last_update || new Date().toISOString(),
                description: originalIncident.description || null,
              });
            }
          }
          
          // Find nearest fire station and display route (only for active fires)
          if (incident.status === 'active') {
            const nearestStation = findNearestFirestation(lat, lng, firestations);
            if (nearestStation) {
              displayRouteToFire(lat, lng, nearestStation.lat, nearestStation.lon);
            }
          }

          map.flyTo({
            center: [lng, lat],
            zoom: 17,
            pitch: 60,
            bearing: map.getBearing(),
            duration: 3500,
            padding: { top: 260, bottom: 40, left: 40, right: 40 },
            essential: true
          });

          if (popupRef.current) {
            popupRef.current.remove();
          }

          const popupContent = createPopupContent(incident);

          popupRef.current = new mapboxgl.Popup({ closeButton: true, closeOnClick: true, maxWidth: '380px', offset: 20, anchor: 'bottom' })
            .setLngLat([lng, lat])
            .setHTML(popupContent)
            .addTo(map);

          // After popup is added, wire up fullscreen toggle behavior
          try {
            const popupNode = popupRef.current?.getElement();
            if (popupNode) {
              const content = popupNode.querySelector('.mapboxgl-popup-content') as HTMLElement | null;
              const videoEl = content?.querySelector('video[data-video-element="true"]') as HTMLVideoElement | null;
              const toggleBtn = content?.querySelector('button[data-fullscreen-toggle="true"]') as HTMLButtonElement | null;
              if (videoEl && toggleBtn) {
                toggleBtn.onclick = async () => {
                  try {
                    const anyVideo: any = videoEl as any;
                    if (!document.fullscreenElement) {
                      if (videoEl.requestFullscreen) await videoEl.requestFullscreen();
                      else if (anyVideo.webkitRequestFullscreen) await anyVideo.webkitRequestFullscreen();
                      else if (anyVideo.msRequestFullscreen) await anyVideo.msRequestFullscreen();
                    } else {
                      const anyDoc: any = document as any;
                      if (document.exitFullscreen) await document.exitFullscreen();
                      else if (anyDoc.webkitExitFullscreen) await anyDoc.webkitExitFullscreen();
                      else if (anyDoc.msExitFullscreen) await anyDoc.msExitFullscreen();
                    }
                  } catch (e) {
                    console.warn('Popup fullscreen failed, opening fallback modal');
                    // Fallback: open the React modal by dispatching a custom event the page can listen to
                    window.dispatchEvent(new CustomEvent('openVideoModal', { detail: { fireName: incident.name } }));
                  }
                };
              }
            }
          } catch (e) {
            // No-op if wiring fails
          }
        });

        markersRef.current.push(marker);
      });

      // Add firestation markers
      firestations.forEach((firestation) => {
        const { lat, lon, name } = firestation;
        if (typeof lat !== 'number' || typeof lon !== 'number') return;

        // Create firestation marker element
        const markerEl = createFirestationMarker();

        // Create marker
        const marker = new mapboxgl.Marker({ 
          element: markerEl,
          anchor: 'center'
        })
          .setLngLat([lon, lat])
          .addTo(map);

        // Add click event for popup
        markerEl.addEventListener('click', (e) => {
          e.stopPropagation();
          if (popupRef.current) {
            popupRef.current.remove();
          }

          const popupContent = createFirestationPopupContent(firestation);

          popupRef.current = new mapboxgl.Popup({ 
            closeButton: true, 
            closeOnClick: true, 
            maxWidth: '300px', 
            offset: 25, 
            anchor: 'bottom' 
          })
            .setLngLat([lon, lat])
            .setHTML(popupContent)
            .addTo(map);
        });

        markersRef.current.push(marker);
      });
    });

    // Cursor interactions
    map.on('mousemove', () => {
      map.getCanvas().style.cursor = 'grab';
    });

    map.on('mousedown', () => {
      map.getCanvas().style.cursor = 'grabbing';
    });

    map.on('mouseup', () => {
      map.getCanvas().style.cursor = 'grab';
    });

    // Cleanup
    return () => {
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      if (popupRef.current) {
        popupRef.current.remove();
      }
      if (fireAnimationRef.current !== null) {
        cancelAnimationFrame(fireAnimationRef.current);
        fireAnimationRef.current = null;
      }
      fireStartTimeRef.current = null;
      if (mapRef.current && mapRef.current.getLayer('fire-glow-outline')) {
        mapRef.current.removeLayer('fire-glow-outline');
      }
      if (mapRef.current && mapRef.current.getLayer(fireLayerId)) {
        mapRef.current.removeLayer(fireLayerId);
      }
      if (mapRef.current && mapRef.current.getSource(fireSourceId)) {
        mapRef.current.removeSource(fireSourceId);
      }
      // Clean up route layers
      if (mapRef.current && mapRef.current.getLayer(routeArrowLayerId)) {
        mapRef.current.removeLayer(routeArrowLayerId);
      }
      if (mapRef.current && mapRef.current.getLayer(routeLayerId)) {
        mapRef.current.removeLayer(routeLayerId);
      }
      if (mapRef.current && mapRef.current.getSource(routeSourceId)) {
        mapRef.current.removeSource(routeSourceId);
      }
      map.remove();
    };
  }, [loading, incidents, firestations, displayRouteToFire]);

  // Wind values are now LOCKED when fire is created - no updates when wind changes
  // This prevents fire from constantly changing as user pans/zooms the map
  // Each fire uses its initial wind conditions throughout its lifecycle

  // Update fire label visibility when selected fire changes
  useEffect(() => {
    // Hide all labels first
    document.querySelectorAll('.fire-label').forEach((label) => {
      (label as HTMLElement).style.display = 'none';
    });
    
    // Show label for selected fire
    if (selectedFireId !== null) {
      const selectedLabel = document.querySelector(`.fire-label[data-fire-id="${selectedFireId}"]`);
      if (selectedLabel) {
        (selectedLabel as HTMLElement).style.display = 'block';
      }
    }
  }, [selectedFireId]);

  // Reset view function
  const resetView = useCallback(() => {
    if (mapRef.current) {
      // Clear selected fire
      setSelectedFireId(null);
      
      // Clear any existing route
      if (mapRef.current.getLayer(routeArrowLayerId)) {
        mapRef.current.removeLayer(routeArrowLayerId);
      }
      if (mapRef.current.getLayer(routeLayerId)) {
        mapRef.current.removeLayer(routeLayerId);
      }
      if (mapRef.current.getSource(routeSourceId)) {
        mapRef.current.removeSource(routeSourceId);
      }
      
      mapRef.current.flyTo({
        center: [-122.0, 38.5],
        zoom: 7.5,
        pitch: 45,
        bearing: 0,
        duration: 1500
      });
    }
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className={`w-full h-full relative ${className} flex items-center justify-center`}>
        <div className="text-white/70 text-sm">Loading incident data...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={`w-full h-full relative ${className} flex items-center justify-center`}>
        <div className="text-red-400 text-sm">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full relative ${className}`}>
      {/* Vignette overlay for depth */}
      <div className="vignette-overlay z-10 pointer-events-none" />
      
      {/* Map container */}
      <div
        ref={mapContainerRef}
        className="absolute inset-0 z-0"
        style={{ width: '100%', height: '100%', pointerEvents: 'auto' }}
        />

        {/* Custom Reset View Button - Positioned at bottom left to cover Mapbox logo */}
      <div className="absolute bottom-0 left-0 z-30">
          <button
            onClick={resetView}
          className="bg-black/20 backdrop-blur-md border border-white/20 rounded-lg px-2 py-1 text-white text-xs font-medium hover:bg-black/30 hover:border-white/30 transition-all duration-200 flex items-center gap-1 m-1"
            title="Reset to California View"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
              <path d="M21 3v5h-5"/>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
              <path d="M3 21v-5h5"/>
            </svg>
            Reset View
          </button>
        </div>
    </div>
  );
}