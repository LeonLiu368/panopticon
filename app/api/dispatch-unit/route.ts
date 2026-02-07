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

    // Get all police stations
    const { data: stations, error: stationsError } = await supabase
      .from('police_stations')
      .select('*');

    console.log('[DISPATCH] Fetched police stations:', stations?.length || 0);

    if (stationsError || !stations) {
      console.error('[DISPATCH] Failed to fetch police stations:', stationsError);
      return NextResponse.json(
        { error: 'Failed to fetch police stations', details: stationsError?.message },
        { status: 500 }
      );
    }

    // Find nearest station with available units
    let nearestStation = null;
    let minDistance = Infinity;

    for (const station of stations) {
      const distance = calculateDistance(incidentLat, incidentLon, station.lat, station.lon);
      
      // Check if station has available units
      const { data: availableUnits } = await supabase
        .from('units')
        .select('*')
        .eq('station_id', station.id)
        .eq('status', 'available')
        .limit(1);

      if (availableUnits && availableUnits.length > 0 && distance < minDistance) {
        nearestStation = station;
        minDistance = distance;
      }
    }

    if (!nearestStation) {
      console.error('[DISPATCH] No available units found');
      return NextResponse.json(
        { error: 'No available units found', message: 'All units are currently dispatched' },
        { status: 404 }
      );
    }

    console.log('[DISPATCH] Nearest station:', nearestStation.name, 'Distance:', minDistance.toFixed(2), 'km');

    // Get an available unit from the nearest station
    const { data: availableUnits } = await supabase
      .from('units')
      .select('*')
      .eq('station_id', nearestStation.id)
      .eq('status', 'available')
      .order('unit_number', { ascending: true })
      .limit(1);

    console.log('[DISPATCH] Available units at nearest station:', availableUnits?.length || 0);

    if (!availableUnits || availableUnits.length === 0) {
      return NextResponse.json(
        { error: 'No available units at nearest station' },
        { status: 404 }
      );
    }

    const unit = availableUnits[0];

    console.log('[DISPATCH] Dispatching', unit.unit_number, 'from', nearestStation.name);

    // Update unit status to dispatched
    const { error: updateError } = await supabase
      .from('units')
      .update({
        status: 'dispatched',
        incident_id: incidentId,
        dispatched_at: new Date().toISOString(),
        current_lat: nearestStation.lat,
        current_lon: nearestStation.lon,
        updated_at: new Date().toISOString()
      })
      .eq('id', unit.id);

    if (updateError) {
      console.error('[DISPATCH] Failed to update unit:', updateError);
      return NextResponse.json(
        { error: 'Failed to dispatch unit', details: updateError.message },
        { status: 500 }
      );
    }

    // Create dispatch record
    const { error: dispatchError } = await supabase
      .from('dispatches')
      .insert({
        incident_id: incidentId,
        unit_id: unit.id,
        status: 'assigned',
        assigned_at: new Date().toISOString()
      });

    if (dispatchError) {
      console.error('[DISPATCH] Failed to create dispatch record:', dispatchError);
    }

    console.log('[DISPATCH] ✅ Successfully dispatched', unit.unit_number);

    // Fetch route from Mapbox Directions API
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1Ijoic3BhbnVnYW50aTMxIiwiYSI6ImNtaDVwbzBlYzA1bTkybnB6azQxZnEwOGEifQ.eCNufvFartJqVo8Nwkwkeg';
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

    // Update dispatch with route and ETA
    if (!dispatchError) {
      await supabase
        .from('dispatches')
        .update({
          eta_seconds: estimatedDuration,
          route_geometry: route.geometry,
          status: 'en_route'
        })
        .eq('incident_id', incidentId)
        .eq('unit_id', unit.id);
    }

    return NextResponse.json({
      success: true,
      unit: {
        id: unit.id,
        station_id: unit.station_id,
        station_name: nearestStation.name,
        unit_number: unit.unit_number,
        unit_type: unit.unit_type,
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
    console.error('Dispatch unit error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch unit statistics
export async function GET(request: NextRequest) {
  try {
    const { data: stats, error } = await supabase
      .from('unit_stats')
      .select('*');

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch unit stats', details: error.message },
        { status: 500 }
      );
    }

    // Get all active units (dispatched or on scene)
    const { data: activeUnits, error: activeError } = await supabase
      .from('units')
      .select(`
        *,
        incidents (*),
        police_stations (name, city, county)
      `)
      .in('status', ['dispatched', 'en_route', 'on_scene']);

    if (activeError) {
      return NextResponse.json(
        { error: 'Failed to fetch active units', details: activeError.message },
        { status: 500 }
      );
    }

    // Calculate totals
    const totalAvailable = stats?.reduce((sum, s) => sum + (s.available_units || 0), 0) || 0;
    const totalDispatched = stats?.reduce((sum, s) => sum + (s.dispatched_units || 0), 0) || 0;
    const totalOnScene = stats?.reduce((sum, s) => sum + (s.on_scene_units || 0), 0) || 0;
    const totalUnits = stats?.reduce((sum, s) => sum + (s.total_units || 0), 0) || 0;

    return NextResponse.json({
      stats: stats || [],
      activeUnits: activeUnits || [],
      totals: {
        available: totalAvailable,
        dispatched: totalDispatched,
        on_scene: totalOnScene,
        total: totalUnits
      }
    });
  } catch (error) {
    console.error('Get unit stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
