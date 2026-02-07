module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/projects/tartanhacks/lib/supabase-client.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Lightweight in-memory Supabase mock so the app runs with zero external services.
// Supports the minimal chainable API surface we use in the UI and route handlers.
__turbopack_context__.s([
    "resetMockState",
    ()=>resetMockState,
    "supabase",
    ()=>supabase
]);
// Seed data for local/offline demo
const db = {
    incidents: [
        {
            id: 'robbery-forbes-morewood',
            name: 'Robbery at Forbes & Morewood',
            status: 'active',
            priority: 'high',
            risk: 'high',
            lat: 40.4427,
            lon: -79.9425,
            containment: 15,
            description: 'Reported robbery near CMU campus',
            incident_type: 'robbery',
            start_time: new Date().toISOString(),
            last_update: new Date().toISOString(),
            reported_by: 'Dispatch'
        },
        {
            id: 'traffic-cmu',
            name: 'Multi-vehicle collision on Fifth Ave',
            status: 'active',
            priority: 'medium',
            risk: 'medium',
            lat: 40.4433,
            lon: -79.9490,
            containment: 35,
            description: '3-car collision blocking two lanes',
            incident_type: 'traffic',
            start_time: new Date().toISOString(),
            last_update: new Date().toISOString(),
            reported_by: '911'
        }
    ],
    police_stations: [
        {
            id: 1,
            name: 'Station 1 - Downtown',
            city: 'Pittsburgh',
            county: 'Allegheny',
            lat: 40.4406,
            lon: -79.9959,
            created_at: new Date().toISOString()
        },
        {
            id: 2,
            name: 'Station 2 - North',
            city: 'Pittsburgh',
            county: 'Allegheny',
            lat: 40.4500,
            lon: -79.9500,
            created_at: new Date().toISOString()
        },
        {
            id: 3,
            name: 'Station 3 - South',
            city: 'Pittsburgh',
            county: 'Allegheny',
            lat: 40.4300,
            lon: -79.9800,
            created_at: new Date().toISOString()
        }
    ],
    units: [],
    dispatches: [],
    checkpoints: [],
    unit_stats: []
};
// Create three units per station
db.police_stations.forEach((station)=>{
    Array.from({
        length: 3
    }).forEach((_, idx)=>{
        db.units.push({
            id: `${station.id}-unit-${idx + 1}`,
            station_id: station.id,
            unit_number: `Unit ${station.id}-${idx + 1}`,
            unit_type: idx === 2 ? 'k9' : 'patrol',
            status: 'available',
            current_lat: station.lat,
            current_lon: station.lon,
            incident_id: null,
            dispatched_at: null,
            arrived_at: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        });
    });
});
// Extra pre-positioned patrols around CMU / Oakland for demo visibility
db.units.push({
    id: 'patrol-cmu-1',
    station_id: 1,
    unit_number: 'Patrol CMU-1',
    unit_type: 'patrol',
    status: 'available',
    current_lat: 40.4445,
    current_lon: -79.9432,
    incident_id: null,
    dispatched_at: null,
    arrived_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
}, {
    id: 'traffic-forbes-1',
    station_id: 1,
    unit_number: 'Traffic Forbes',
    unit_type: 'traffic',
    status: 'available',
    current_lat: 40.4429,
    current_lon: -79.9418,
    incident_id: null,
    dispatched_at: null,
    arrived_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
}, {
    id: 'k9-shadyside',
    station_id: 2,
    unit_number: 'K9 Shadyside',
    unit_type: 'k9',
    status: 'available',
    current_lat: 40.4545,
    current_lon: -79.9320,
    incident_id: null,
    dispatched_at: null,
    arrived_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
});
// Helper to compute unit_stats view on the fly
const computeUnitStats = ()=>{
    return db.police_stations.map((ps)=>{
        const units = db.units.filter((u)=>u.station_id === ps.id);
        return {
            station_id: ps.id,
            station_name: ps.name,
            available_units: units.filter((u)=>u.status === 'available').length,
            dispatched_units: units.filter((u)=>[
                    'dispatched',
                    'en_route'
                ].includes(u.status)).length,
            on_scene_units: units.filter((u)=>u.status === 'on_scene').length,
            total_units: units.length
        };
    });
};
// Utility clone
const clone = (v)=>JSON.parse(JSON.stringify(v));
const resetMockState = ()=>{
    db.units = db.units.map((u)=>({
            ...u,
            status: 'available',
            incident_id: null,
            dispatched_at: null,
            arrived_at: null,
            updated_at: new Date().toISOString()
        }));
    db.dispatches = [];
};
// Query builder
function buildSelect(table, rows) {
    let working = [
        ...rows
    ];
    const api = {
        select: (_cols = '*')=>api,
        eq: (col, val)=>{
            working = working.filter((r)=>r[col] === val);
            return api;
        },
        in: (col, vals)=>{
            working = working.filter((r)=>vals.includes(r[col]));
            return api;
        },
        order: (col, opts = {})=>{
            const asc = opts.ascending !== false;
            working = [
                ...working
            ].sort((a, b)=>{
                if (a[col] === b[col]) return 0;
                return (a[col] > b[col] ? 1 : -1) * (asc ? 1 : -1);
            });
            return api;
        },
        limit: (n)=>{
            working = working.slice(0, n);
            return Promise.resolve({
                data: clone(working),
                error: null
            });
        },
        then: (resolve, reject)=>Promise.resolve({
                data: clone(working),
                error: null
            }).then(resolve, reject)
    };
    return api;
}
function buildUpdate(table, values) {
    return {
        eq: (col, val)=>{
            const updated = [];
            db[table] = db[table].map((row)=>{
                if (row[col] === val) {
                    const next = {
                        ...row,
                        ...values,
                        updated_at: new Date().toISOString()
                    };
                    updated.push(next);
                    return next;
                }
                return row;
            });
            return Promise.resolve({
                data: clone(updated),
                error: null
            });
        },
        in: (col, vals)=>{
            const updated = [];
            db[table] = db[table].map((row)=>{
                if (vals.includes(row[col])) {
                    const next = {
                        ...row,
                        ...values,
                        updated_at: new Date().toISOString()
                    };
                    updated.push(next);
                    return next;
                }
                return row;
            });
            return Promise.resolve({
                data: clone(updated),
                error: null
            });
        }
    };
}
function buildInsert(table, payload) {
    const items = Array.isArray(payload) ? payload : [
        payload
    ];
    const withIds = items.map((item)=>({
            ...item,
            id: item.id || crypto.randomUUID?.() || `id-${Math.random().toString(36).slice(2, 8)}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }));
    db[table].push(...withIds);
    return Promise.resolve({
        data: clone(withIds),
        error: null
    });
}
function buildDelete(table) {
    return {
        eq: (col, val)=>{
            const removed = db[table].filter((row)=>row[col] === val);
            db[table] = db[table].filter((row)=>row[col] !== val);
            return Promise.resolve({
                data: clone(removed),
                error: null
            });
        }
    };
}
const mockChannel = ()=>{
    const ch = {
        on: ()=>ch,
        subscribe: ()=>ch,
        unsubscribe: ()=>{}
    };
    return ch;
};
const supabase = {
    from: (table)=>{
        if (table === 'unit_stats') {
            return buildSelect(table, computeUnitStats());
        }
        return {
            select: (_cols = '*')=>buildSelect(table, db[table]),
            update: (values)=>buildUpdate(table, values),
            insert: (payload)=>buildInsert(table, payload),
            delete: ()=>buildDelete(table)
        };
    },
    channel: (_name)=>mockChannel(),
    removeChannel: (_ch)=>{},
    // Expose db for debugging in dev tools
    __data: db,
    // Helper to mutate units in-memory (used by animations)
    __updateUnitPosition: (id, lat, lon, status)=>{
        db.units = db.units.map((u)=>u.id === id ? {
                ...u,
                current_lat: lat,
                current_lon: lon,
                status: status || u.status,
                updated_at: new Date().toISOString()
            } : u);
    }
};
}),
"[project]/projects/tartanhacks/app/api/dispatch-unit/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projects/tartanhacks/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projects/tartanhacks/lib/supabase-client.ts [app-route] (ecmascript)");
;
;
// Calculate distance between two points using Haversine formula (in kilometers)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
async function POST(request) {
    try {
        const body = await request.json();
        const { incidentId, incidentLat, incidentLon } = body;
        console.log('[DISPATCH] Received request:', {
            incidentId,
            incidentLat,
            incidentLon
        });
        if (!incidentId || !incidentLat || !incidentLon) {
            console.error('[DISPATCH] Missing required fields');
            return __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Missing required fields: incidentId, incidentLat, incidentLon'
            }, {
                status: 400
            });
        }
        // Get all police stations
        const { data: stations, error: stationsError } = await __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('police_stations').select('*');
        console.log('[DISPATCH] Fetched police stations:', stations?.length || 0);
        if (stationsError || !stations) {
            console.error('[DISPATCH] Failed to fetch police stations:', stationsError);
            return __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Failed to fetch police stations',
                details: stationsError?.message
            }, {
                status: 500
            });
        }
        // Find nearest station with available units
        let nearestStation = null;
        let minDistance = Infinity;
        for (const station of stations){
            const distance = calculateDistance(incidentLat, incidentLon, station.lat, station.lon);
            // Check if station has available units
            const { data: availableUnits } = await __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('units').select('*').eq('station_id', station.id).eq('status', 'available').limit(1);
            if (availableUnits && availableUnits.length > 0 && distance < minDistance) {
                nearestStation = station;
                minDistance = distance;
            }
        }
        if (!nearestStation) {
            console.error('[DISPATCH] No available units found');
            return __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'No available units found',
                message: 'All units are currently dispatched'
            }, {
                status: 404
            });
        }
        console.log('[DISPATCH] Nearest station:', nearestStation.name, 'Distance:', minDistance.toFixed(2), 'km');
        // Get an available unit from the nearest station
        const { data: availableUnits } = await __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('units').select('*').eq('station_id', nearestStation.id).eq('status', 'available').order('unit_number', {
            ascending: true
        }).limit(1);
        console.log('[DISPATCH] Available units at nearest station:', availableUnits?.length || 0);
        if (!availableUnits || availableUnits.length === 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'No available units at nearest station'
            }, {
                status: 404
            });
        }
        const unit = availableUnits[0];
        console.log('[DISPATCH] Dispatching', unit.unit_number, 'from', nearestStation.name);
        // Update unit status to dispatched
        const { error: updateError } = await __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('units').update({
            status: 'dispatched',
            incident_id: incidentId,
            dispatched_at: new Date().toISOString(),
            current_lat: nearestStation.lat,
            current_lon: nearestStation.lon,
            updated_at: new Date().toISOString()
        }).eq('id', unit.id);
        if (updateError) {
            console.error('[DISPATCH] Failed to update unit:', updateError);
            return __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Failed to dispatch unit',
                details: updateError.message
            }, {
                status: 500
            });
        }
        // Create dispatch record
        const { error: dispatchError } = await __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('dispatches').insert({
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
        // ---- Route + ETA calculation (offline friendly) ----
        // Try Mapbox first; fallback to straight-line estimate if it fails.
        const mapboxToken = ("TURBOPACK compile-time value", "pk.eyJ1IjoidGhlZXphbm9ueW1vdXMiLCJhIjoiY21sYnFzbTNvMHJwdDNlcTNnbHE0MzFkOSJ9.8GIdITSkZv_aYV4arbAFhg") || null;
        let route = null;
        let estimatedDuration = 0;
        const straightLineDistanceKm = calculateDistance(nearestStation.lat, nearestStation.lon, incidentLat, incidentLon);
        const fallbackGeometry = {
            type: 'LineString',
            coordinates: [
                [
                    nearestStation.lon,
                    nearestStation.lat
                ],
                [
                    incidentLon,
                    incidentLat
                ]
            ]
        };
        try {
            if ("TURBOPACK compile-time truthy", 1) {
                const routeUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${nearestStation.lon},${nearestStation.lat};${incidentLon},${incidentLat}?geometries=geojson&access_token=${mapboxToken}`;
                const routeResponse = await fetch(routeUrl);
                const routeData = await routeResponse.json();
                if (routeData.routes && routeData.routes.length > 0) {
                    route = routeData.routes[0];
                    estimatedDuration = route.duration;
                } else {
                    throw new Error('No routes returned');
                }
            } else //TURBOPACK unreachable
            ;
        } catch (err) {
            // Fallback: assume 60 km/h average speed
            const avgSpeedKmH = 60;
            estimatedDuration = straightLineDistanceKm / avgSpeedKmH * 3600;
            route = {
                geometry: fallbackGeometry,
                distance: straightLineDistanceKm * 1000,
                duration: estimatedDuration
            };
        }
        // Update dispatch with route and ETA
        if (!dispatchError) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('dispatches').update({
                eta_seconds: estimatedDuration,
                route_geometry: route.geometry,
                status: 'en_route'
            }).eq('incident_id', incidentId).eq('unit_id', unit.id);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
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
                distance: route.distance,
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
        return __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, {
            status: 500
        });
    }
}
async function GET(request) {
    try {
        const { data: stats, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('unit_stats').select('*');
        if (error) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Failed to fetch unit stats',
                details: error.message
            }, {
                status: 500
            });
        }
        // Get all units (available + active) so UI can display every car
        const { data: activeUnits, error: activeError } = await __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('units').select(`
        *,
        incidents (*),
        police_stations (name, city, county)
      `);
        if (activeError) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Failed to fetch active units',
                details: activeError.message
            }, {
                status: 500
            });
        }
        // Calculate totals
        const totalAvailable = stats?.reduce((sum, s)=>sum + (s.available_units || 0), 0) || 0;
        const totalDispatched = stats?.reduce((sum, s)=>sum + (s.dispatched_units || 0), 0) || 0;
        const totalOnScene = stats?.reduce((sum, s)=>sum + (s.on_scene_units || 0), 0) || 0;
        const totalUnits = stats?.reduce((sum, s)=>sum + (s.total_units || 0), 0) || 0;
        return __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
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
        return __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__cba3b9b5._.js.map