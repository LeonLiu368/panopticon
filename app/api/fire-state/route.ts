import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-client';

export async function GET(request: NextRequest) {
  try {
    // Fetch active fire incidents from Supabase
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

    // Fetch firestations
    const { data: firestations, error: firestationsError } = await supabase
      .from('firestations')
      .select('*')
      .order('id');

    if (firestationsError) {
      return NextResponse.json(
        { error: 'Failed to fetch firestations', details: firestationsError.message },
        { status: 500 }
      );
    }

    // Fetch responders to check if any are on scene for each fire
    const { data: allResponders } = await supabase
      .from('responders')
      .select('incident_id, status')
      .in('status', ['on_scene']);

    // Create a map of incident_id -> number of responders on scene
    const respondersOnSceneMap = new Map<string, number>();
    if (allResponders) {
      allResponders.forEach((r: any) => {
        if (r.incident_id) {
          const count = respondersOnSceneMap.get(String(r.incident_id)) || 0;
          respondersOnSceneMap.set(String(r.incident_id), count + 1);
        }
      });
    }

    // Format fire data with estimated polygon and growth rate
    const fires = (incidents || []).map((incident: any) => {
      // Estimate fire radius based on time since start (simplified)
      const startTime = new Date(incident.start_time).getTime();
      const now = Date.now();
      const elapsedMinutes = (now - startTime) / (1000 * 60);
      
      // Growth rate based on risk level
      const growthRates = {
        'critical': 50, // meters per minute
        'high': 35,
        'medium': 20,
        'low': 10
      };
      
      const growthRate = growthRates[incident.risk as keyof typeof growthRates] || 20;
      
      // Check if responders are on scene
      const respondersOnScene = respondersOnSceneMap.get(String(incident.id)) || 0;
      
      // Calculate base radius (what it grew to before responders arrived)
      let estimatedRadius: number;
      
      if (respondersOnScene > 0) {
        // Responders are on scene - fire should stop growing and start shrinking
        // Use containment percentage to calculate shrinkage
        const maxRadius = Math.min(elapsedMinutes * growthRate, 5000);
        const shrinkFactor = 1 - (incident.containment / 100) * 0.95; // Shrink up to 95%
        estimatedRadius = maxRadius * shrinkFactor;
      } else {
        // Fire is still growing unchecked
        estimatedRadius = Math.min(elapsedMinutes * growthRate, 5000); // Cap at 5km
      }
      
      // Generate simple circular polygon (8 points)
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
        growth_rate: growthRate,
        risk_level: incident.risk,
        containment: incident.containment || 0,
        last_update: incident.last_update,
        description: incident.description
      };
    });

    // Format firestation data
    const formattedStations = (firestations || []).map((station: any) => ({
      id: station.id,
      name: station.name,
      lat: station.lat,
      lon: station.lon,
      city: station.city,
      county: station.county,
      active_route: null // Will be populated when routes are assigned
    }));

    return NextResponse.json({
      fires,
      firestations: formattedStations,
      timestamp: new Date().toISOString(),
      count: {
        active_fires: fires.length,
        firestations: formattedStations.length
      }
    });
  } catch (error) {
    console.error('Fire state API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

