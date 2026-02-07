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
"[project]/projects/tartanhacks/app/api/incident-state/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projects/tartanhacks/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projects/tartanhacks/lib/supabase-client.ts [app-route] (ecmascript)");
;
;
async function GET(request) {
    try {
        // Fetch active police incidents from Supabase
        const { data: incidents, error: incidentsError } = await __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('incidents').select('*').eq('status', 'active').order('last_update', {
            ascending: false
        });
        if (incidentsError) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Failed to fetch incidents',
                details: incidentsError.message
            }, {
                status: 500
            });
        }
        // Fetch police stations
        const { data: stations, error: stationsError } = await __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('police_stations').select('*').order('id');
        if (stationsError) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Failed to fetch police stations',
                details: stationsError.message
            }, {
                status: 500
            });
        }
        // Fetch units to check if any are on scene for each incident
        const { data: allUnits } = await __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('units').select('incident_id, status').in('status', [
            'on_scene'
        ]);
        // Create a map of incident_id -> number of units on scene
        const unitsOnSceneMap = new Map();
        if (allUnits) {
            allUnits.forEach((u)=>{
                if (u.incident_id) {
                    const count = unitsOnSceneMap.get(String(u.incident_id)) || 0;
                    unitsOnSceneMap.set(String(u.incident_id), count + 1);
                }
            });
        }
        // Format incident data with estimated area of concern
        const formattedIncidents = (incidents || []).map((incident)=>{
            // Estimate incident radius based on priority and time since start
            const startTime = new Date(incident.start_time).getTime();
            const now = Date.now();
            const elapsedMinutes = (now - startTime) / (1000 * 60);
            // Radius based on priority level (in meters)
            const baseRadius = {
                'critical': 500,
                'high': 300,
                'medium': 200,
                'low': 100
            };
            const radius = baseRadius[incident.priority] || 200;
            // Check if units are on scene
            const unitsOnScene = unitsOnSceneMap.get(String(incident.id)) || 0;
            // Calculate containment effect
            let estimatedRadius;
            if (unitsOnScene > 0) {
                // Units are on scene - incident area may be contained
                const shrinkFactor = 1 - incident.containment / 100 * 0.8; // Shrink up to 80%
                estimatedRadius = radius * shrinkFactor;
            } else {
                // Incident is still active, may expand slightly
                const expansionFactor = Math.min(1 + elapsedMinutes / 60 * 0.1, 1.5); // Max 50% expansion
                estimatedRadius = radius * expansionFactor;
            }
            // Generate simple circular polygon (8 points) for area of concern
            const polygon_coords = [];
            const centerLat = incident.lat || 0;
            const centerLon = incident.lon || 0;
            for(let i = 0; i < 8; i++){
                const angle = i / 8 * Math.PI * 2;
                const latOffset = estimatedRadius / 111320 * Math.cos(angle);
                const lonOffset = estimatedRadius / (111320 * Math.cos(centerLat * Math.PI / 180)) * Math.sin(angle);
                polygon_coords.push([
                    centerLon + lonOffset,
                    centerLat + latOffset
                ]);
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
        const formattedStations = (stations || []).map((station)=>({
                id: station.id,
                name: station.name,
                lat: station.lat,
                lon: station.lon,
                city: station.city,
                county: station.county,
                active_route: null // Will be populated when routes are assigned
            }));
        return __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
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

//# sourceMappingURL=%5Broot-of-the-server%5D__3fbacf47._.js.map