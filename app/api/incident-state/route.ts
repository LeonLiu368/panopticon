import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-client';

export async function GET(request: NextRequest) {
  try {
    // Fetch active police incidents from Supabase
    const { data: incidents, error: incidentsError } = await supabase
      .from('incidents')
      .select('*')
      .eq('status', 'active')
      .order('last_update', { ascending: false });

    if (incidentsError) {
      return NextResponse.json(
        { error: 'Failed to fetch incidents', details: incidentsError.message },
        { status: 500 }
      );
    }

    // Fetch police stations
    const { data: stations, error: stationsError } = await supabase
      .from('police_stations')
      .select('*')
      .order('id');

    if (stationsError) {
      return NextResponse.json(
        { error: 'Failed to fetch police stations', details: stationsError.message },
        { status: 500 }
      );
    }

    // Fetch units to check if any are on scene for each incident
    const { data: allUnits } = await supabase
      .from('units')
      .select('incident_id, status')
      .in('status', ['on_scene']);

    // Create a map of incident_id -> number of units on scene
    const unitsOnSceneMap = new Map<string, number>();
    if (allUnits) {
      allUnits.forEach((u: any) => {
        if (u.incident_id) {
          const count = unitsOnSceneMap.get(String(u.incident_id)) || 0;
          unitsOnSceneMap.set(String(u.incident_id), count + 1);
        }
      });
    }

    // Format incident data with estimated area of concern
    const formattedIncidents = (incidents || []).map((incident: any) => {
      // Estimate incident radius based on priority and time since start
      const startTime = new Date(incident.start_time).getTime();
      const now = Date.now();
      const elapsedMinutes = (now - startTime) / (1000 * 60);
      
      // Radius based on priority level (in meters)
      const baseRadius = {
        'critical': 500, // 500m radius for critical incidents
        'high': 300,
        'medium': 200,
        'low': 100
      };
      
      const radius = baseRadius[incident.priority as keyof typeof baseRadius] || 200;
      
      // Check if units are on scene
      const unitsOnScene = unitsOnSceneMap.get(String(incident.id)) || 0;
      
      // Calculate containment effect
      let estimatedRadius: number;
      
      if (unitsOnScene > 0) {
        // Units are on scene - incident area may be contained
        const shrinkFactor = 1 - (incident.containment / 100) * 0.8; // Shrink up to 80%
        estimatedRadius = radius * shrinkFactor;
      } else {
        // Incident is still active, may expand slightly
        const expansionFactor = Math.min(1 + (elapsedMinutes / 60) * 0.1, 1.5); // Max 50% expansion
        estimatedRadius = radius * expansionFactor;
      }
      
      // Generate simple circular polygon (8 points) for area of concern
      const polygon_coords = [];
      const centerLat = incident.lat || 0;
      const centerLon = incident.lon || 0;
      
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const latOffset = (estimatedRadius / 111320) * Math.cos(angle);
        const lonOffset = (estimatedRadius / (111320 * Math.cos(centerLat * Math.PI / 180))) * Math.sin(angle);
        polygon_coords.push([centerLon + lonOffset, centerLat + latOffset]);
      }
      // Close the polygon
      polygon_coords.push(polygon_coords[0]);

      return {
        id: incident.id,
        name: incident.name,
        lat: incident.lat,
        lon: incident.lon,
        polygon_coords,
        estimated_radius: estimatedRadius,
        priority: incident.priority,
        containment: incident.containment || 0,
        last_update: incident.last_update,
        description: incident.description,
        incident_type: incident.incident_type,
        status: incident.status
      };
    });

    // Format police station data
    const formattedStations = (stations || []).map((station: any) => ({
      id: station.id,
      name: station.name,
      lat: station.lat,
      lon: station.lon,
      city: station.city,
      county: station.county,
      active_route: null // Will be populated when routes are assigned
    }));

    return NextResponse.json({
      incidents: formattedIncidents,
      stations: formattedStations,
      timestamp: new Date().toISOString(),
      count: {
        active_incidents: formattedIncidents.length,
        stations: formattedStations.length
      }
    });
  } catch (error) {
    console.error('Incident state API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
