import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-client';

// GET: Retrieve latest route updates
export async function GET(request: NextRequest) {
  try {
    // Get route updates from last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    
    const { data: routeUpdates, error: routeError } = await supabase
      .from('route_updates')
      .select('*')
      .gte('created_at', fiveMinutesAgo)
      .order('created_at', { ascending: false });

    const { data: evacuations, error: evacError } = await supabase
      .from('evacuation_zones')
      .select('*')
      .gte('recommended_at', fiveMinutesAgo)
      .order('recommended_at', { ascending: false });

    return NextResponse.json({
      routes: routeUpdates || [],
      evacuations: evacuations || [],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching route updates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch routes', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST: Create new route update from AI agent
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { station_id, new_route, reason, original_route, risk_score } = body;

    // Validate required fields
    if (!station_id || !new_route) {
      return NextResponse.json(
        { error: 'Missing required fields: station_id and new_route are required' },
        { status: 400 }
      );
    }

    // Insert route update into Supabase
    const { data, error } = await supabase
      .from('route_updates')
      .insert({
        station_id,
        original_route: original_route || null,
        new_route,
        reason: reason || 'AI-recommended route adjustment',
        risk_score: risk_score || null
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to save route update', details: error.message },
        { status: 500 }
      );
    }

    // Notify VAPI about the route update
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/vapi-webhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'route_update',
          message: reason || `Route updated for station ${station_id}`,
          data: { station_id, route: new_route }
        })
      });
    } catch (vapiError) {
      console.warn('Failed to notify VAPI:', vapiError);
      // Don't fail the route update if VAPI notification fails
    }

    return NextResponse.json({
      success: true,
      route_update: data,
      message: 'Route update saved successfully'
    });
  } catch (error) {
    console.error('Error creating route update:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST to /evacuation endpoint: Create evacuation zone recommendation
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { fire_id, zone_name, polygon } = body;

    if (!fire_id || !polygon) {
      return NextResponse.json(
        { error: 'Missing required fields: fire_id and polygon are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('evacuation_zones')
      .insert({
        fire_id,
        zone_name,
        polygon
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to save evacuation zone', details: error.message },
        { status: 500 }
      );
    }

    // Notify VAPI
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/vapi-webhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'evacuation',
          message: `Evacuation recommended for ${zone_name || 'affected area'}`,
          data: { fire_id, zone: polygon }
        })
      });
    } catch (vapiError) {
      console.warn('Failed to notify VAPI:', vapiError);
    }

    return NextResponse.json({
      success: true,
      evacuation_zone: data,
      message: 'Evacuation zone created successfully'
    });
  } catch (error) {
    console.error('Error creating evacuation zone:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

