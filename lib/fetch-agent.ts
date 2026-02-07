/**
 * Fetch.ai Autonomous Agent for Fire Monitoring
 * Monitors fire spread, analyzes risks, and updates firefighter routes
 */

// Types
interface FireData {
  id: string;
  name: string;
  lat: number;
  lon: number;
  polygon_coords: number[][];
  estimated_radius: number;
  growth_rate: number;
  risk_level: string;
  containment: number;
}

interface Firestation {
  id: number;
  name: string;
  lat: number;
  lon: number;
  city?: string;
  county?: string;
}

interface RouteRisk {
  station_id: number;
  station_name: string;
  fire_id: string;
  fire_name: string;
  risk_score: number;
  distance_to_fire: number;
  reason: string;
}

// Haversine distance calculation
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Check if a point is near a fire polygon
function isPointNearFire(pointLat: number, pointLon: number, firePolygon: number[][], thresholdKm: number = 3): boolean {
  // Check if point is within threshold distance of any polygon point
  for (const coord of firePolygon) {
    const [lon, lat] = coord;
    const distance = calculateDistance(pointLat, pointLon, lat, lon);
    if (distance < thresholdKm) {
      return true;
    }
  }
  return false;
}

// Analyze route risk for a fire-station pair
function analyzeRouteRisk(fire: FireData, station: Firestation): RouteRisk | null {
  const distanceToFire = calculateDistance(station.lat, station.lon, fire.lat, fire.lon);
  
  // Calculate risk score
  // Higher growth rate, closer distance, and higher risk level = higher score
  const riskMultipliers = {
    'critical': 1.0,
    'high': 0.8,
    'medium': 0.6,
    'low': 0.4
  };
  
  const riskMultiplier = riskMultipliers[fire.risk_level as keyof typeof riskMultipliers] || 0.5;
  
  // Risk score formula: (growth_rate × risk_multiplier) / distance
  // Higher score = more dangerous
  const riskScore = (fire.growth_rate * riskMultiplier) / Math.max(distanceToFire, 0.5);
  
  // Check if station is dangerously close to fire
  const isInDanger = isPointNearFire(station.lat, station.lon, fire.polygon_coords, 5); // 5km threshold
  
  if (riskScore > 0.7 || isInDanger) {
    let reason = '';
    if (isInDanger) {
      reason = `Station ${station.name} is within 5km of ${fire.name}. Immediate rerouting recommended.`;
    } else {
      reason = `${fire.name} (${fire.risk_level} risk) spreading rapidly toward ${station.name}. Distance: ${distanceToFire.toFixed(1)}km`;
    }
    
    return {
      station_id: station.id,
      station_name: station.name,
      fire_id: fire.id,
      fire_name: fire.name,
      risk_score: riskScore,
      distance_to_fire: distanceToFire,
      reason
    };
  }
  
  return null;
}

// Calculate alternative route (simplified - uses opposite direction from fire)
async function calculateAlternativeRoute(
  station: Firestation,
  fire: FireData,
  apiUrl: string
): Promise<any> {
  // Calculate angle from fire to station
  const deltaLat = station.lat - fire.lat;
  const deltaLon = station.lon - fire.lon;
  const angleFromFire = Math.atan2(deltaLon, deltaLat);
  
  // Move station position away from fire (1km further)
  const offsetDistance = 1.0; // km
  const newLat = station.lat + (offsetDistance / 111) * Math.cos(angleFromFire);
  const newLon = station.lon + (offsetDistance / (111 * Math.cos(station.lat * Math.PI / 180))) * Math.sin(angleFromFire);
  
  return {
    from: [station.lon, station.lat],
    to: [newLon, newLat],
    waypoints: [], // In real implementation, use Mapbox Directions API
    reason: `Routed away from ${fire.name}`
  };
}

