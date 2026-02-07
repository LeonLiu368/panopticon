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
"[project]/projects/tartanhacks/app/api/update-routes/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST,
    "PUT",
    ()=>PUT
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projects/tartanhacks/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projects/tartanhacks/lib/supabase-client.ts [app-route] (ecmascript)");
;
;
async function GET(request) {
    try {
        // Get route updates from last 5 minutes
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
        const { data: routeUpdates, error: routeError } = await __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('route_updates').select('*').gte('created_at', fiveMinutesAgo).order('created_at', {
            ascending: false
        });
        const { data: evacuations, error: evacError } = await __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('evacuation_zones').select('*').gte('recommended_at', fiveMinutesAgo).order('recommended_at', {
            ascending: false
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            routes: routeUpdates || [],
            evacuations: evacuations || [],
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error fetching route updates:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to fetch routes',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const body = await request.json();
        const { station_id, new_route, reason, original_route, risk_score } = body;
        // Validate required fields
        if (!station_id || !new_route) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Missing required fields: station_id and new_route are required'
            }, {
                status: 400
            });
        }
        // Insert route update into Supabase
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('route_updates').insert({
            station_id,
            original_route: original_route || null,
            new_route,
            reason: reason || 'AI-recommended route adjustment',
            risk_score: risk_score || null
        }).select().single();
        if (error) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Failed to save route update',
                details: error.message
            }, {
                status: 500
            });
        }
        // Notify VAPI about the route update
        try {
            await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/vapi-webhook`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'route_update',
                    message: reason || `Route updated for station ${station_id}`,
                    data: {
                        station_id,
                        route: new_route
                    }
                })
            });
        } catch (vapiError) {
            console.warn('Failed to notify VAPI:', vapiError);
        // Don't fail the route update if VAPI notification fails
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            route_update: data,
            message: 'Route update saved successfully'
        });
    } catch (error) {
        console.error('Error creating route update:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, {
            status: 500
        });
    }
}
async function PUT(request) {
    try {
        const body = await request.json();
        const { fire_id, zone_name, polygon } = body;
        if (!fire_id || !polygon) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Missing required fields: fire_id and polygon are required'
            }, {
                status: 400
            });
        }
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('evacuation_zones').insert({
            fire_id,
            zone_name,
            polygon
        }).select().single();
        if (error) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Failed to save evacuation zone',
                details: error.message
            }, {
                status: 500
            });
        }
        // Notify VAPI
        try {
            await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/vapi-webhook`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'evacuation',
                    message: `Evacuation recommended for ${zone_name || 'affected area'}`,
                    data: {
                        fire_id,
                        zone: polygon
                    }
                })
            });
        } catch (vapiError) {
            console.warn('Failed to notify VAPI:', vapiError);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            evacuation_zone: data,
            message: 'Evacuation zone created successfully'
        });
    } catch (error) {
        console.error('Error creating evacuation zone:', error);
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

//# sourceMappingURL=%5Broot-of-the-server%5D__9645fb16._.js.map