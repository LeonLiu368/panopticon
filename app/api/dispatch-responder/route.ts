import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-client';

// Calculate distance between two points using Haversine formula (in kilometers)
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { incidentId, incidentLat, incidentLon } = body;

    console.log('[DISPATCH] Received request:', { incidentId, incidentLat, incidentLon });

    if (!incidentId || !incidentLat || !incidentLon) {
      console.error('[DISPATCH] Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields: incidentId, incidentLat, incidentLon' },
        { status: 400 }
      );
    }

    // Get all firestations
    const { data: firestations, error: firestationsError } = await supabase
      .from('firestations')
      .select('*');

    console.log('[DISPATCH] Fetched firestations:', firestations?.length || 0);

    if (firestationsError || !firestations) {
      console.error('[DISPATCH] Failed to fetch firestations:', firestationsError);
      return NextResponse.json(
        { error: 'Failed to fetch firestations', details: firestationsError?.message },
        { status: 500 }
      );
    }

    // Find nearest firestation with available responders
    let nearestStation = null;
    let minDistance = Infinity;

    for (const station of firestations) {
      const distance = calculateDistance(incidentLat, incidentLon, station.lat, station.lon);
      
      // Check if station has available responders
      const { data: availableResponders } = await supabase
        .from('responders')
        .select('*')
        .eq('firestation_id', station.id)
        .eq('status', 'available')
        .limit(1);

      if (availableResponders && availableResponders.length > 0 && distance < minDistance) {
        nearestStation = station;
        minDistance = distance;
      }
    }

    if (!nearestStation) {
      console.error('[DISPATCH] No available responders found');
      return NextResponse.json(
        { error: 'No available responders found', message: 'All teams are currently dispatched' },
        { status: 404 }
      );
    }

    console.log('[DISPATCH] Nearest station:', nearestStation.name, 'Distance:', minDistance.toFixed(2), 'km');

    // Get an available responder from the nearest station
    const { data: availableResponders } = await supabase
      .from('responders')
      .select('*')
      .eq('firestation_id', nearestStation.id)
      .eq('status', 'available')
      .order('team_number', { ascending: true })
      .limit(1);

    console.log('[DISPATCH] Available responders at nearest station:', availableResponders?.length || 0);

    if (!availableResponders || availableResponders.length === 0) {
      return NextResponse.json(
        { error: 'No available responders at nearest station' },
        { status: 404 }
      );
    }

    const responder = availableResponders[0];

    console.log('[DISPATCH] Dispatching Team', responder.team_number, 'from', nearestStation.name);

    // Update responder status to dispatched
    const { error: updateError } = await supabase
      .from('responders')
      .update({
        status: 'dispatched',
        incident_id: incidentId,
        dispatched_at: new Date().toISOString(),
        current_lat: nearestStation.lat,
        current_lon: nearestStation.lon
      })
      .eq('id', responder.id);

    if (updateError) {
      console.error('[DISPATCH] Failed to update responder:', updateError);
      return NextResponse.json(
        { error: 'Failed to dispatch responder', details: updateError.message },
        { status: 500 }
      );
    }

    console.log('[DISPATCH] ✅ Successfully dispatched Team', responder.team_number);

    // Fetch route from Mapbox Directions API
    const mapboxToken = 'pk.eyJ1Ijoic3BhbnVnYW50aTMxIiwiYSI6ImNtaDVwbzBlYzA1bTkybnB6azQxZnEwOGEifQ.eCNufvFartJqVo8Nwkwkeg';
    const routeUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${nearestStation.lon},${nearestStation.lat};${incidentLon},${incidentLat}?geometries=geojson&access_token=${mapboxToken}`;
    
    const routeResponse = await fetch(routeUrl);
    const routeData = await routeResponse.json();

    if (!routeData.routes || routeData.routes.length === 0) {
      return NextResponse.json(
        { error: 'Failed to calculate route' },
        { status: 500 }
      );
    }

    const route = routeData.routes[0];
    const estimatedDuration = route.duration; // in seconds

    return NextResponse.json({
      success: true,
      responder: {
        id: responder.id,
        firestation_id: responder.firestation_id,
        firestation_name: nearestStation.name,
        team_number: responder.team_number,
        incident_id: incidentId,
        dispatched_at: new Date().toISOString(),
        estimated_arrival: new Date(Date.now() + estimatedDuration * 1000).toISOString(),
        estimated_duration: estimatedDuration
      },
      route: {
        geometry: route.geometry,
        distance: route.distance, // in meters
        duration: route.duration // in seconds
      },
      station: {
        lat: nearestStation.lat,
        lon: nearestStation.lon,
        name: nearestStation.name
      },
      incident: {
        lat: incidentLat,
        lon: incidentLon
      }
    });
  } catch (error) {
    console.error('Dispatch responder error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch responder statistics
export async function GET(request: NextRequest) {
  try {
    const { data: stats, error } = await supabase
      .from('responder_stats')
      .select('*');

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch responder stats', details: error.message },
        { status: 500 }
      );
    }

    // Get all active responders (dispatched or on scene)
    const { data: activeResponders, error: activeError } = await supabase
      .from('responders')
      .select(`
        *,
        incidents (*),
        firestations (name, city, county)
      `)
      .in('status', ['dispatched', 'en_route', 'on_scene']);

    if (activeError) {
      return NextResponse.json(
        { error: 'Failed to fetch active responders', details: activeError.message },
        { status: 500 }
      );
    }

    // Calculate totals
    const totalAvailable = stats?.reduce((sum, s) => sum + (s.available_teams || 0), 0) || 0;
    const totalDispatched = stats?.reduce((sum, s) => sum + (s.dispatched_teams || 0), 0) || 0;
    const totalActive = stats?.reduce((sum, s) => sum + (s.active_teams || 0), 0) || 0;
    const totalTeams = stats?.reduce((sum, s) => sum + (s.total_teams || 0), 0) || 0;

    return NextResponse.json({
      stats: stats || [],
      activeResponders: activeResponders || [],
      totals: {
        available: totalAvailable,
        dispatched: totalDispatched,
        active: totalActive,
        total: totalTeams
      }
    });
  } catch (error) {
    console.error('Get responder stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