// Calculate evacuation zones
function calculateEvacuationZones(fire: FireData): Array<{ fire_id: string; zone_name: string; polygon: number[][] }> {
  const evacuationZones = [];
  
  // Create evacuation zone 2km beyond fire perimeter
  const evacuationRadius = fire.estimated_radius + 2000; // Add 2km buffer
  const evacuationPolygon: number[][] = [];
  
  // Generate circle polygon
  const centerLat = fire.lat;
  const centerLon = fire.lon;
  
  for (let i = 0; i < 16; i++) {
    const angle = (i / 16) * Math.PI * 2;
    const latOffset = (evacuationRadius / 111320) * Math.cos(angle);
    const lonOffset = (evacuationRadius / (111320 * Math.cos(centerLat * Math.PI / 180))) * Math.sin(angle);
    evacuationPolygon.push([centerLon + lonOffset, centerLat + latOffset]);
  }
  evacuationPolygon.push(evacuationPolygon[0]); // Close polygon
  
  // Only recommend evacuation for high-risk fires
  if (fire.risk_level === 'critical' || fire.risk_level === 'high') {
    evacuationZones.push({
      fire_id: fire.id,
      zone_name: `${fire.name} Evacuation Zone`,
      polygon: evacuationPolygon
    });
  }
  
  return evacuationZones;
}

// Main monitoring loop
async function monitorFires(apiUrl: string) {
  console.log(`[${new Date().toISOString()}] Fetch.ai Agent: Monitoring fires...`);
  
  try {
    // Fetch current fire state
    const response = await fetch(`${apiUrl}/api/fire-state`);
    if (!response.ok) {
      throw new Error(`Failed to fetch fire state: ${response.statusText}`);
    }
    
    const fireData = await response.json();
    const { fires, firestations } = fireData;
    
    console.log(`[Agent] Found ${fires.length} active fires, ${firestations.length} stations`);
    
    // Analyze each fire
    for (const fire of fires) {
      console.log(`[Agent] Analyzing ${fire.name} (${fire.risk_level})`);
      
      // Check routes for all stations
      const riskyRoutes: RouteRisk[] = [];
      for (const station of firestations) {
        const risk = analyzeRouteRisk(fire, station);
        if (risk) {
          riskyRoutes.push(risk);
        }
      }
      
      // If routes are at risk, calculate alternatives
      if (riskyRoutes.length > 0) {
        console.log(`[Agent] ⚠️  ${riskyRoutes.length} stations at risk from ${fire.name}`);
        
        for (const riskyRoute of riskyRoutes) {
          const station = firestations.find((s: Firestation) => s.id === riskyRoute.station_id);
          if (!station) continue;
          
          const newRoute = await calculateAlternativeRoute(station, fire, apiUrl);
          
          // Post route update
          await fetch(`${apiUrl}/api/update-routes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              station_id: riskyRoute.station_id,
              new_route: newRoute,
              reason: riskyRoute.reason,
              risk_score: riskyRoute.risk_score
            })
          });
          
          console.log(`[Agent] ✅ Updated route for ${riskyRoute.station_name}`);
        }
      }
      
      // Generate evacuation recommendations
      const evacuationZones = calculateEvacuationZones(fire);
      if (evacuationZones.length > 0) {
        console.log(`[Agent] 🚨 Recommending evacuation for ${fire.name}`);
        
        for (const zone of evacuationZones) {
          await fetch(`${apiUrl}/api/update-routes`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(zone)
          });
        }
      }
    }
    
    console.log(`[Agent] ✓ Monitoring cycle complete`);
  } catch (error) {
    console.error('[Agent] Error during monitoring:', error);
  }
}

// Export the agent runner
export async function runAgent() {
  const apiUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  console.log('===========================================');
  console.log('🤖 Fetch.ai Autonomous Agent Starting');
  console.log(`📡 API URL: ${apiUrl}`);
  console.log('⏱️  Monitoring interval: 30 seconds');
  console.log('===========================================\n');
  
  // Initial run
  await monitorFires(apiUrl);
  
  // Set up interval
  setInterval(async () => {
    await monitorFires(apiUrl);
  }, 30000); // 30 seconds
  
  // Keep process alive
  console.log('Agent running... Press Ctrl+C to stop\n');
}

// For direct execution
if (require.main === module) {
  runAgent().catch(console.error);
}

