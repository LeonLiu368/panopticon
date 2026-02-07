module.exports = [
"[project]/projects/tartanhacks/lib/utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projects/tartanhacks/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projects/tartanhacks/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-ssr] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
}),
"[project]/projects/tartanhacks/components/ui/badge.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Badge",
    ()=>Badge,
    "badgeVariants",
    ()=>badgeVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projects/tartanhacks/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projects/tartanhacks/node_modules/@radix-ui/react-slot/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projects/tartanhacks/node_modules/class-variance-authority/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projects/tartanhacks/lib/utils.ts [app-ssr] (ecmascript)");
;
;
;
;
const badgeVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cva"])('inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden', {
    variants: {
        variant: {
            default: 'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
            secondary: 'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
            destructive: 'border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
            outline: 'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground'
        }
    },
    defaultVariants: {
        variant: 'default'
    }
});
function Badge({ className, variant, asChild = false, ...props }) {
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Slot"] : 'span';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        "data-slot": "badge",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(badgeVariants({
            variant
        }), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/projects/tartanhacks/components/ui/badge.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, this);
}
;
}),
"[project]/projects/tartanhacks/components/ui/button.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projects/tartanhacks/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projects/tartanhacks/node_modules/@radix-ui/react-slot/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projects/tartanhacks/node_modules/class-variance-authority/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projects/tartanhacks/lib/utils.ts [app-ssr] (ecmascript)");
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", {
    variants: {
        variant: {
            default: 'bg-primary text-primary-foreground hover:bg-primary/90',
            destructive: 'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
            outline: 'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
            secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
            ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
            link: 'text-primary underline-offset-4 hover:underline'
        },
        size: {
            default: 'h-9 px-4 py-2 has-[>svg]:px-3',
            sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
            lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
            icon: 'size-9',
            'icon-sm': 'size-8',
            'icon-lg': 'size-10'
        }
    },
    defaultVariants: {
        variant: 'default',
        size: 'default'
    }
});
function Button({ className, variant, size, asChild = false, ...props }) {
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Slot"] : 'button';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        "data-slot": "button",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ...props
    }, void 0, false, {
        fileName: "[project]/projects/tartanhacks/components/ui/button.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
}
;
}),
"[project]/projects/tartanhacks/lib/supabase-client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/projects/tartanhacks/lib/video-mapping.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Video mapping for fire incidents
__turbopack_context__.s([
    "FIRE_VIDEOS",
    ()=>FIRE_VIDEOS,
    "getFireVideo",
    ()=>getFireVideo,
    "isVideoAvailable",
    ()=>isVideoAvailable
]);
const FIRE_VIDEOS = {
    'Pine Ridge Fire': {
        name: 'Pine Ridge Fire',
        videoUrl: '/videos/pine-ridge-fire.mp4',
        thumbnailUrl: '/videos/pine-ridge-fire-thumb.jpg',
        description: 'Live footage from Pine Ridge Fire operations'
    },
    'Redwood Valley Fire': {
        name: 'Redwood Valley Fire',
        videoUrl: '/videos/redwood-valley-fire.mp4',
        thumbnailUrl: '/videos/redwood-valley-fire-thumb.jpg',
        description: 'Live footage from Redwood Valley Fire operations'
    }
};
function getFireVideo(fireName) {
    console.log('[getFireVideo] Looking for video for fire:', fireName);
    console.log('[getFireVideo] Available fires:', Object.keys(FIRE_VIDEOS));
    if (!fireName) {
        console.log('[getFireVideo] No fire name provided');
        return null;
    }
    // Try exact match first
    if (FIRE_VIDEOS[fireName]) {
        console.log('[getFireVideo] Found exact match:', FIRE_VIDEOS[fireName]);
        return FIRE_VIDEOS[fireName];
    }
    // Try partial match for variations in naming
    const normalizedName = fireName.toLowerCase().trim();
    console.log('[getFireVideo] Trying partial match with normalized name:', normalizedName);
    for (const [key, video] of Object.entries(FIRE_VIDEOS)){
        if (key.toLowerCase().includes(normalizedName) || normalizedName.includes(key.toLowerCase())) {
            console.log('[getFireVideo] Found partial match:', key, video);
            return video;
        }
    }
    console.log('[getFireVideo] No match found for:', fireName);
    return null;
}
function isVideoAvailable(fireName) {
    const video = getFireVideo(fireName);
    return video?.videoUrl ? true : false;
}
}),
"[project]/projects/tartanhacks/components/california-map.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CaliforniaMap
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projects/tartanhacks/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projects/tartanhacks/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$mapbox$2d$gl$2f$dist$2f$mapbox$2d$gl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projects/tartanhacks/node_modules/mapbox-gl/dist/mapbox-gl.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projects/tartanhacks/lib/supabase-client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$video$2d$mapping$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projects/tartanhacks/lib/video-mapping.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
// California coordinates and bounds
// Default bounds; will recenter to user location when available
const CALIFORNIA_BOUNDS = {
    north: 42.0,
    south: 32.5,
    east: -114.0,
    west: -124.5
};
const getMarkerColor = (intensity)=>{
    switch(intensity){
        case 'critical':
            return '#FF6B00'; // Fire orange
        case 'high':
            return '#FF4444'; // Bright red
        case 'medium':
            return '#FF8C00'; // Dark orange
        case 'low':
            return '#00C2FF'; // Cyan
        default:
            return '#6b7280'; // gray
    }
};
const getMarkerSize = (intensity)=>{
    switch(intensity){
        case 'critical':
            return 24;
        case 'high':
            return 20;
        case 'medium':
            return 16;
        case 'low':
            return 12;
        default:
            return 14;
    }
};
const getPulseSize = (intensity)=>{
    switch(intensity){
        case 'critical':
            return 60;
        case 'high':
            return 50;
        case 'medium':
            return 40;
        case 'low':
            return 30;
        default:
            return 35;
    }
};
const METERS_PER_DEGREE_LAT = 111320;
// Convert Supabase incident to WildfireIncident format
const convertSupabaseIncident = (incident)=>{
    return {
        id: incident.id,
        name: incident.name || 'Unnamed Fire',
        status: incident.status || 'active',
        intensity: incident.risk || 'low',
        coordinates: [
            incident.lon || 0,
            incident.lat || 0
        ],
        containment: incident.containment || 0,
        description: incident.description || undefined,
        last_update: incident.last_update
    };
};
// Create popup content HTML
const createPopupContent = (incident)=>{
    const videoInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$video$2d$mapping$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getFireVideo"])(incident.name);
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
const createPoliceStationPopupContent = (station)=>{
    return createFirestationPopupContent(station);
};
// Keep old function for backward compatibility
const createFirestationPopupContent = (firestation)=>{
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
const createFirestationMarker = ()=>{
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
      <span style="font-size: 14px; line-height: 1;">🚓</span>
    </div>
  `;
    return markerEl;
};
// Create animated firetruck marker
const getResponderColor = (status)=>{
    switch(status){
        case 'available':
            return '#2563eb'; // blue
        case 'on_scene':
            return '#22c55e'; // green
        case 'dispatched':
        case 'en_route':
            return '#facc15'; // yellow
        default:
            return '#9ca3af';
    }
};
const createFiretruckMarker = (teamNumber, status, unit)=>{
    const markerEl = document.createElement('div');
    markerEl.className = 'relative';
    markerEl.style.width = '32px';
    markerEl.style.height = '32px';
    markerEl.style.zIndex = '200'; // Very high z-index so trucks appear on top
    const bodyColor = getResponderColor(status);
    const glow = bodyColor + 'cc';
    markerEl.innerHTML = `
    <div style="
      width: 32px;
      height: 32px;
      background: ${bodyColor};
      border: 3px solid rgba(255,255,255,0.85);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 20px ${glow}, 0 4px 8px rgba(0, 0, 0, 0.4);
      animation: pulse-truck 1.5s ease-in-out infinite;
      position: relative;
    ">
      <span style="font-size: 18px; line-height: 1; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.5));">🚓</span>
    </div>
    <div style="
      margin-top: 4px;
      padding: 3px 6px;
      background: rgba(0,0,0,0.75);
      color: white;
      font-size: 11px;
      font-weight: 700;
      border-radius: 6px;
      border: 1px solid rgba(255,255,255,0.15);
      display: inline-block;
      position: absolute;
      top: 32px;
      left: 50%;
      transform: translateX(-50%);
      white-space: nowrap;
      pointer-events: none;
    ">
      ${unit?.unit_number || 'Unit'}
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
const getPointAlongLine = (coordinates, progress)=>{
    // Validate input
    if (!coordinates || coordinates.length === 0) {
        console.error('[getPointAlongLine] Empty coordinates array');
        return [
            0,
            0
        ];
    }
    if (coordinates.length === 1) {
        return coordinates[0];
    }
    if (progress <= 0) return coordinates[0];
    if (progress >= 1) return coordinates[coordinates.length - 1];
    // Calculate total line length
    let totalLength = 0;
    const segmentLengths = [];
    for(let i = 0; i < coordinates.length - 1; i++){
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
            console.error(`[getPointAlongLine] NaN in coordinates at index ${i}:`, [
                lon1,
                lat1
            ], [
                lon2,
                lat2
            ]);
            return coordinates[0];
        }
        const segmentLength = Math.sqrt(Math.pow(lon2 - lon1, 2) + Math.pow(lat2 - lat1, 2));
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
    for(let i = 0; i < segmentLengths.length; i++){
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
                    lon1,
                    lat1,
                    lon2,
                    lat2,
                    segmentProgress
                });
                return coordinates[i];
            }
            return [
                resultLon,
                resultLat
            ];
        }
        currentLength += segmentLengths[i];
    }
    return coordinates[coordinates.length - 1];
};
const clamp = (value, min, max)=>Math.min(Math.max(value, min), max);
// Calculate distance between two points using Haversine formula (in kilometers)
const calculateDistance = (lat1, lon1, lat2, lon2)=>{
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};
// Find nearest fire station to a given location
const findNearestFirestation = (lat, lon, firestations)=>{
    if (firestations.length === 0) return null;
    let nearest = firestations[0];
    let minDistance = calculateDistance(lat, lon, nearest.lat, nearest.lon);
    for(let i = 1; i < firestations.length; i++){
        const distance = calculateDistance(lat, lon, firestations[i].lat, firestations[i].lon);
        if (distance < minDistance) {
            minDistance = distance;
            nearest = firestations[i];
        }
    }
    return nearest;
};
const getIntensityMultiplier = (intensity)=>{
    switch(intensity){
        case 'critical':
            return 1.25;
        case 'high':
            return 1.1;
        case 'medium':
            return 0.9;
        case 'low':
        default:
            return 0.75;
    }
};
const getBaseRadiusMeters = (incident)=>{
    const acres = incident.acres ?? 500;
    const intensityMultiplier = getIntensityMultiplier(incident.intensity);
    const base = 150 + Math.sqrt(acres) * 2.5;
    return base * intensityMultiplier;
};
const getExpansionRate = (incident)=>{
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
 */ const generateWindInfluencedGrowthVectors = (numVectors, windSpeed, windDirection)=>{
    const growthVectors = [];
    // Convert wind direction to radians
    // Fire spreads OPPOSITE to wind direction (add 180°)
    const fireSpreadDirection = (windDirection + 180) % 360 * (Math.PI / 180);
    // Wind influence factor (0-1): stronger winds = more directional spread
    // 0 mph = no influence, 20+ mph = maximum influence
    const windInfluence = Math.min(windSpeed / 20, 1);
    for(let i = 0; i < numVectors; i++){
        const angle = i / numVectors * Math.PI * 2;
        // Calculate how aligned this angle is with fire spread direction
        // cos gives 1 when aligned, -1 when opposite
        const alignment = Math.cos(angle - fireSpreadDirection);
        // Convert alignment to growth multiplier
        // Downwind direction (aligned): higher growth
        // Upwind direction (opposite): lower growth
        // Perpendicular: neutral growth
        const windEffect = 0.5 + alignment * windInfluence * 0.7;
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
 */ // Simple noise function for organic fire spread
const noise = (x, y, seed)=>{
    const n = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453;
    return n - Math.floor(n);
};
// Multi-octave noise for more organic patterns
const multiNoise = (x, y, seed, octaves = 3)=>{
    let value = 0;
    let amplitude = 1;
    let frequency = 1;
    let maxValue = 0;
    for(let i = 0; i < octaves; i++){
        value += noise(x * frequency, y * frequency, seed + i) * amplitude;
        maxValue += amplitude;
        amplitude *= 0.5;
        frequency *= 2;
    }
    return value / maxValue;
};
const generateFirePolygonCoordinates = (center, radiusMeters, options = {})=>{
    const { roughness = 0.4, points = 64, time = 0, seed = 0, growthVectors = [], elapsedTime = 0 } = options;
    const coords = [];
    const latRadians = center[1] * Math.PI / 180;
    const cosLat = Math.cos(latRadians);
    // Calculate emergence factor (fire starts small and grows)
    // Goes from 0 to 1 over first 8 seconds for slow visible emergence, then stays at 1
    const emergenceFactor = Math.min(elapsedTime / 8, 1);
    for(let i = 0; i < points; i++){
        const angle = i / points * Math.PI * 2;
        // Get growth vector for this angle (or generate a random one)
        const vectorIndex = Math.floor(i / points * growthVectors.length);
        const growthVector = growthVectors[vectorIndex] || 1.0;
        // Use static noise (not time-dependent) for stable organic edges
        // Only use angle for variation, not time
        const noiseValue = multiNoise(Math.cos(angle) * 2, Math.sin(angle) * 2, seed, 3 // 3 octaves for smoother shapes
        );
        // Very subtle, slow edge movement (not flicker)
        const subtleMovement = 1 + Math.sin(angle * 5 + time * 0.5 + seed) * 0.02;
        // Combine all factors for realistic but stable fire spread
        // - Base radius grows with time
        // - Growth vectors create asymmetric spread (wind, terrain)
        // - Noise creates organic, irregular edges (STABLE)
        // - Subtle movement adds very slow dynamic changes
        // - Emergence factor makes it start from center
        const irregularity = 0.8 + noiseValue * roughness * 0.8;
        const effectiveRadius = radiusMeters * emergenceFactor * // Emerge from center
        growthVector * // Directional growth
        irregularity * // Organic variation (stable)
        subtleMovement; // Very subtle slow movement
        const dx = Math.cos(angle) * effectiveRadius;
        const dy = Math.sin(angle) * effectiveRadius;
        const lngOffset = dx / (METERS_PER_DEGREE_LAT * cosLat);
        const latOffset = dy / METERS_PER_DEGREE_LAT;
        coords.push([
            center[0] + lngOffset,
            center[1] + latOffset
        ]);
    }
    if (coords.length) {
        coords.push(coords[0]);
    }
    return coords;
};
const createFireFeature = (incident, radiusMeters, options = {})=>{
    const { time = 0, roughness = 0.4, seed = 0, intensity = 0.6, points = 64, growthVectors = [], elapsedTime = 0 } = options;
    return {
        type: 'Feature',
        properties: {
            id: typeof incident.id === 'number' ? incident.id : parseInt(String(incident.id), 10),
            intensity,
            name: incident.name
        },
        geometry: {
            type: 'Polygon',
            coordinates: [
                generateFirePolygonCoordinates(incident.coordinates, radiusMeters, {
                    roughness,
                    time,
                    seed,
                    points,
                    growthVectors,
                    elapsedTime
                })
            ]
        }
    };
};
function CaliforniaMap({ className = '', onMapReady, onMapMove, windSpeed = 10, windDirection = 270, onIncidentSelect, onUnitUpdate, refreshUnitTrigger, selectedIncidentId, onResponderUpdate, refreshResponderTrigger }) {
    // Support both new and old prop names
    const unitUpdateCallback = onUnitUpdate || onResponderUpdate;
    const refreshTrigger = refreshUnitTrigger || refreshResponderTrigger;
    const mapContainerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const mapRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const markersRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])([]);
    const popupRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const fireStateRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({});
    const fireAnimationRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const fireStartTimeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // State for Supabase incidents
    const [incidents, setIncidents] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [firestations, setFirestations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [aiRecommendedRoutes, setAiRecommendedRoutes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [evacuationZones, setEvacuationZones] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedFireId, setSelectedFireId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [responders, setResponders] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const latestRespondersRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])([]); // Tracks latest responders state for fire animation
    const responderAnimationRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const activeIncidents = incidents.filter((incident)=>incident.status === 'active');
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
    const displayRouteToFire = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (fireLat, fireLon, stationLat, stationLon)=>{
        if (!mapRef.current) return;
        try {
            // Fetch route from Mapbox Directions API
            const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${stationLon},${stationLat};${fireLon},${fireLat}?geometries=geojson&access_token=${__TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$mapbox$2d$gl$2f$dist$2f$mapbox$2d$gl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].accessToken}`;
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
                        'line-color': '#3b82f6',
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
                        'line-color': '#60a5fa',
                        'line-width': 3,
                        'line-opacity': 0.6,
                        'line-dasharray': [
                            0,
                            2,
                            2
                        ]
                    }
                });
            }
        } catch (error) {
            console.error('Error fetching route:', error);
        }
    }, []);
    // Define navigation function for incident selection
    const navigateToIncident = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((incident)=>{
        if (!mapRef.current) return;
        const lat = incident.lat;
        const lon = incident.lon;
        if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
            console.warn('Invalid incident coordinates:', {
                lat,
                lon,
                incident
            });
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
        const wildfireIncident = {
            id: typeof incident.id === 'string' ? parseInt(incident.id) : incident.id,
            name: incident.name || 'Unnamed Fire',
            status: 'active',
            intensity: incident.risk || 'low',
            coordinates: [
                lon,
                lat
            ],
            containment: incident.containment || undefined,
            description: incident.description || undefined
        };
        // Create the popup immediately so sidebar clicks show content without delay
        try {
            const popupContent = createPopupContent(wildfireIncident);
            const isPalace = (wildfireIncident.name || '').toLowerCase().includes('palace of fine arts');
            const sidebarOffset = isPalace ? 56 : 28; // push lower to avoid header overlap for Palace
            popupRef.current = new __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$mapbox$2d$gl$2f$dist$2f$mapbox$2d$gl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].Popup({
                closeButton: true,
                closeOnClick: true,
                maxWidth: '380px',
                offset: sidebarOffset,
                anchor: 'bottom'
            }).setLngLat([
                lon,
                lat
            ]).setHTML(popupContent).addTo(mapRef.current);
            // Wire up fullscreen behavior
            try {
                const popupNode = popupRef.current?.getElement();
                if (popupNode) {
                    const content = popupNode.querySelector('.mapboxgl-popup-content');
                    const videoEl = content?.querySelector('video[data-video-element="true"]');
                    // Toggle play/pause when clicking anywhere inside popup when video exists
                    if (videoEl && content) {
                        content.onclick = (e)=>{
                            const target = e.target;
                            // Ignore clicks on the fullscreen button itself
                            if (target.closest('button[data-fullscreen-toggle="true"]')) return;
                            if (videoEl.paused) videoEl.play();
                            else videoEl.pause();
                        };
                    }
                // Remove fullscreen behavior entirely
                }
            } catch  {}
        } catch (error) {
            console.error('Error creating popup:', error);
        }
        // Then fly to the incident location (popup will reposition automatically)
        mapRef.current.flyTo({
            center: [
                lon,
                lat
            ],
            zoom: 17,
            pitch: 60,
            bearing: mapRef.current.getBearing(),
            duration: 3500,
            padding: {
                top: 260,
                bottom: 40,
                left: 40,
                right: 40
            },
            essential: true
        });
    }, [
        onIncidentSelect,
        firestations,
        displayRouteToFire
    ]);
    // Fetch incidents and firestations from Supabase
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const fetchData = async ()=>{
            try {
                // Fetch incidents
                const { data: incidentsData, error: incidentsError } = await __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('incidents').select('*').order('last_update', {
                    ascending: false
                });
                if (incidentsError) {
                    setError(incidentsError.message);
                    return;
                }
                // Fetch police stations (try police_stations first, fallback to firestations for backward compatibility)
                const { data: policeStationsData, error: policeStationsError } = await __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('police_stations').select('*').order('id');
                // Fallback to firestations if police_stations doesn't exist
                let firestationsData = policeStationsData;
                let firestationsError = policeStationsError;
                if (policeStationsError && policeStationsError.code === 'PGRST116') {
                    const { data: fallbackData, error: fallbackError } = await __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('firestations').select('*').order('id');
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
        const channel = __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].channel('incidents-rt').on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'incidents'
        }, (payload)=>{
            const newIncident = payload.new;
            const convertedIncident = convertSupabaseIncident(newIncident);
            setIncidents((prev)=>{
                const without = prev.filter((i)=>i.id !== convertedIncident.id);
                return [
                    convertedIncident,
                    ...without
                ];
            });
        }).subscribe();
        return ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].removeChannel(channel);
        };
    }, []);
    // Poll for AI-recommended routes and evacuations
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const pollRoutes = async ()=>{
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
        return ()=>clearInterval(interval);
    }, []);
    // Poll for active units and update their positions
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const pollUnits = async ()=>{
            try {
                const response = await fetch('/api/dispatch-unit');
                if (!response.ok) return;
                const data = await response.json();
                // Update unit stats - pass active units so parent can filter by incident
                if (unitUpdateCallback && data.totals) {
                    unitUpdateCallback({
                        available: data.totals.available || 0,
                        dispatched: data.totals.dispatched || 0,
                        active: data.totals.on_scene || data.totals.active || 0
                    }, data.activeUnits || data.activeResponders || []);
                }
                // Update active units state (support both activeUnits and activeResponders for backward compatibility)
                const activeUnitsData = data.activeUnits || data.activeResponders || [];
                if (activeUnitsData.length > 0) {
                    const newUnits = activeUnitsData.map((dbUnit)=>({
                            id: dbUnit.id,
                            station_id: dbUnit.station_id || dbUnit.firestation_id,
                            firestation_id: dbUnit.firestation_id || dbUnit.station_id,
                            incident_id: dbUnit.incident_id,
                            unit_number: dbUnit.unit_number,
                            team_number: dbUnit.team_number || parseInt(dbUnit.unit_number?.match(/\d+/)?.[0] || '1'),
                            status: dbUnit.status,
                            current_lat: dbUnit.current_lat,
                            current_lon: dbUnit.current_lon,
                            dispatched_at: dbUnit.dispatched_at,
                            progress: 0
                        }));
                    setResponders(newUnits);
                    latestRespondersRef.current = newUnits;
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
        return ()=>clearInterval(interval);
    }, [
        refreshTrigger,
        unitUpdateCallback
    ]);
    // Animate responders moving along routes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!mapRef.current) return;
        const map = mapRef.current;
        if (responders.length === 0) {
            console.log('[Responder Animation] No responders to animate');
            return;
        }
        console.log('[Responder Animation] Starting animation for', responders.length, 'responders');
        let animationFrameId;
        const respondersRef = responders.map((r)=>({
                ...r
            })); // Copy to avoid state mutation
        const animateResponders = async ()=>{
            for (const responder of respondersRef){
                // Check if this responder's incident is selected
                const isIncidentSelected = selectedIncidentId && String(responder.incident_id) === String(selectedIncidentId);
                // If responder doesn't have a marker yet, create one
                if (!responder.marker) {
                    console.log(`[Marker] Creating marker for Team ${responder.team_number} at [${responder.current_lon}, ${responder.current_lat}]`);
                    const markerEl = createFiretruckMarker(responder.team_number, responder.status, responder);
                    const marker = new __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$mapbox$2d$gl$2f$dist$2f$mapbox$2d$gl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].Marker({
                        element: markerEl,
                        anchor: 'center'
                    }).setLngLat([
                        responder.current_lon,
                        responder.current_lat
                    ]).addTo(map);
                    // Click to focus on unit
                    markerEl.addEventListener('click', ()=>{
                        map.flyTo({
                            center: [
                                responder.current_lon,
                                responder.current_lat
                            ],
                            zoom: 14,
                            duration: 800
                        });
                        const popup = new __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$mapbox$2d$gl$2f$dist$2f$mapbox$2d$gl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].Popup({
                            offset: 12
                        }).setLngLat([
                            responder.current_lon,
                            responder.current_lat
                        ]).setHTML(`<div style="font-size:12px;font-weight:700;">${responder.unit_number || 'Unit'}<br/><span style='font-weight:500;'>Status: ${responder.status}</span></div>`);
                        popup.addTo(map);
                    });
                    // Hide by default (only show when incident is selected)
                    markerEl.style.display = isIncidentSelected ? 'block' : 'none';
                    responder.marker = marker;
                } else {
                    // Always visible; clicking shows popup, selection still allowed
                    const markerEl = responder.marker.getElement();
                    if (markerEl && isIncidentSelected) {
                        markerEl.style.display = 'block';
                    } else if (markerEl) {
                        markerEl.style.display = 'block';
                    }
                }
                // If responder doesn't have a route yet and is dispatched, fetch it
                if (!responder.route && (responder.status === 'dispatched' || responder.status === 'en_route')) {
                    const incident = incidents.find((i)=>String(i.id) === String(responder.incident_id));
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
                                for(let i = 0; i < Math.min(3, coords.length); i++){
                                    const coord = coords[i];
                                    if (!coord || !Array.isArray(coord) || coord.length < 2 || isNaN(coord[0]) || isNaN(coord[1])) {
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
                                                    'line-color': '#3b82f6',
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
                                    const updateTable = async ()=>{
                                        try {
                                            await __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('units').update({
                                                status: 'en_route'
                                            }).eq('id', responder.id);
                                        } catch  {
                                            await __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('responders').update({
                                                status: 'en_route'
                                            }).eq('id', responder.id);
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
                    // Move continuously at a slower pace (complete route in ~40 seconds)
                    responder.progress = Math.min(responder.progress + 1 / (40 * 60), 1); // 60fps, 40 seconds total
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
                    // Update marker position and mock DB for 2D view
                    if (responder.marker) {
                        responder.marker.setLngLat(currentPos);
                        try {
                            __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].__updateUnitPosition?.(responder.id, currentPos[1], currentPos[0], responder.status);
                        } catch  {}
                        // Log less frequently - only every 10%
                        if (Math.abs(responder.progress * 100 % 10) < 2) {
                            console.log(`[Animation] Team ${responder.team_number} at ${Math.round(responder.progress * 100)}% progress`);
                        }
                    }
                    // CHECK FOR FIRE COLLISION WHILE MOVING
                    const incident = incidents.find((i)=>String(i.id) === String(responder.incident_id));
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
                            const othersOnScene = latestRespondersRef.current.filter((r)=>String(r.incident_id) === String(incident.id) && r.status === 'on_scene' && r.id !== responder.id).length;
                            let currentRadiusMultiplier = 1.0;
                            if (othersOnScene > 0 && fireState.containmentStartTime) {
                                // Fire is already being contained
                                const containmentSeconds = (now - fireState.containmentStartTime) / 1000;
                                const shrinkProgress = Math.min(containmentSeconds / (20 / othersOnScene), 1);
                                currentRadiusMultiplier = 1 - shrinkProgress * 0.95;
                            } else {
                                // Fire is still growing
                                const growthProgress = Math.min(elapsedSeconds / 240, 1);
                                const easedGrowth = 1 - Math.pow(1 - growthProgress, 1.8);
                                const pulse = Math.sin(elapsedSeconds * fireState.waveSpeed + fireState.seed) * 0.01;
                                currentRadiusMultiplier = 0.02 + easedGrowth * 0.98 + pulse;
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
                                const updateOnScene = async ()=>{
                                    try {
                                        await __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('units').update({
                                            status: 'on_scene',
                                            arrived_at: new Date().toISOString(),
                                            current_lat: truckLat,
                                            current_lon: truckLon
                                        }).eq('id', responder.id);
                                    } catch  {
                                        await __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('responders').update({
                                            status: 'on_scene',
                                            arrived_at: new Date().toISOString(),
                                            current_lat: truckLat,
                                            current_lon: truckLon
                                        }).eq('id', responder.id);
                                    }
                                };
                                await updateOnScene();
                                // CRITICAL: Update React state AND ref immediately
                                setResponders((prev)=>{
                                    const updated = prev.map((r)=>r.id === responder.id ? {
                                            ...r,
                                            status: 'on_scene'
                                        } : r);
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
                                continue;
                            }
                        }
                    }
                    // Update current position in database every 5 seconds
                    if (Math.random() < 0.012) {
                        // Try units table first, fallback to responders for backward compatibility
                        const updatePosition = async ()=>{
                            try {
                                await __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('units').update({
                                    current_lat: currentPos[1],
                                    current_lon: currentPos[0]
                                }).eq('id', responder.id);
                            } catch  {
                                await __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('responders').update({
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
                        const updateToEnRoute = async ()=>{
                            try {
                                await __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('units').update({
                                    status: 'en_route'
                                }).eq('id', responder.id);
                            } catch  {
                                await __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('responders').update({
                                    status: 'en_route'
                                }).eq('id', responder.id);
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
                        const incident = incidents.find((i)=>String(i.id) === String(responder.incident_id));
                        if (incident) {
                            const [fireLon, fireLat] = incident.coordinates;
                            const [truckLon, truckLat] = responder.marker?.getLngLat ? [
                                responder.marker.getLngLat().lng,
                                responder.marker.getLngLat().lat
                            ] : [
                                fireLon,
                                fireLat
                            ];
                            // Get fire state to calculate ACTUAL current fire radius
                            const incidentKey = typeof incident.id === 'number' ? incident.id : parseInt(String(incident.id), 10);
                            const fireState = fireStateRef.current[incidentKey];
                            if (fireState) {
                                // Calculate the current radius multiplier (same logic as in animateFire)
                                const now = Date.now();
                                const elapsedSeconds = (now - (fireState.startTime || now)) / 1000;
                                // Check if other responders are already on scene (use ref for latest value)
                                const othersOnScene = latestRespondersRef.current.filter((r)=>String(r.incident_id) === String(incident.id) && r.status === 'on_scene' && r.id !== responder.id).length;
                                let currentRadiusMultiplier = 1.0;
                                if (othersOnScene > 0 && fireState.containmentStartTime) {
                                    // Fire is already being contained
                                    const containmentSeconds = (now - fireState.containmentStartTime) / 1000;
                                    const shrinkProgress = Math.min(containmentSeconds / (20 / othersOnScene), 1);
                                    currentRadiusMultiplier = 1 - shrinkProgress * 0.95;
                                } else {
                                    // Fire is still growing
                                    const growthProgress = Math.min(elapsedSeconds / 240, 1);
                                    const easedGrowth = 1 - Math.pow(1 - growthProgress, 1.8);
                                    const pulse = Math.sin(elapsedSeconds * fireState.waveSpeed + fireState.seed) * 0.01;
                                    currentRadiusMultiplier = 0.02 + easedGrowth * 0.98 + pulse;
                                }
                                const currentRadius = fireState.baseRadius * currentRadiusMultiplier;
                                // Calculate distance from truck to fire center
                                const distanceKm = calculateDistance(truckLat, truckLon, fireLat, fireLon);
                                const distanceMeters = distanceKm * 1000;
                                console.log(`[Responder] Team ${responder.team_number} distance to fire: ${distanceMeters.toFixed(0)}m, fire radius: ${currentRadius.toFixed(0)}m`);
                                // If truck is within fire radius + 50m buffer (touching fire edge)
                                if (distanceMeters <= currentRadius + 50) {
                                    responder.status = 'on_scene';
                                    const updateToOnScene = async ()=>{
                                        try {
                                            await __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('units').update({
                                                status: 'on_scene',
                                                arrived_at: new Date().toISOString()
                                            }).eq('id', responder.id);
                                        } catch  {
                                            await __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('responders').update({
                                                status: 'on_scene',
                                                arrived_at: new Date().toISOString()
                                            }).eq('id', responder.id);
                                        }
                                    };
                                    await updateToOnScene();
                                    // CRITICAL: Update React state AND ref immediately so fire animation sees the responder on scene
                                    setResponders((prev)=>{
                                        const updated = prev.map((r)=>r.id === responder.id ? {
                                                ...r,
                                                status: 'on_scene'
                                            } : r);
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
        return ()=>{
            console.log('[Responder Animation] Cleanup');
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            // Clean up markers and routes
            respondersRef.forEach((r)=>{
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
    }, [
        responders,
        incidents,
        selectedIncidentId,
        firestations,
        unitUpdateCallback
    ]);
    // Update AI routes and evacuation zones on map
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const map = mapRef.current;
        if (!map || !map.isStyleLoaded()) return;
        // Wait for map to be fully loaded with all sources
        const updateSources = ()=>{
            try {
                // Update AI routes only if source exists
                if (map.getSource(aiRouteSourceId)) {
                    const aiSource = map.getSource(aiRouteSourceId);
                    if (aiSource && typeof aiSource.setData === 'function') {
                        const routeFeatures = aiRecommendedRoutes.map((route)=>({
                                type: 'Feature',
                                properties: {
                                    station_id: route.station_id,
                                    reason: route.reason,
                                    risk_score: route.risk_score
                                },
                                geometry: route.new_route?.geometry || {
                                    type: 'LineString',
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
                    const evacSource = map.getSource(evacuationSourceId);
                    if (evacSource && typeof evacSource.setData === 'function') {
                        const evacuationFeatures = evacuationZones.map((zone)=>({
                                type: 'Feature',
                                properties: {
                                    fire_id: zone.fire_id,
                                    zone_name: zone.zone_name
                                },
                                geometry: {
                                    type: 'Polygon',
                                    coordinates: [
                                        zone.polygon || []
                                    ]
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
    }, [
        aiRecommendedRoutes,
        evacuationZones
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!mapContainerRef.current || loading) return;
        // Set Mapbox access token
        __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$mapbox$2d$gl$2f$dist$2f$mapbox$2d$gl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].accessToken = 'pk.eyJ1Ijoic3BhbnVnYW50aTMxIiwiYSI6ImNtaDVwbzBlYzA1bTkybnB6azQxZnEwOGEifQ.eCNufvFartJqVo8Nwkwkeg';
        // Initialize map
        // Default center; will update to geolocation when available
        let initialCenter = [
            -122.0,
            38.5
        ];
        // Try to center on user location + drop a labeled marker
        if (typeof navigator !== 'undefined' && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos)=>{
                const userLngLat = [
                    pos.coords.longitude,
                    pos.coords.latitude
                ];
                mapRef.current?.jumpTo({
                    center: userLngLat,
                    zoom: 14,
                    pitch: 45,
                    bearing: 0
                });
                // Add a clear "You are here" marker
                const el = document.createElement('div');
                el.className = 'user-location-marker';
                el.style.width = '18px';
                el.style.height = '18px';
                el.style.borderRadius = '50%';
                el.style.background = 'radial-gradient(circle, #67e8f9 0%, #0ea5e9 60%, #083344 100%)';
                el.style.boxShadow = '0 0 16px rgba(14,165,233,0.6)';
                new __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$mapbox$2d$gl$2f$dist$2f$mapbox$2d$gl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].Marker(el).setLngLat(userLngLat).setPopup(new __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$mapbox$2d$gl$2f$dist$2f$mapbox$2d$gl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].Popup({
                    offset: 12
                }).setText('You are here')).addTo(mapRef.current);
                if (onMapMove) {
                    onMapMove({
                        lat: pos.coords.latitude,
                        lon: pos.coords.longitude
                    });
                }
            }, ()=>{}, {
                enableHighAccuracy: true,
                timeout: 3000,
                maximumAge: 60000
            });
        }
        mapRef.current = new __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$mapbox$2d$gl$2f$dist$2f$mapbox$2d$gl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/dark-v11',
            center: initialCenter,
            zoom: 7.5,
            pitch: 45,
            bearing: 0,
            attributionControl: false
        });
        const map = mapRef.current;
        // Navigation and fullscreen controls removed per user request
        // Add scale control
        map.addControl(new __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$mapbox$2d$gl$2f$dist$2f$mapbox$2d$gl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].ScaleControl({
            maxWidth: 100,
            unit: 'imperial'
        }), 'bottom-left');
        // Emit initial map center
        if (onMapMove) {
            const center = map.getCenter();
            onMapMove({
                lat: center.lat,
                lon: center.lng
            });
        }
        // Track map movement
        map.on('moveend', ()=>{
            if (onMapMove) {
                const center = map.getCenter();
                onMapMove({
                    lat: center.lat,
                    lon: center.lng
                });
            }
        });
        // Call onMapReady callback with navigation function
        if (onMapReady) {
            onMapReady(navigateToIncident);
        }
        // Wait for map to load
        map.on('load', ()=>{
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
                filter: [
                    '==',
                    'extrude',
                    'true'
                ],
                type: 'fill-extrusion',
                paint: {
                    'fill-extrusion-color': '#888',
                    'fill-extrusion-height': [
                        'get',
                        'height'
                    ],
                    'fill-extrusion-opacity': 0.6
                }
            });
            // Add sky layer
            map.addLayer({
                id: 'sky',
                type: 'sky',
                paint: {
                    'sky-type': 'atmosphere',
                    'sky-atmosphere-sun': [
                        0.0,
                        0.0
                    ],
                    'sky-atmosphere-sun-intensity': 15
                }
            });
            // Initialize dynamic fire polygons for active incidents
            activeIncidents.forEach((incident)=>{
                const seed = Math.random() * Math.PI * 2;
                // Generate wind-influenced growth vectors using CURRENT wind
                // These values will be LOCKED for this fire and won't change
                const numVectors = 16; // Fewer directional segments for simpler shapes
                const growthVectors = generateWindInfluencedGrowthVectors(numVectors, windSpeed, windDirection);
                const incidentKey = typeof incident.id === 'number' ? incident.id : parseInt(String(incident.id), 10);
                fireStateRef.current[incidentKey] = {
                    baseRadius: getBaseRadiusMeters(incident) * 2.5,
                    roughness: 0.2 + Math.random() * 0.15,
                    waveSpeed: 0.3 + Math.random() * 0.3,
                    amplitude: 90 + Math.random() * 110,
                    expansionRate: getExpansionRate(incident),
                    seed,
                    growthVectors,
                    startTime: Date.now(),
                    initialWindSpeed: windSpeed,
                    initialWindDirection: windDirection // Lock initial wind direction
                };
            });
            const initialFireFeatures = {
                type: 'FeatureCollection',
                features: activeIncidents.map((incident)=>{
                    const incidentKey = typeof incident.id === 'number' ? incident.id : parseInt(String(incident.id), 10);
                    const state = fireStateRef.current[incidentKey];
                    return createFireFeature(incident, state.baseRadius * 0.02, {
                        roughness: state.roughness,
                        seed: state.seed,
                        intensity: 0.55,
                        points: 24,
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
                        [
                            'linear'
                        ],
                        [
                            'get',
                            'intensity'
                        ],
                        0,
                        'rgba(140, 20, 0, 0.35)',
                        0.2,
                        'rgba(180, 35, 5, 0.45)',
                        0.35,
                        'rgba(200, 50, 10, 0.55)',
                        0.5,
                        'rgba(220, 70, 15, 0.65)',
                        0.65,
                        'rgba(235, 90, 25, 0.7)',
                        0.8,
                        'rgba(245, 110, 35, 0.75)',
                        1,
                        'rgba(255, 130, 50, 0.8)' // Lighter orange (edges/newest)
                    ],
                    'fill-opacity': [
                        'interpolate',
                        [
                            'linear'
                        ],
                        [
                            'zoom'
                        ],
                        7,
                        0.5,
                        10,
                        0.65,
                        13,
                        0.75,
                        16,
                        0.85 // Very visible when zoomed in
                    ],
                    'fill-outline-color': 'rgba(200, 60, 0, 0.5)' // Darker orange-red outline
                }
            });
            map.addLayer({
                id: 'fire-glow-outline',
                type: 'line',
                source: fireSourceId,
                paint: {
                    'line-color': 'rgba(240, 100, 40, 0.7)',
                    'line-width': [
                        'interpolate',
                        [
                            'linear'
                        ],
                        [
                            'zoom'
                        ],
                        7,
                        1.5,
                        12,
                        3,
                        15,
                        5
                    ],
                    'line-blur': 4,
                    'line-opacity': 0.75
                }
            }, fireLayerId);
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
                    'line-color': '#FF8C00',
                    'line-width': 5,
                    'line-dasharray': [
                        2,
                        2
                    ],
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
                    'fill-color': '#DC2626',
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
                    'line-dasharray': [
                        4,
                        2
                    ],
                    'line-opacity': 0.8
                }
            });
            const animateFire = (timestamp)=>{
                if (!mapRef.current) return;
                if (fireStartTimeRef.current === null) {
                    fireStartTimeRef.current = timestamp;
                }
                const elapsedSeconds = (timestamp - fireStartTimeRef.current) / 1000;
                const features = activeIncidents.map((incident)=>{
                    const incidentKey = typeof incident.id === 'number' ? incident.id : parseInt(String(incident.id), 10);
                    const state = fireStateRef.current[incidentKey];
                    if (!state) {
                        return createFireFeature(incident, getBaseRadiusMeters(incident));
                    }
                    // Check if responders are on scene for this fire (use ref to get latest value)
                    const respondersOnScene = latestRespondersRef.current.filter((r)=>String(r.incident_id) === String(incident.id) && r.status === 'on_scene').length;
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
                        radiusMultiplier = 1 - shrinkProgress * 0.95;
                        // Update containment percentage in Supabase
                        const newContainment = Math.min(Math.floor(shrinkProgress * 100), 100);
                        if (newContainment !== incident.containment && newContainment % 10 === 0) {
                            // Update every 10% for faster updates
                            console.log(`[Fire Containment] ${incident.name} containment: ${newContainment}%`);
                            __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('incidents').update({
                                containment: newContainment,
                                status: newContainment >= 100 ? 'contained' : 'active'
                            }).eq('id', String(incident.id)).then(({ error })=>{
                                if (error) console.error('Error updating containment:', error);
                            });
                        }
                        // If fully contained, return responders to available
                        if (shrinkProgress >= 1 && newContainment >= 100) {
                            console.log(`[Fire Containment] ✅ ${incident.name} fully contained!`);
                            // Reset all responders on this fire back to available (use ref for latest value)
                            // Include both on_scene AND en_route responders
                            const respondersToReset = latestRespondersRef.current.filter((r)=>String(r.incident_id) === String(incident.id) && (r.status === 'on_scene' || r.status === 'en_route' || r.status === 'dispatched'));
                            const onScene = respondersToReset.filter((r)=>r.status === 'on_scene').length;
                            const enRoute = respondersToReset.filter((r)=>r.status === 'en_route').length;
                            const dispatched = respondersToReset.filter((r)=>r.status === 'dispatched').length;
                            console.log(`[Fire Containment] 🚒 Returning ${respondersToReset.length} responders to station (${onScene} on-scene, ${enRoute} en-route, ${dispatched} dispatched)`);
                            // Reset all responders asynchronously
                            const resetPromises = respondersToReset.map((responder)=>{
                                // Get the firestation to reset position
                                const station = firestations.find((fs)=>fs.id === responder.firestation_id);
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
                                    const resetUnit = async ()=>{
                                        try {
                                            return await __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('units').update({
                                                status: 'available',
                                                incident_id: null,
                                                current_lat: station.lat,
                                                current_lon: station.lon,
                                                dispatched_at: null,
                                                arrived_at: null
                                            }).eq('id', responder.id);
                                        } catch  {
                                            return await __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('responders').update({
                                                status: 'available',
                                                incident_id: null,
                                                current_lat: station.lat,
                                                current_lon: station.lon,
                                                dispatched_at: null,
                                                arrived_at: null
                                            }).eq('id', responder.id);
                                        }
                                    };
                                    return resetUnit().then(({ error })=>{
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
                            Promise.all(resetPromises).then(()=>{
                                // Update local state to remove ALL responders for this incident
                                setResponders((prev)=>{
                                    const updated = prev.filter((r)=>String(r.incident_id) !== String(incident.id));
                                    latestRespondersRef.current = updated;
                                    return updated;
                                });
                                // Trigger responder stats refresh to update UI counts
                                if (onResponderUpdate) {
                                    setTimeout(()=>{
                                        console.log('[Fire Containment] Triggering responder stats refresh');
                                        // Force a refresh by re-fetching stats
                                        fetch('/api/dispatch-unit').then((res)=>res.json()).then((data)=>{
                                            if (unitUpdateCallback && data.totals) {
                                                unitUpdateCallback({
                                                    available: data.totals.available || 0,
                                                    dispatched: data.totals.dispatched || 0,
                                                    active: data.totals.on_scene || data.totals.active || 0
                                                }, data.activeUnits || data.activeResponders || []);
                                            }
                                        }).catch((err)=>console.error('Error refreshing unit stats:', err));
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
                            radiusMultiplier = 0.02 + easedGrowth * 0.98 + pulse;
                        } else {
                            // Containment started but responders left - keep fire at locked size
                            radiusMultiplier = 1.0;
                        }
                    }
                    const radiusMeters = state.baseRadius * radiusMultiplier;
                    // Very subtle intensity variation for stable appearance
                    const intensity = clamp(0.6 + 0.15 * Math.abs(Math.sin(elapsedSeconds * 0.8 + state.seed)), 0.55, 0.85);
                    return createFireFeature(incident, radiusMeters, {
                        time: elapsedSeconds,
                        roughness: state.roughness,
                        seed: state.seed,
                        intensity,
                        points: 24,
                        growthVectors: state.growthVectors,
                        elapsedTime: elapsedSeconds
                    });
                });
                const source = map.getSource(fireSourceId);
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
            incidents.forEach((incident)=>{
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
                const marker = new __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$mapbox$2d$gl$2f$dist$2f$mapbox$2d$gl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].Marker({
                    element: markerEl
                }).setLngLat([
                    lng,
                    lat
                ]).addTo(map);
                markerEl.addEventListener('click', ()=>{
                    // Set selected fire ID
                    const numericId = typeof incident.id === 'number' ? incident.id : parseInt(String(incident.id), 10);
                    setSelectedFireId(numericId);
                    // Notify parent component that this incident was selected
                    if (onIncidentSelect) {
                        // Find the original incident to get all required fields
                        const originalIncident = incidents.find((i)=>i.id === incident.id);
                        if (originalIncident) {
                            onIncidentSelect({
                                id: originalIncident.id.toString(),
                                name: originalIncident.name,
                                risk: originalIncident.intensity,
                                lat: lat,
                                lon: lng,
                                containment: originalIncident.containment || 0,
                                last_update: originalIncident.last_update || new Date().toISOString(),
                                description: originalIncident.description || null
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
                        center: [
                            lng,
                            lat
                        ],
                        zoom: 17,
                        pitch: 60,
                        bearing: map.getBearing(),
                        duration: 3500,
                        padding: {
                            top: 260,
                            bottom: 40,
                            left: 40,
                            right: 40
                        },
                        essential: true
                    });
                    if (popupRef.current) {
                        popupRef.current.remove();
                    }
                    const popupContent = createPopupContent(incident);
                    popupRef.current = new __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$mapbox$2d$gl$2f$dist$2f$mapbox$2d$gl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].Popup({
                        closeButton: true,
                        closeOnClick: true,
                        maxWidth: '380px',
                        offset: 20,
                        anchor: 'bottom'
                    }).setLngLat([
                        lng,
                        lat
                    ]).setHTML(popupContent).addTo(map);
                    // After popup is added, wire up fullscreen toggle behavior
                    try {
                        const popupNode = popupRef.current?.getElement();
                        if (popupNode) {
                            const content = popupNode.querySelector('.mapboxgl-popup-content');
                            const videoEl = content?.querySelector('video[data-video-element="true"]');
                            const toggleBtn = content?.querySelector('button[data-fullscreen-toggle="true"]');
                            if (videoEl && toggleBtn) {
                                toggleBtn.onclick = async ()=>{
                                    try {
                                        const anyVideo = videoEl;
                                        if (!document.fullscreenElement) {
                                            if (videoEl.requestFullscreen) await videoEl.requestFullscreen();
                                            else if (anyVideo.webkitRequestFullscreen) await anyVideo.webkitRequestFullscreen();
                                            else if (anyVideo.msRequestFullscreen) await anyVideo.msRequestFullscreen();
                                        } else {
                                            const anyDoc = document;
                                            if (document.exitFullscreen) await document.exitFullscreen();
                                            else if (anyDoc.webkitExitFullscreen) await anyDoc.webkitExitFullscreen();
                                            else if (anyDoc.msExitFullscreen) await anyDoc.msExitFullscreen();
                                        }
                                    } catch (e) {
                                        console.warn('Popup fullscreen failed, opening fallback modal');
                                        // Fallback: open the React modal by dispatching a custom event the page can listen to
                                        window.dispatchEvent(new CustomEvent('openVideoModal', {
                                            detail: {
                                                fireName: incident.name
                                            }
                                        }));
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
            firestations.forEach((firestation)=>{
                const { lat, lon, name } = firestation;
                if (typeof lat !== 'number' || typeof lon !== 'number') return;
                // Create firestation marker element
                const markerEl = createFirestationMarker();
                // Create marker
                const marker = new __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$mapbox$2d$gl$2f$dist$2f$mapbox$2d$gl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].Marker({
                    element: markerEl,
                    anchor: 'center'
                }).setLngLat([
                    lon,
                    lat
                ]).addTo(map);
                // Add click event for popup
                markerEl.addEventListener('click', (e)=>{
                    e.stopPropagation();
                    if (popupRef.current) {
                        popupRef.current.remove();
                    }
                    const popupContent = createFirestationPopupContent(firestation);
                    popupRef.current = new __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$mapbox$2d$gl$2f$dist$2f$mapbox$2d$gl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].Popup({
                        closeButton: true,
                        closeOnClick: true,
                        maxWidth: '300px',
                        offset: 25,
                        anchor: 'bottom'
                    }).setLngLat([
                        lon,
                        lat
                    ]).setHTML(popupContent).addTo(map);
                });
                markersRef.current.push(marker);
            });
        });
        // Cursor interactions
        map.on('mousemove', ()=>{
            map.getCanvas().style.cursor = 'grab';
        });
        map.on('mousedown', ()=>{
            map.getCanvas().style.cursor = 'grabbing';
        });
        map.on('mouseup', ()=>{
            map.getCanvas().style.cursor = 'grab';
        });
        // Cleanup
        return ()=>{
            markersRef.current.forEach((marker)=>marker.remove());
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
    }, [
        loading,
        incidents,
        firestations,
        displayRouteToFire
    ]);
    // Wind values are now LOCKED when fire is created - no updates when wind changes
    // This prevents fire from constantly changing as user pans/zooms the map
    // Each fire uses its initial wind conditions throughout its lifecycle
    // Update fire label visibility when selected fire changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Hide all labels first
        document.querySelectorAll('.fire-label').forEach((label)=>{
            label.style.display = 'none';
        });
        // Show label for selected fire
        if (selectedFireId !== null) {
            const selectedLabel = document.querySelector(`.fire-label[data-fire-id="${selectedFireId}"]`);
            if (selectedLabel) {
                selectedLabel.style.display = 'block';
            }
        }
    }, [
        selectedFireId
    ]);
    // Reset view function
    const resetView = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
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
                center: [
                    -122.0,
                    38.5
                ],
                zoom: 7.5,
                pitch: 45,
                bearing: 0,
                duration: 1500
            });
        }
    }, []);
    // Show loading state
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `w-full h-full relative ${className} flex items-center justify-center`,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-white/70 text-sm",
                children: "Loading incident data..."
            }, void 0, false, {
                fileName: "[project]/projects/tartanhacks/components/california-map.tsx",
                lineNumber: 2477,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/projects/tartanhacks/components/california-map.tsx",
            lineNumber: 2476,
            columnNumber: 7
        }, this);
    }
    // Show error state
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `w-full h-full relative ${className} flex items-center justify-center`,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-red-400 text-sm",
                children: [
                    "Error: ",
                    error
                ]
            }, void 0, true, {
                fileName: "[project]/projects/tartanhacks/components/california-map.tsx",
                lineNumber: 2486,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/projects/tartanhacks/components/california-map.tsx",
            lineNumber: 2485,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `w-full h-full relative ${className}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "vignette-overlay z-10 pointer-events-none"
            }, void 0, false, {
                fileName: "[project]/projects/tartanhacks/components/california-map.tsx",
                lineNumber: 2494,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: mapContainerRef,
                className: "absolute inset-0 z-0",
                style: {
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'auto'
                }
            }, void 0, false, {
                fileName: "[project]/projects/tartanhacks/components/california-map.tsx",
                lineNumber: 2497,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute bottom-0 left-0 z-30",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: resetView,
                    className: "bg-black/20 backdrop-blur-md border border-white/20 rounded-lg px-2 py-1 text-white text-xs font-medium hover:bg-black/30 hover:border-white/30 transition-all duration-200 flex items-center gap-1 m-1",
                    title: "Reset to California View",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            width: "16",
                            height: "16",
                            viewBox: "0 0 24 24",
                            fill: "none",
                            stroke: "currentColor",
                            strokeWidth: "2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"
                                }, void 0, false, {
                                    fileName: "[project]/projects/tartanhacks/components/california-map.tsx",
                                    lineNumber: 2511,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M21 3v5h-5"
                                }, void 0, false, {
                                    fileName: "[project]/projects/tartanhacks/components/california-map.tsx",
                                    lineNumber: 2512,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"
                                }, void 0, false, {
                                    fileName: "[project]/projects/tartanhacks/components/california-map.tsx",
                                    lineNumber: 2513,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M3 21v-5h5"
                                }, void 0, false, {
                                    fileName: "[project]/projects/tartanhacks/components/california-map.tsx",
                                    lineNumber: 2514,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/projects/tartanhacks/components/california-map.tsx",
                            lineNumber: 2510,
                            columnNumber: 13
                        }, this),
                        "Reset View"
                    ]
                }, void 0, true, {
                    fileName: "[project]/projects/tartanhacks/components/california-map.tsx",
                    lineNumber: 2505,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/projects/tartanhacks/components/california-map.tsx",
                lineNumber: 2504,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/projects/tartanhacks/components/california-map.tsx",
        lineNumber: 2492,
        columnNumber: 5
    }, this);
}
}),
"[project]/projects/tartanhacks/components/leaflet-map.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LeafletMap
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projects/tartanhacks/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projects/tartanhacks/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projects/tartanhacks/lib/supabase-client.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
// OSM tiles for lightweight 2D view
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tileAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
function LeafletMap({ onReady, searchTerm, refreshTrigger }) {
    const mapRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const mapInstance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const leafletRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const markersRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({});
    const unitMarkersRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({});
    const checkpointMarkersRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({});
    const lineLayersRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({});
    const userMarker = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [dataVersion, setDataVersion] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    // Lazy load Leaflet and init map
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let mounted = true;
        const loadLeaflet = async ()=>{
            if (window.L) return window.L;
            // CSS
            if (!document.getElementById('leaflet-css')) {
                const link = document.createElement('link');
                link.id = 'leaflet-css';
                link.rel = 'stylesheet';
                link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                document.head.appendChild(link);
            }
            // JS
            if (!document.getElementById('leaflet-js')) {
                await new Promise((resolve, reject)=>{
                    const script = document.createElement('script');
                    script.id = 'leaflet-js';
                    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                    script.async = true;
                    script.onload = ()=>resolve();
                    script.onerror = (err)=>reject(err);
                    document.body.appendChild(script);
                });
            }
            return window.L;
        };
        const init = async ()=>{
            if (mapInstance.current) return;
            const L = await loadLeaflet();
            if (!mounted || !L) return;
            leafletRef.current = L;
            const map = L.map(mapRef.current, {
                center: [
                    40.4427,
                    -79.9425
                ],
                zoom: 14,
                maxZoom: 20,
                worldCopyJump: true
            });
            L.tileLayer(tileUrl, {
                attribution: tileAttribution,
                maxZoom: 20
            }).addTo(map);
            // My location
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((pos)=>{
                    const coords = [
                        pos.coords.latitude,
                        pos.coords.longitude
                    ];
                    map.setView(coords, 14);
                    const mk = L.circleMarker(coords, {
                        radius: 12,
                        color: '#6ee7ff',
                        weight: 3,
                        fillColor: '#0ea5e9',
                        fillOpacity: 0.6,
                        className: 'my-location-dot'
                    }).addTo(map);
                    mk.bindTooltip('You are here', {
                        permanent: true,
                        direction: 'top',
                        className: 'leaflet-label my-location-label'
                    });
                    userMarker.current = mk;
                }, ()=>{}, {
                    enableHighAccuracy: true,
                    timeout: 3000,
                    maximumAge: 60000
                });
            }
            // expose flyTo handler
            const fly = (lat, lon, zoom = 14)=>{
                map.flyTo([
                    lat,
                    lon
                ], zoom, {
                    duration: 0.75
                });
            };
            onReady?.(fly);
            mapInstance.current = map;
        };
        init();
        return ()=>{
            mounted = false;
        };
    }, [
        onReady
    ]);
    // respond to external search term
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!searchTerm || !searchTerm.trim()) return;
        const parts = searchTerm.split(',').map((s)=>parseFloat(s.trim()));
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
            mapInstance.current?.flyTo([
                parts[0],
                parts[1]
            ], 14, {
                duration: 0.75
            });
        }
    }, [
        searchTerm
    ]);
    // Helpers to render layers
    const syncIncidents = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((incidents)=>{
        const L = leafletRef.current;
        const map = mapInstance.current;
        if (!L || !map) return;
        Object.keys(markersRef.current).forEach((id)=>{
            if (!incidents.find((i)=>i.id === id)) {
                markersRef.current[id].remove();
                delete markersRef.current[id];
            }
        });
        incidents.forEach((inc)=>{
            if (!inc.lat || !inc.lon) return;
            const color = '#ff6b00';
            const radius = 13;
            let marker = markersRef.current[inc.id];
            if (!marker) {
                marker = L.circleMarker([
                    inc.lat,
                    inc.lon
                ], {
                    radius,
                    color,
                    weight: 3,
                    fillColor: '#ff6b00',
                    fillOpacity: 0.6
                }).addTo(map);
                marker.bindTooltip(inc.name || 'Crime scene', {
                    permanent: true,
                    direction: 'top',
                    className: 'leaflet-label'
                });
                markersRef.current[inc.id] = marker;
            } else {
                marker.setLatLng([
                    inc.lat,
                    inc.lon
                ]);
                marker.setStyle({
                    color,
                    fillColor: color,
                    weight: 3,
                    fillOpacity: 0.55
                });
            }
        });
    }, []);
    const syncUnits = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((units)=>{
        const L = leafletRef.current;
        const map = mapInstance.current;
        if (!L || !map) return;
        Object.keys(unitMarkersRef.current).forEach((id)=>{
            if (!units.find((u)=>u.id === id)) {
                unitMarkersRef.current[id].remove();
                delete unitMarkersRef.current[id];
            }
        });
        units.forEach((u)=>{
            const color = u.status === 'available' ? '#2563eb' : u.status === 'on_scene' ? '#22c55e' : '#facc15'; // blue avail, green on scene, yellow en route
            const radius = 10;
            const label = u.unit_number || u.id.slice(0, 6);
            let marker = unitMarkersRef.current[u.id];
            if (!marker) {
                marker = L.circleMarker([
                    u.current_lat,
                    u.current_lon
                ], {
                    radius,
                    color,
                    weight: 3,
                    fillColor: color,
                    fillOpacity: 0.65
                }).addTo(map);
                marker.bindTooltip(label, {
                    permanent: true,
                    direction: 'right',
                    className: 'leaflet-label unit'
                });
                marker.on('click', ()=>{
                    map.flyTo([
                        u.current_lat,
                        u.current_lon
                    ], 15, {
                        duration: 0.75
                    });
                    marker.openTooltip();
                });
                unitMarkersRef.current[u.id] = marker;
            } else {
                marker.setLatLng([
                    u.current_lat,
                    u.current_lon
                ]);
                marker.setStyle({
                    color,
                    fillColor: color,
                    weight: 3,
                    fillOpacity: 0.65
                });
            }
        });
    }, []);
    const syncCheckpoints = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((points)=>{
        const L = leafletRef.current;
        const map = mapInstance.current;
        if (!L || !map) return;
        Object.keys(checkpointMarkersRef.current).forEach((id)=>{
            if (!points.find((p)=>p.id === id)) {
                checkpointMarkersRef.current[id].remove();
                delete checkpointMarkersRef.current[id];
            }
        });
        points.forEach((p)=>{
            const color = '#22d3ee';
            let marker = checkpointMarkersRef.current[p.id];
            if (!marker) {
                const icon = L.divIcon({
                    className: 'checkpoint-icon',
                    html: `<div class="checkpoint-dot" style="background:${color}"></div><span class="checkpoint-label checkpoint-label-dark">${p.label}</span>`,
                    iconAnchor: [
                        8,
                        8
                    ]
                });
                marker = L.marker([
                    p.lat,
                    p.lon
                ], {
                    icon
                }).addTo(map);
                marker.on('click', async (ev)=>{
                    ev.originalEvent.stopPropagation();
                    await __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('checkpoints').delete().eq('id', p.id);
                    setDataVersion((v)=>v + 1);
                });
                checkpointMarkersRef.current[p.id] = marker;
            } else {
                marker.setLatLng([
                    p.lat,
                    p.lon
                ]);
            }
        });
    }, []);
    const syncDispatches = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((dispatches)=>{
        const L = leafletRef.current;
        const map = mapInstance.current;
        if (!L || !map) return;
        // build lookup
        const units = __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].__data.units;
        const incidents = __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].__data.incidents;
        Object.values(lineLayersRef.current).forEach((layer)=>layer.remove());
        lineLayersRef.current = {};
        dispatches.forEach((d)=>{
            const unit = units.find((u)=>u.id === d.unit_id);
            const inc = incidents.find((i)=>i.id === d.incident_id);
            if (!unit || !inc || !inc.lat || !inc.lon) return;
            const line = L.polyline([
                [
                    unit.current_lat,
                    unit.current_lon
                ],
                [
                    inc.lat,
                    inc.lon
                ]
            ], {
                color: '#00c2ff',
                weight: 4,
                dashArray: '8,6',
                opacity: 0.9
            }).addTo(map);
            lineLayersRef.current[d.id] = line;
        });
    }, []);
    // Data fetch / polling (after callbacks are defined to avoid TDZ)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let cancel = false;
        const run = async ()=>{
            const [incidentsRes, unitsRes, dispatchesRes, checkpointsRes] = await Promise.all([
                __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('incidents').select('*'),
                __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('units').select('*'),
                __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('dispatches').select('*'),
                __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('checkpoints').select('*')
            ]);
            if (cancel) return;
            syncIncidents(incidentsRes.data ?? []);
            syncUnits(unitsRes.data ?? []);
            syncDispatches(dispatchesRes.data ?? []);
            syncCheckpoints(checkpointsRes.data ?? []);
        };
        run();
        const id = setInterval(()=>!cancel && run(), 5000);
        return ()=>{
            cancel = true;
            clearInterval(id);
        };
    }, [
        syncIncidents,
        syncUnits,
        syncDispatches,
        syncCheckpoints,
        refreshTrigger
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full h-full relative",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            ref: mapRef,
            className: "w-full h-full rounded-xl border border-white/10 shadow-inner overflow-hidden"
        }, void 0, false, {
            fileName: "[project]/projects/tartanhacks/components/leaflet-map.tsx",
            lineNumber: 316,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/projects/tartanhacks/components/leaflet-map.tsx",
        lineNumber: 315,
        columnNumber: 5
    }, this);
}
}),
"[project]/projects/tartanhacks/components/transcript-recorder.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TranscriptRecorder
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projects/tartanhacks/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projects/tartanhacks/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projects/tartanhacks/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Mic$3e$__ = __turbopack_context__.i("[project]/projects/tartanhacks/node_modules/lucide-react/dist/esm/icons/mic.js [app-ssr] (ecmascript) <export default as Mic>");
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Square$3e$__ = __turbopack_context__.i("[project]/projects/tartanhacks/node_modules/lucide-react/dist/esm/icons/square.js [app-ssr] (ecmascript) <export default as Square>");
'use client';
;
;
;
;
function TranscriptRecorder() {
    const [listening, setListening] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [transcripts, setTranscripts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const recognitionRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
        const SpeechRecognition = undefined;
        const recog = undefined;
    }, []);
    const toggle = ()=>{
        const recog = recognitionRef.current;
        if (!recog) return;
        if (listening) {
            recog.stop();
            setListening(false);
        } else {
            recog.start();
            setListening(true);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "glass-panel rounded-xl p-4 space-y-3 h-[260px] flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-sm font-semibold text-white",
                                children: "Transcript Recorder"
                            }, void 0, false, {
                                fileName: "[project]/projects/tartanhacks/components/transcript-recorder.tsx",
                                lineNumber: 61,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-white/60",
                                children: "Hands-free notes & commands"
                            }, void 0, false, {
                                fileName: "[project]/projects/tartanhacks/components/transcript-recorder.tsx",
                                lineNumber: 62,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/projects/tartanhacks/components/transcript-recorder.tsx",
                        lineNumber: 60,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                        size: "sm",
                        variant: listening ? 'destructive' : 'secondary',
                        onClick: toggle,
                        children: [
                            listening ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Square$3e$__["Square"], {
                                className: "w-4 h-4 mr-1"
                            }, void 0, false, {
                                fileName: "[project]/projects/tartanhacks/components/transcript-recorder.tsx",
                                lineNumber: 65,
                                columnNumber: 24
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Mic$3e$__["Mic"], {
                                className: "w-4 h-4 mr-1"
                            }, void 0, false, {
                                fileName: "[project]/projects/tartanhacks/components/transcript-recorder.tsx",
                                lineNumber: 65,
                                columnNumber: 62
                            }, this),
                            listening ? 'Stop' : 'Record'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/projects/tartanhacks/components/transcript-recorder.tsx",
                        lineNumber: 64,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/projects/tartanhacks/components/transcript-recorder.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white/5 border border-white/10 rounded-lg flex-1 overflow-auto px-3 py-2 space-y-2",
                children: transcripts.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-xs text-white/50",
                    children: "No transcripts yet."
                }, void 0, false, {
                    fileName: "[project]/projects/tartanhacks/components/transcript-recorder.tsx",
                    lineNumber: 71,
                    columnNumber: 11
                }, this) : transcripts.map((t, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-xs text-white/80 leading-snug",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[10px] text-white/50 mr-2",
                                children: t.time
                            }, void 0, false, {
                                fileName: "[project]/projects/tartanhacks/components/transcript-recorder.tsx",
                                lineNumber: 75,
                                columnNumber: 15
                            }, this),
                            t.text
                        ]
                    }, idx, true, {
                        fileName: "[project]/projects/tartanhacks/components/transcript-recorder.tsx",
                        lineNumber: 74,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/projects/tartanhacks/components/transcript-recorder.tsx",
                lineNumber: 69,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/projects/tartanhacks/components/transcript-recorder.tsx",
        lineNumber: 58,
        columnNumber: 5
    }, this);
}
}),
"[project]/projects/tartanhacks/components/unit-list.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>UnitList
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projects/tartanhacks/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projects/tartanhacks/lib/supabase-client.ts [app-ssr] (ecmascript)");
'use client';
;
;
function UnitList() {
    const units = __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].__data?.units || [];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "glass-panel rounded-xl p-4 space-y-3 max-h-[260px] overflow-auto",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-sm font-semibold text-white",
                        children: "Units (pre-positioned)"
                    }, void 0, false, {
                        fileName: "[project]/projects/tartanhacks/components/unit-list.tsx",
                        lineNumber: 20,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xs text-white/50",
                        children: units.length
                    }, void 0, false, {
                        fileName: "[project]/projects/tartanhacks/components/unit-list.tsx",
                        lineNumber: 21,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/projects/tartanhacks/components/unit-list.tsx",
                lineNumber: 19,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2",
                children: units.map((u)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-3 py-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm text-white font-semibold",
                                        children: u.unit_number || u.id
                                    }, void 0, false, {
                                        fileName: "[project]/projects/tartanhacks/components/unit-list.tsx",
                                        lineNumber: 30,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-[11px] text-white/50",
                                        children: [
                                            u.unit_type || 'patrol',
                                            " • ",
                                            u.status
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/projects/tartanhacks/components/unit-list.tsx",
                                        lineNumber: 33,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-[11px] text-white/60",
                                        children: [
                                            u.current_lat.toFixed(4),
                                            ", ",
                                            u.current_lon.toFixed(4)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/projects/tartanhacks/components/unit-list.tsx",
                                        lineNumber: 36,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/projects/tartanhacks/components/unit-list.tsx",
                                lineNumber: 29,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `w-2.5 h-2.5 rounded-full ${u.status === 'available' ? 'bg-emerald-400' : u.status === 'on_scene' ? 'bg-blue-400' : 'bg-amber-300'}`
                            }, void 0, false, {
                                fileName: "[project]/projects/tartanhacks/components/unit-list.tsx",
                                lineNumber: 40,
                                columnNumber: 13
                            }, this)
                        ]
                    }, u.id, true, {
                        fileName: "[project]/projects/tartanhacks/components/unit-list.tsx",
                        lineNumber: 25,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/projects/tartanhacks/components/unit-list.tsx",
                lineNumber: 23,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/projects/tartanhacks/components/unit-list.tsx",
        lineNumber: 18,
        columnNumber: 5
    }, this);
}
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[project]/projects/tartanhacks/hooks/use-vapi.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useVapi",
    ()=>useVapi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projects/tartanhacks/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f40$vapi$2d$ai$2f$web$2f$dist$2f$vapi$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projects/tartanhacks/node_modules/@vapi-ai/web/dist/vapi.js [app-ssr] (ecmascript)");
'use client';
;
;
function useVapi() {
    const [vapi, setVapi] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isSessionActive, setIsSessionActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isSpeaking, setIsSpeaking] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [volumeLevel, setVolumeLevel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const vapiInstance = new __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f40$vapi$2d$ai$2f$web$2f$dist$2f$vapi$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || '');
        setVapi(vapiInstance);
        // Event listeners
        vapiInstance.on('call-start', ()=>{
            console.log('Call started');
            setIsSessionActive(true);
        });
        vapiInstance.on('call-end', ()=>{
            console.log('Call ended');
            setIsSessionActive(false);
            setIsSpeaking(false);
        });
        vapiInstance.on('speech-start', ()=>{
            console.log('Assistant started speaking');
            setIsSpeaking(true);
        });
        vapiInstance.on('speech-end', ()=>{
            console.log('Assistant finished speaking');
            setIsSpeaking(false);
        });
        vapiInstance.on('message', (message)=>{
            console.log('Message received:', message);
            // Only process final transcripts, not partial ones
            if (message.type === 'transcript' && message.transcript && message.transcriptType === 'final') {
                setMessages((prev)=>{
                    const timestamp = new Date().toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                    // Check if the last message is from the same role and recent (within 5 seconds)
                    const lastMessage = prev[prev.length - 1];
                    const isRecentMessage = lastMessage && lastMessage.role === message.role && lastMessage.timestamp === timestamp;
                    if (isRecentMessage) {
                        // Append to the existing message
                        const updated = [
                            ...prev
                        ];
                        updated[updated.length - 1] = {
                            ...lastMessage,
                            content: lastMessage.content + ' ' + message.transcript
                        };
                        return updated;
                    } else {
                        // Add as a new message
                        return [
                            ...prev,
                            {
                                type: 'transcript',
                                role: message.role,
                                content: message.transcript,
                                timestamp
                            }
                        ];
                    }
                });
            }
        });
        vapiInstance.on('volume-level', (level)=>{
            setVolumeLevel(level);
        });
        vapiInstance.on('error', (error)=>{
            console.warn('VAPI error:', error);
        // Don't treat VAPI errors as critical - they're often just connection issues
        });
        return ()=>{
            vapiInstance.stop();
        };
    }, []);
    const start = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (!vapi) return;
        try {
            // Use the assistant ID from VAPI dashboard
            await vapi.start('b497d653-42b2-4657-b831-9dfc975254a5');
        } catch (error) {
            console.error('Failed to start VAPI:', error);
        }
    }, [
        vapi
    ]);
    const stop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (!vapi) return;
        vapi.stop();
    }, [
        vapi
    ]);
    const send = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((message)=>{
        if (!vapi) return;
        vapi.send({
            type: 'add-message',
            message: {
                role: 'system',
                content: message
            }
        });
    }, [
        vapi
    ]);
    const receiveAgentMessage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((agentData)=>{
        if (!vapi) return;
        // Send to VAPI as system message so it speaks it out
        vapi.send({
            type: 'add-message',
            message: {
                role: 'system',
                content: `ALERT: ${agentData.message}. Please acknowledge.`
            }
        });
        // Also add to local messages for UI display
        setMessages((prev)=>[
                ...prev,
                {
                    type: 'agent-alert',
                    role: 'assistant',
                    content: agentData.message,
                    timestamp: new Date().toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                }
            ]);
    }, [
        vapi
    ]);
    return {
        isSessionActive,
        isSpeaking,
        messages,
        volumeLevel,
        start,
        stop,
        send,
        receiveAgentMessage
    };
}
}),
"[project]/projects/tartanhacks/hooks/use-weather.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useWeather",
    ()=>useWeather
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projects/tartanhacks/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
function useWeather(lat, lon) {
    const [weather, setWeather] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const fetchWeather = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (latitude, longitude)=>{
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`);
            if (!response.ok) {
                const errorData = await response.json().catch(()=>({
                        error: 'Unknown error'
                    }));
                const errorMessage = errorData.error || `HTTP ${response.status}: ${response.statusText}`;
                console.error('Weather API error:', errorMessage);
                throw new Error(errorMessage);
            }
            const data = await response.json();
            setWeather(data);
        } catch (err) {
            console.error('Error fetching weather:', err);
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError(errorMessage);
            setWeather(null);
            // Set fallback weather data to prevent UI breakage
            setWeather({
                wind: {
                    speed: 0,
                    deg: 0,
                    direction: 'N/A'
                },
                temp: 0,
                humidity: 0,
                visibility: null,
                airQuality: null,
                description: 'Weather data unavailable',
                location: 'Unknown'
            });
        } finally{
            setLoading(false);
        }
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (lat !== null && lon !== null) {
            // Debounce the weather fetch to avoid too many API calls
            const timeoutId = setTimeout(()=>{
                fetchWeather(lat, lon);
            }, 1000); // Wait 1 second after map stops moving
            return ()=>clearTimeout(timeoutId);
        }
    }, [
        lat,
        lon,
        fetchWeather
    ]);
    return {
        weather,
        loading,
        error,
        refetch: fetchWeather
    };
}
}),
"[project]/projects/tartanhacks/components/IncidentsList.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>IncidentsList
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projects/tartanhacks/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projects/tartanhacks/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projects/tartanhacks/lib/supabase-client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projects/tartanhacks/components/ui/badge.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/projects/tartanhacks/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-ssr] (ecmascript) <export default as MapPin>");
'use client';
;
;
;
;
;
function PriorityBadge({ priority, risk }) {
    // Support both 'priority' (police) and 'risk' (fire) for backward compatibility
    const level = priority || risk || null;
    const color = level === 'critical' ? '#FF6B00' : level === 'high' ? '#FF4444' : level === 'medium' ? '#FFA800' : '#00C2FF';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
        className: "border-0 text-xs font-medium px-2 py-1 whitespace-nowrap flex-shrink-0",
        style: {
            backgroundColor: `${color}33`,
            color
        },
        children: level ? level[0].toUpperCase() + level.slice(1) : 'N/A'
    }, void 0, false, {
        fileName: "[project]/projects/tartanhacks/components/IncidentsList.tsx",
        lineNumber: 29,
        columnNumber: 5
    }, this);
}
function IncidentsList({ onIncidentClick, onIncidentCountChange, onIncidentsUpdate }) {
    const [rows, setRows] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let cancelled = false;
        (async ()=>{
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('incidents').select('*').order('last_update', {
                ascending: false
            }).limit(25);
            if (cancelled) return;
            if (error) setError(error.message);
            else {
                const incidents = data ?? [];
                setRows(incidents);
                onIncidentCountChange?.(incidents.length);
                onIncidentsUpdate?.(incidents);
            }
            setLoading(false);
        })();
        // realtime updates
        const ch = __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].channel('incidents-rt').on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'incidents'
        }, (payload)=>{
            const n = payload.new;
            setRows((prev)=>{
                const without = prev.filter((i)=>i.id !== n.id);
                const newRows = [
                    n,
                    ...without
                ].slice(0, 25);
                onIncidentCountChange?.(newRows.length);
                onIncidentsUpdate?.(newRows);
                return newRows;
            });
        }).subscribe();
        return ()=>{
            cancelled = true;
            __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].removeChannel(ch);
        };
    }, []);
    if (loading) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "text-white/70 text-sm",
        children: "Loading…"
    }, void 0, false, {
        fileName: "[project]/projects/tartanhacks/components/IncidentsList.tsx",
        lineNumber: 88,
        columnNumber: 23
    }, this);
    if (error) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "text-red-400 text-sm",
        children: [
            "Error: ",
            error
        ]
    }, void 0, true, {
        fileName: "[project]/projects/tartanhacks/components/IncidentsList.tsx",
        lineNumber: 89,
        columnNumber: 23
    }, this);
    if (!rows.length) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "text-white/60 text-sm",
        children: "No incidents yet."
    }, void 0, false, {
        fileName: "[project]/projects/tartanhacks/components/IncidentsList.tsx",
        lineNumber: 90,
        columnNumber: 28
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-4",
        children: rows.map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 rounded-lg p-4 transition-all duration-200 hover:scale-[1.02] overflow-hidden ${r.lat && r.lon && !isNaN(r.lat) && !isNaN(r.lon) && r.lat !== 0 && r.lon !== 0 ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`,
                onClick: ()=>onIncidentClick?.(r),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start justify-between mb-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs font-mono text-white/50",
                                children: r.id.slice(0, 8).toUpperCase()
                            }, void 0, false, {
                                fileName: "[project]/projects/tartanhacks/components/IncidentsList.tsx",
                                lineNumber: 105,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PriorityBadge, {
                                priority: r.priority,
                                risk: r.risk
                            }, void 0, false, {
                                fileName: "[project]/projects/tartanhacks/components/IncidentsList.tsx",
                                lineNumber: 106,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/projects/tartanhacks/components/IncidentsList.tsx",
                        lineNumber: 104,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm font-semibold mb-2 text-white break-words leading-tight",
                        children: r.name ?? 'Unnamed Incident'
                    }, void 0, false, {
                        fileName: "[project]/projects/tartanhacks/components/IncidentsList.tsx",
                        lineNumber: 109,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 text-xs text-white/60",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                className: "w-3 h-3"
                            }, void 0, false, {
                                fileName: "[project]/projects/tartanhacks/components/IncidentsList.tsx",
                                lineNumber: 114,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    r.lat?.toFixed(1) ?? '—',
                                    "°N, ",
                                    r.lon?.toFixed(1) ?? '—',
                                    "°W"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/projects/tartanhacks/components/IncidentsList.tsx",
                                lineNumber: 115,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/projects/tartanhacks/components/IncidentsList.tsx",
                        lineNumber: 113,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mt-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs text-white/50",
                                children: [
                                    "Status:",
                                    ' ',
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[#00C2FF] font-medium",
                                        children: [
                                            r.containment ?? 0,
                                            "% resolved"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/projects/tartanhacks/components/IncidentsList.tsx",
                                        lineNumber: 123,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/projects/tartanhacks/components/IncidentsList.tsx",
                                lineNumber: 121,
                                columnNumber: 13
                            }, this),
                            r.incident_type && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-white/40 italic",
                                children: r.incident_type
                            }, void 0, false, {
                                fileName: "[project]/projects/tartanhacks/components/IncidentsList.tsx",
                                lineNumber: 128,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/projects/tartanhacks/components/IncidentsList.tsx",
                        lineNumber: 120,
                        columnNumber: 11
                    }, this)
                ]
            }, r.id, true, {
                fileName: "[project]/projects/tartanhacks/components/IncidentsList.tsx",
                lineNumber: 95,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/projects/tartanhacks/components/IncidentsList.tsx",
        lineNumber: 93,
        columnNumber: 5
    }, this);
}
}),
"[project]/projects/tartanhacks/app/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>OrionDashboard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projects/tartanhacks/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projects/tartanhacks/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wind$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wind$3e$__ = __turbopack_context__.i("[project]/projects/tartanhacks/node_modules/lucide-react/dist/esm/icons/wind.js [app-ssr] (ecmascript) <export default as Wind>");
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_context__.i("[project]/projects/tartanhacks/node_modules/lucide-react/dist/esm/icons/activity.js [app-ssr] (ecmascript) <export default as Activity>");
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/projects/tartanhacks/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-ssr] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Mic$3e$__ = __turbopack_context__.i("[project]/projects/tartanhacks/node_modules/lucide-react/dist/esm/icons/mic.js [app-ssr] (ecmascript) <export default as Mic>");
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$volume$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Volume2$3e$__ = __turbopack_context__.i("[project]/projects/tartanhacks/node_modules/lucide-react/dist/esm/icons/volume-2.js [app-ssr] (ecmascript) <export default as Volume2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mic$2d$off$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MicOff$3e$__ = __turbopack_context__.i("[project]/projects/tartanhacks/node_modules/lucide-react/dist/esm/icons/mic-off.js [app-ssr] (ecmascript) <export default as MicOff>");
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__ = __turbopack_context__.i("[project]/projects/tartanhacks/node_modules/lucide-react/dist/esm/icons/chevron-up.js [app-ssr] (ecmascript) <export default as ChevronUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minimize$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Minimize2$3e$__ = __turbopack_context__.i("[project]/projects/tartanhacks/node_modules/lucide-react/dist/esm/icons/minimize-2.js [app-ssr] (ecmascript) <export default as Minimize2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__ = __turbopack_context__.i("[project]/projects/tartanhacks/node_modules/lucide-react/dist/esm/icons/bot.js [app-ssr] (ecmascript) <export default as Bot>");
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__ = __turbopack_context__.i("[project]/projects/tartanhacks/node_modules/lucide-react/dist/esm/icons/shield.js [app-ssr] (ecmascript) <export default as Shield>");
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projects/tartanhacks/components/ui/badge.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projects/tartanhacks/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$components$2f$california$2d$map$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projects/tartanhacks/components/california-map.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$components$2f$leaflet$2d$map$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projects/tartanhacks/components/leaflet-map.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$components$2f$transcript$2d$recorder$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projects/tartanhacks/components/transcript-recorder.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$components$2f$unit$2d$list$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projects/tartanhacks/components/unit-list.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$hooks$2f$use$2d$vapi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projects/tartanhacks/hooks/use-vapi.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$hooks$2f$use$2d$weather$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projects/tartanhacks/hooks/use-weather.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$components$2f$IncidentsList$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projects/tartanhacks/components/IncidentsList.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projects/tartanhacks/lib/supabase-client.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
;
// Helper functions for severity-based colors
function getHumidityColor(humidity) {
    if (humidity < 20) return '#FF4444'; // Critical - very dry, high fire risk
    if (humidity < 30) return '#FF6B00'; // High risk
    if (humidity < 50) return '#FFA800'; // Moderate
    return '#00C2FF'; // Good
}
function getTemperatureColor(temp) {
    if (temp >= 100) return '#FF4444'; // Extreme heat
    if (temp >= 90) return '#FF6B00'; // Very hot
    if (temp >= 80) return '#FFA800'; // Hot
    if (temp >= 70) return '#00C2FF'; // Warm
    if (temp >= 50) return '#00FFB3'; // Mild
    return '#00C2FF'; // Cool
}
function getVisibilityColor(visibilityMiles) {
    if (visibilityMiles < 1) return '#FF4444'; // Poor
    if (visibilityMiles < 3) return '#FF6B00'; // Moderate
    if (visibilityMiles < 6) return '#FFA800'; // Fair
    return '#00C2FF'; // Good
}
function getVisibilityLabel(visibilityMiles) {
    if (visibilityMiles < 1) return 'Poor';
    if (visibilityMiles < 3) return 'Moderate';
    if (visibilityMiles < 6) return 'Fair';
    return 'Good';
}
function getAirQualityColor(aqi) {
    if (aqi >= 201) return '#8B1A1A'; // Very Unhealthy (Purple/Maroon)
    if (aqi >= 151) return '#FF4444'; // Unhealthy (Red)
    if (aqi >= 101) return '#FF6B00'; // Unhealthy for Sensitive Groups (Orange)
    if (aqi >= 51) return '#FFA800'; // Moderate (Yellow)
    return '#00FFB3'; // Good (Green)
}
function getAirQualityLabel(aqi) {
    if (aqi >= 201) return 'Very Unhealthy';
    if (aqi >= 151) return 'Unhealthy';
    if (aqi >= 101) return 'Unhealthy (Sensitive)';
    if (aqi >= 51) return 'Moderate';
    return 'Good';
}
function OrionDashboard() {
    const [leftSidebarCollapsed, setLeftSidebarCollapsed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [rightSidebarCollapsed, setRightSidebarCollapsed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [aiAssistantCollapsed, setAiAssistantCollapsed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [environmentalConditionsCollapsed, setEnvironmentalConditionsCollapsed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [activeIncidentsCollapsed, setActiveIncidentsCollapsed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [incidentCount, setIncidentCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [currentIncidents, setCurrentIncidents] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedIncident, setSelectedIncident] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [alertSending, setAlertSending] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [alertStatus, setAlertStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [unitStats, setUnitStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        available: 0,
        dispatched: 0,
        active: 0
    });
    const [allUnitStats, setAllUnitStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        available: 0,
        dispatched: 0,
        active: 0
    });
    const [dispatchSending, setDispatchSending] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [refreshUnitTrigger, setRefreshUnitTrigger] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [viewMode, setViewMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('3d');
    const [searchInput, setSearchInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [leafletSearch, setLeafletSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [nearbyUnits, setNearbyUnits] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    // VAPI voice integration
    const { isSessionActive, isSpeaking, messages: vapiMessages, volumeLevel, start, stop, receiveAgentMessage } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$hooks$2f$use$2d$vapi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useVapi"])();
    // Map center tracking for weather
    const [mapCenter, setMapCenter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const { weather, loading: weatherLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$hooks$2f$use$2d$weather$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWeather"])(mapCenter?.lat ?? null, mapCenter?.lon ?? null);
    // Poll for AI agent messages
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Reset mock data so units start available and no dispatches linger on hot reload
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resetMockState"])();
        let lastTimestamp = null;
        const pollAgentMessages = async ()=>{
            try {
                const url = lastTimestamp ? `/api/vapi-webhook?since=${encodeURIComponent(lastTimestamp)}` : '/api/vapi-webhook';
                const response = await fetch(url);
                const data = await response.json();
                if (data.messages && data.messages.length > 0) {
                    // Process each new message
                    data.messages.forEach((msg)=>{
                        receiveAgentMessage({
                            action: msg.action,
                            message: msg.message,
                            data: msg.data
                        });
                    });
                    // Update last timestamp
                    lastTimestamp = data.latest_timestamp;
                }
            } catch (error) {
                console.error('Error polling agent messages:', error);
            }
        };
        // Poll every 5 seconds
        const interval = setInterval(pollAgentMessages, 5000);
        pollAgentMessages(); // Initial poll
        return ()=>clearInterval(interval);
    }, [
        receiveAgentMessage
    ]);
    // Map navigation function
    const [navigateToIncident, setNavigateToIncident] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [leafletFlyTo, setLeafletFlyTo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // Map ready callback
    const handleMapReady = (navFunction)=>{
        setNavigateToIncident(()=>navFunction);
    };
    const handleLeafletReady = (fly)=>{
        setLeafletFlyTo(()=>fly);
    };
    // Map movement callback
    const handleMapMove = (center)=>{
        setMapCenter(center);
    };
    const calculateDistance = (lat1, lon1, lat2, lon2)=>{
        const R = 6371; // km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };
    const handleVoiceToggle = ()=>{
        if (isSessionActive) {
            stop();
        } else {
            start();
        }
    };
    const handleIncidentSelect = (incident)=>{
        if (!incident) {
            console.warn('No incident provided to handleIncidentSelect');
            return;
        }
        // Convert to PoliceIncident format with last_update
        const policeIncident = {
            id: typeof incident.id === 'string' ? incident.id : String(incident.id || ''),
            name: incident.name || null,
            priority: incident.priority || incident.risk || null,
            lat: incident.lat || null,
            lon: incident.lon || null,
            containment: incident.containment || null,
            last_update: incident.last_update || new Date().toISOString(),
            description: incident.description || null,
            incident_type: incident.incident_type || null
        };
        setSelectedIncident(policeIncident);
        if (policeIncident.lat && policeIncident.lon) {
            navigateToIncident?.(policeIncident);
            leafletFlyTo?.(policeIncident.lat, policeIncident.lon, 14);
        }
    };
    const handleSearch = ()=>{
        if (!searchInput.trim()) return;
        const coords = searchInput.split(',').map((s)=>parseFloat(s.trim()));
        if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
            leafletFlyTo?.(coords[0], coords[1], 14);
            navigateToIncident?.({
                lat: coords[0],
                lon: coords[1]
            });
            setLeafletSearch(searchInput);
            return;
        }
        const aliases = {
            'cmu': {
                lat: 40.4433,
                lon: -79.9436
            },
            'forbes': {
                lat: 40.4427,
                lon: -79.9425
            },
            'downtown': {
                lat: 40.4406,
                lon: -79.9959
            }
        };
        const key = searchInput.toLowerCase();
        if (aliases[key]) {
            const target = aliases[key];
            leafletFlyTo?.(target.lat, target.lon, 14);
            navigateToIncident?.({
                lat: target.lat,
                lon: target.lon
            });
            setLeafletSearch(`${target.lat},${target.lon}`);
        }
    };
    const handleUnitUpdate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (stats, activeUnits)=>{
        // Store global stats
        setAllUnitStats(stats);
        // If we have a selected incident, calculate stats for nearby police stations
        if (selectedIncident && activeUnits) {
            try {
                // Fetch all police stations with their unit stats
                const response = await fetch('/api/dispatch-unit');
                const data = await response.json();
                if (data.stats) {
                    // Calculate distance from incident to each station
                    const calculateDistance = (lat1, lon1, lat2, lon2)=>{
                        const R = 6371; // Earth's radius in km
                        const dLat = (lat2 - lat1) * Math.PI / 180;
                        const dLon = (lon2 - lon1) * Math.PI / 180;
                        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
                        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                        return R * c;
                    };
                    // Get police stations data
                    const stationsResponse = await fetch('/api/incident-state');
                    const stationsData = await stationsResponse.json();
                    const stations = stationsData.stations || [];
                    // Find stations within 100km of this incident
                    const nearbyStations = stations.filter((station)=>{
                        const distance = calculateDistance(selectedIncident.lat || 0, selectedIncident.lon || 0, station.lat, station.lon);
                        return distance <= 100; // 100km radius
                    });
                    // Calculate available units from nearby stations only
                    const nearbyStationIds = new Set(nearbyStations.map((s)=>s.id));
                    const availableNearby = data.stats.filter((s)=>nearbyStationIds.has(s.station_id)).reduce((sum, s)=>sum + (s.available_units || 0), 0);
                    // Filter for THIS incident
                    const incidentId = String(selectedIncident.id);
                    const forThisIncident = activeUnits.filter((u)=>String(u.incident_id) === incidentId);
                    const dispatched = forThisIncident.filter((u)=>u.status === 'dispatched' || u.status === 'en_route').length;
                    const active = forThisIncident.filter((u)=>u.status === 'on_scene').length;
                    // Calculate ETA for dispatched units
                    let eta = undefined;
                    if (dispatched > 0) {
                        // Find nearest station to incident
                        let minDistance = Infinity;
                        for (const station of nearbyStations){
                            const distance = calculateDistance(selectedIncident.lat || 0, selectedIncident.lon || 0, station.lat, station.lon);
                            if (distance < minDistance) {
                                minDistance = distance;
                            }
                        }
                        // Assume average speed of 60 mph (1 mile per minute)
                        // Convert km to miles and calculate minutes
                        const distanceMiles = minDistance * 0.621371;
                        const estimatedMinutes = Math.ceil(distanceMiles / 1.0); // 60 mph = 1 mile per minute
                        eta = `${estimatedMinutes} min`;
                    }
                    setUnitStats({
                        available: availableNearby,
                        dispatched: dispatched,
                        active: active,
                        eta: eta
                    });
                }
            } catch (error) {
                console.error('Error fetching incident-specific stats:', error);
                // Fallback to global stats
                setUnitStats(stats);
            }
        } else {
            // No incident selected, show global stats
            setUnitStats(stats);
        }
    }, [
        selectedIncident
    ]);
    // Update unit stats when selected incident changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Trigger a recalculation of stats for the new incident
        setRefreshUnitTrigger((prev)=>prev + 1);
    }, [
        selectedIncident?.id
    ]);
    // Compute nearby available units list for selected incident
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!selectedIncident) {
            setNearbyUnits([]);
            return;
        }
        const units = __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].__data?.units || [];
        const available = units.filter((u)=>u.status === 'available');
        const withDistance = available.map((u)=>({
                ...u,
                distanceKm: calculateDistance(selectedIncident.lat || 0, selectedIncident.lon || 0, u.current_lat, u.current_lon)
            }));
        setNearbyUnits(withDistance.sort((a, b)=>a.distanceKm - b.distanceKm).slice(0, 12));
    }, [
        selectedIncident
    ]);
    const handleIncidentClick = (incident)=>{
        // Validate incident object and coordinates before attempting navigation
        // Note: navigateToIncident will call onIncidentSelect which sets selectedIncident
        if (incident && incident.lat && incident.lon && !isNaN(incident.lat) && !isNaN(incident.lon) && incident.lat !== 0 && incident.lon !== 0 && navigateToIncident) {
            handleIncidentSelect(incident);
            navigateToIncident(incident);
            setLeafletSearch(`${incident.lat},${incident.lon}`);
        } else {
            console.warn('Cannot navigate to incident with invalid data:', {
                incident: incident ? incident.id : 'null',
                name: incident?.name,
                lat: incident?.lat,
                lon: incident?.lon
            });
        }
    };
    const handleEmergencyAlert = async ()=>{
        if (!selectedIncident) {
            setAlertStatus('Please select an incident first');
            setTimeout(()=>setAlertStatus(null), 3000);
            return;
        }
        setAlertSending(true);
        setAlertStatus(null);
        try {
            const response = await fetch('/api/send-emergency-alert', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    incident: selectedIncident
                })
            });
            const result = await response.json();
            if (result.success) {
                setAlertStatus(`Emergency alert sent successfully! Message ID: ${result.messageSid}`);
            } else {
                setAlertStatus(`Failed to send alert: ${result.error}`);
            }
        } catch (error) {
            console.error('Error sending emergency alert:', error);
            setAlertStatus('Failed to send emergency alert. Please try again.');
        } finally{
            setAlertSending(false);
            // Clear status after 5 seconds
            setTimeout(()=>setAlertStatus(null), 5000);
        }
    };
    const handleDispatchUnit = async ()=>{
        if (!selectedIncident) {
            console.warn('[UI] No incident selected');
            return;
        }
        if (unitStats.available === 0) {
            console.warn('[UI] No available units');
            return;
        }
        console.log('[UI] Dispatching unit for incident:', selectedIncident.id);
        setDispatchSending(true);
        try {
            const response = await fetch('/api/dispatch-unit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    incidentId: selectedIncident.id,
                    incidentLat: selectedIncident.lat,
                    incidentLon: selectedIncident.lon
                })
            });
            const result = await response.json();
            console.log('[UI] Dispatch response:', result);
            if (result.success) {
                console.log('[UI] ✅ Dispatch successful, refreshing unit data');
                // Trigger unit refresh
                setRefreshUnitTrigger((prev)=>prev + 1);
            } else {
                console.error('[UI] ❌ Dispatch failed:', result.error);
                console.error('[UI] Error details:', result.details);
                console.error('[UI] Full response:', result);
            }
        } catch (error) {
            console.error('[UI] Error dispatching unit:', error);
        } finally{
            setDispatchSending(false);
        }
    };
    // Calculate dynamic height based on actual incident count and content
    const calculateDynamicHeight = ()=>{
        if (incidentCount === 0) return 200 // Minimum height when no incidents
        ;
        // Calculate based on actual content - no extra padding at bottom:
        // - Header section: ~80px (title + padding)
        // - Each incident item: ~120px (actual content size)
        // - Space between items: 16px (space-y-4)
        // - Container padding: 48px (p-6 = 24px top + 24px bottom)
        const headerHeight = 80;
        const containerPadding = 48;
        const itemHeight = 120 // Actual content size
        ;
        const itemSpacing = 16;
        // Calculate exact height needed - no extra space
        const totalItemHeight = incidentCount * itemHeight;
        const totalSpacingHeight = Math.max(0, (incidentCount - 1) * itemSpacing);
        const exactContentHeight = headerHeight + containerPadding + totalItemHeight + totalSpacingHeight;
        // Set reasonable bounds
        const minHeight = 200;
        const maxHeight = 600;
        return Math.max(minHeight, Math.min(exactContentHeight, maxHeight));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-screen w-full flex flex-col overflow-hidden relative",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 z-0",
                children: viewMode === '3d' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$components$2f$california$2d$map$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    className: "w-full h-full",
                    onMapReady: handleMapReady,
                    onMapMove: handleMapMove,
                    windSpeed: weather?.wind.speed,
                    windDirection: weather?.wind.deg,
                    onIncidentSelect: handleIncidentSelect,
                    onUnitUpdate: handleUnitUpdate,
                    refreshUnitTrigger: refreshUnitTrigger,
                    selectedIncidentId: selectedIncident?.id || null
                }, void 0, false, {
                    fileName: "[project]/projects/tartanhacks/app/page.tsx",
                    lineNumber: 473,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$components$2f$leaflet$2d$map$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    onReady: handleLeafletReady,
                    searchTerm: leafletSearch,
                    refreshTrigger: refreshUnitTrigger
                }, void 0, false, {
                    fileName: "[project]/projects/tartanhacks/app/page.tsx",
                    lineNumber: 485,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                lineNumber: 471,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "relative h-16 glass-panel-interactive rounded-none border-b border-white/10 flex items-center justify-between px-8 shrink-0 z-20 fade-in",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-8 h-8 bg-[#3b82f6] rounded-lg flex items-center justify-center",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                            className: "w-5 h-5 text-white"
                                        }, void 0, false, {
                                            fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                            lineNumber: 498,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                        lineNumber: 497,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "text-xl font-semibold tracking-tight text-white",
                                        children: "Police Dispatch"
                                    }, void 0, false, {
                                        fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                        lineNumber: 500,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                lineNumber: 496,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm text-white/70 font-medium",
                                children: "Control Center"
                            }, void 0, false, {
                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                lineNumber: 502,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/projects/tartanhacks/app/page.tsx",
                        lineNumber: 495,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-2 h-2 rounded-full bg-[#00C2FF] cyan-glow"
                                    }, void 0, false, {
                                        fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                        lineNumber: 507,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm text-white/90 font-medium",
                                        children: "Operational"
                                    }, void 0, false, {
                                        fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                        lineNumber: 508,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                lineNumber: 506,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 text-white/70",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wind$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wind$3e$__["Wind"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                        lineNumber: 511,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm font-medium",
                                        children: weatherLoading ? "Loading..." : weather ? `${weather.wind.speed} mph ${weather.wind.direction}` : "15 mph NW"
                                    }, void 0, false, {
                                        fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                        lineNumber: 512,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                lineNumber: 510,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1 bg-white/5 rounded-lg px-2 py-1 border border-white/10",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        size: "sm",
                                        variant: viewMode === '3d' ? 'default' : 'ghost',
                                        onClick: ()=>setViewMode('3d'),
                                        children: "3D"
                                    }, void 0, false, {
                                        fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                        lineNumber: 523,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        size: "sm",
                                        variant: viewMode === '2d' ? 'default' : 'ghost',
                                        onClick: ()=>setViewMode('2d'),
                                        children: "2D"
                                    }, void 0, false, {
                                        fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                        lineNumber: 526,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                lineNumber: 522,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 bg-white/5 px-3 py-1 rounded-lg border border-white/10",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        className: "bg-transparent text-sm outline-none placeholder-white/60 w-40",
                                        placeholder: "Search: lat,lon or 'cmu'",
                                        value: searchInput,
                                        onChange: (e)=>setSearchInput(e.target.value),
                                        onKeyDown: (e)=>e.key === 'Enter' && handleSearch()
                                    }, void 0, false, {
                                        fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                        lineNumber: 531,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        size: "sm",
                                        variant: "secondary",
                                        onClick: handleSearch,
                                        children: "Go"
                                    }, void 0, false, {
                                        fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                        lineNumber: 538,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                lineNumber: 530,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/projects/tartanhacks/app/page.tsx",
                        lineNumber: 505,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                lineNumber: 494,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative flex-1 flex gap-6 p-6 overflow-hidden z-10 pointer-events-none",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                        className: "w-[320px] flex flex-col gap-4 pointer-events-auto",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "glass-panel rounded-xl fade-in",
                                children: activeIncidentsCollapsed ? /* Collapsed State */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-3 cursor-pointer hover:bg-white/5 transition-all duration-200",
                                    onClick: ()=>setActiveIncidentsCollapsed(false),
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                        className: "text-sm font-semibold text-white",
                                                        children: "Active Incidents"
                                                    }, void 0, false, {
                                                        fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                        lineNumber: 556,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                                        className: "bg-[#FF6B00]/20 text-[#FF6B00] border-0 text-xs font-medium px-2 py-1",
                                                        children: incidentCount
                                                    }, void 0, false, {
                                                        fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                        lineNumber: 557,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                lineNumber: 555,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__["ChevronUp"], {
                                                className: "w-4 h-4 text-white/60"
                                            }, void 0, false, {
                                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                lineNumber: 559,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                        lineNumber: 554,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                    lineNumber: 550,
                                    columnNumber: 15
                                }, this) : /* Expanded State */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-6 flex flex-col overflow-hidden",
                                    style: {
                                        minHeight: '200px',
                                        maxHeight: '420px',
                                        height: `${Math.min(calculateDynamicHeight(), 420)}px`
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between mb-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                    className: "text-base font-semibold text-white",
                                                    children: "Active Incidents"
                                                }, void 0, false, {
                                                    fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                    lineNumber: 573,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                                            className: "bg-[#FF6B00]/20 text-[#FF6B00] border-0 text-xs font-medium px-2 py-1",
                                                            children: incidentCount
                                                        }, void 0, false, {
                                                            fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                            lineNumber: 575,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                            onClick: ()=>setActiveIncidentsCollapsed(true),
                                                            size: "sm",
                                                            variant: "ghost",
                                                            className: "h-6 w-6 p-0 hover:bg-white/10 rounded-md transition-all duration-200",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minimize$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Minimize2$3e$__["Minimize2"], {
                                                                className: "w-3 h-3 text-white/60"
                                                            }, void 0, false, {
                                                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                lineNumber: 582,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                            lineNumber: 576,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                    lineNumber: 574,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                            lineNumber: 572,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex-1 overflow-y-auto hide-scrollbar",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$components$2f$IncidentsList$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                onIncidentClick: handleIncidentClick,
                                                onIncidentCountChange: setIncidentCount,
                                                onIncidentsUpdate: setCurrentIncidents
                                            }, void 0, false, {
                                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                lineNumber: 588,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                            lineNumber: 587,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                    lineNumber: 564,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                lineNumber: 547,
                                columnNumber: 11
                            }, this),
                            selectedIncident && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "glass-panel rounded-lg fade-in p-2 space-y-1.5 mt-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-1.5 mb-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs",
                                                children: "🚓"
                                            }, void 0, false, {
                                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                lineNumber: 603,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "text-[10px] font-semibold text-white",
                                                children: "Available Units"
                                            }, void 0, false, {
                                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                lineNumber: 604,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                        lineNumber: 602,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-3 gap-1 text-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-white/5 rounded p-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-base font-bold text-[#00FFB3] leading-none",
                                                        children: unitStats.available
                                                    }, void 0, false, {
                                                        fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                        lineNumber: 610,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-[9px] text-white/60 mt-0.5",
                                                        children: "Available"
                                                    }, void 0, false, {
                                                        fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                        lineNumber: 611,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                lineNumber: 609,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-white/5 rounded p-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-base font-bold text-[#FFA800] leading-none",
                                                        children: unitStats.dispatched
                                                    }, void 0, false, {
                                                        fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                        lineNumber: 614,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-[9px] text-white/60 mt-0.5",
                                                        children: "En Route"
                                                    }, void 0, false, {
                                                        fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                        lineNumber: 615,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                lineNumber: 613,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-white/5 rounded p-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-base font-bold text-[#FF6B00] leading-none",
                                                        children: unitStats.active
                                                    }, void 0, false, {
                                                        fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                        lineNumber: 618,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-[9px] text-white/60 mt-0.5",
                                                        children: "On Scene"
                                                    }, void 0, false, {
                                                        fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                        lineNumber: 619,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                lineNumber: 617,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                        lineNumber: 608,
                                        columnNumber: 15
                                    }, this),
                                    unitStats.eta && unitStats.dispatched > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-blue-500/10 border border-blue-400/20 rounded px-2 py-1 text-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[9px] text-blue-300/70",
                                                children: "ETA:"
                                            }, void 0, false, {
                                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                lineNumber: 626,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs font-bold text-blue-400 ml-1",
                                                children: unitStats.eta
                                            }, void 0, false, {
                                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                lineNumber: 627,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                        lineNumber: 625,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        onClick: handleDispatchUnit,
                                        disabled: dispatchSending || !selectedIncident || unitStats.available === 0,
                                        className: `w-full border-0 h-8 rounded-md text-[10px] font-semibold shadow-lg transition-all duration-200 ${selectedIncident && !dispatchSending && unitStats.available > 0 ? 'bg-gradient-to-r from-[#3b82f6] to-[#1e40af] hover:from-[#3b82f6]/90 hover:to-[#1e40af]/90 text-white hover:scale-[1.02]' : 'bg-white/10 text-white/40 cursor-not-allowed'}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                                className: "w-3 h-3 mr-1"
                                            }, void 0, false, {
                                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                lineNumber: 641,
                                                columnNumber: 17
                                            }, this),
                                            dispatchSending ? 'Dispatching...' : unitStats.available > 0 ? `Send Unit` : 'No Units'
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                        lineNumber: 632,
                                        columnNumber: 15
                                    }, this),
                                    nearbyUnits.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-2 space-y-1.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-[10px] uppercase tracking-wide text-white/50",
                                                children: "Nearest Available Units"
                                            }, void 0, false, {
                                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                lineNumber: 648,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-1",
                                                children: nearbyUnits.map((u)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center justify-between bg-white/5 border border-white/10 rounded-md px-2 py-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-xs text-white font-semibold",
                                                                children: u.unit_number || u.id
                                                            }, void 0, false, {
                                                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                lineNumber: 652,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-[10px] text-white/60",
                                                                children: [
                                                                    u.distanceKm.toFixed(1),
                                                                    " km"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                lineNumber: 655,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, u.id, true, {
                                                        fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                        lineNumber: 651,
                                                        columnNumber: 23
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                lineNumber: 649,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                        lineNumber: 647,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                lineNumber: 600,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$components$2f$transcript$2d$recorder$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                    fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                    lineNumber: 667,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                lineNumber: 666,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$components$2f$unit$2d$list$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                    fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                    lineNumber: 672,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                lineNumber: 671,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/projects/tartanhacks/app/page.tsx",
                        lineNumber: 545,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: "flex-1 relative pointer-events-none"
                    }, void 0, false, {
                        fileName: "[project]/projects/tartanhacks/app/page.tsx",
                        lineNumber: 677,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                        className: "w-[380px] h-[calc(100vh-8rem)] relative pointer-events-auto",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "glass-panel-interactive rounded-xl fade-in absolute top-0 right-0 w-full z-20",
                                children: aiAssistantCollapsed ? /* Collapsed State */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-3",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                        className: "text-sm font-semibold text-white",
                                                        children: "AI Assistant"
                                                    }, void 0, false, {
                                                        fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                        lineNumber: 690,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                        onClick: handleVoiceToggle,
                                                        size: "sm",
                                                        className: `transition-all duration-300 ${isSessionActive ? 'bg-[#FF6B00] hover:bg-[#FF6B00]/90 fire-glow' : 'bg-white/10 hover:bg-white/20'}`,
                                                        children: isSessionActive ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mic$2d$off$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MicOff$3e$__["MicOff"], {
                                                            className: "w-4 h-4 text-white"
                                                        }, void 0, false, {
                                                            fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                            lineNumber: 702,
                                                            columnNumber: 25
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Mic$3e$__["Mic"], {
                                                            className: "w-4 h-4 text-white"
                                                        }, void 0, false, {
                                                            fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                            lineNumber: 704,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                        lineNumber: 692,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                lineNumber: 689,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: `w-1.5 h-1.5 rounded-full ${isSessionActive ? 'bg-[#00C2FF] cyan-glow' : 'bg-white/20'}`
                                                            }, void 0, false, {
                                                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                lineNumber: 712,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-xs text-white/70 font-medium",
                                                                children: isSessionActive ? 'Live' : 'Offline'
                                                            }, void 0, false, {
                                                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                lineNumber: 713,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                        lineNumber: 711,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                        onClick: ()=>setAiAssistantCollapsed(false),
                                                        size: "sm",
                                                        variant: "ghost",
                                                        className: "h-6 w-6 p-0 hover:bg-white/10 rounded-md transition-all duration-200",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__["ChevronUp"], {
                                                            className: "w-3 h-3 text-white/60"
                                                        }, void 0, false, {
                                                            fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                            lineNumber: 723,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                        lineNumber: 717,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                lineNumber: 709,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                        lineNumber: 688,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                    lineNumber: 687,
                                    columnNumber: 15
                                }, this) : /* Expanded State */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-6 flex flex-col gap-4 h-[350px] overflow-hidden",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                    className: "text-base font-semibold text-white",
                                                    children: "AI Voice Assistant"
                                                }, void 0, false, {
                                                    fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                    lineNumber: 732,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                            onClick: handleVoiceToggle,
                                                            size: "sm",
                                                            className: `transition-all duration-300 ${isSessionActive ? 'bg-[#FF6B00] hover:bg-[#FF6B00]/90 fire-glow' : 'bg-white/10 hover:bg-white/20'}`,
                                                            children: isSessionActive ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mic$2d$off$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MicOff$3e$__["MicOff"], {
                                                                className: "w-4 h-4 text-white"
                                                            }, void 0, false, {
                                                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                lineNumber: 745,
                                                                columnNumber: 25
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Mic$3e$__["Mic"], {
                                                                className: "w-4 h-4 text-white"
                                                            }, void 0, false, {
                                                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                lineNumber: 747,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                            lineNumber: 735,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: `w-2 h-2 rounded-full ${isSessionActive ? 'bg-[#00C2FF] cyan-glow' : 'bg-white/20'}`
                                                                }, void 0, false, {
                                                                    fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                    lineNumber: 752,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs text-white/70 font-medium",
                                                                    children: isSessionActive ? 'Live' : 'Offline'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                    lineNumber: 753,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                            lineNumber: 751,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                            onClick: ()=>setAiAssistantCollapsed(true),
                                                            size: "sm",
                                                            variant: "ghost",
                                                            className: "h-6 w-6 p-0 hover:bg-white/10 rounded-md transition-all duration-200",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minimize$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Minimize2$3e$__["Minimize2"], {
                                                                className: "w-3 h-3 text-white/60"
                                                            }, void 0, false, {
                                                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                lineNumber: 762,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                            lineNumber: 756,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                    lineNumber: 733,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                            lineNumber: 731,
                                            columnNumber: 17
                                        }, this),
                                        isSessionActive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-3 px-4 py-2 bg-white/5 rounded-lg",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"], {
                                                    className: "w-4 h-4 text-[#00C2FF]"
                                                }, void 0, false, {
                                                    fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                    lineNumber: 770,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex-1 h-2 bg-white/10 rounded-full overflow-hidden",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "h-full bg-gradient-to-r from-[#00C2FF] to-[#00C2FF]/80 rounded-full transition-all duration-100",
                                                        style: {
                                                            width: `${Math.min(volumeLevel * 100, 100)}%`
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                        lineNumber: 772,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                    lineNumber: 771,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                            lineNumber: 769,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex-1 overflow-y-auto space-y-4 pr-2",
                                            children: vapiMessages.length > 0 || isSessionActive ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    vapiMessages.map((message, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: `space-y-3 ${index !== vapiMessages.length - 1 ? 'border-b border-white/10 pb-4' : ''}`,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-2",
                                                                    children: [
                                                                        message.role === 'assistant' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$volume$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Volume2$3e$__["Volume2"], {
                                                                            className: "w-4 h-4 text-[#00C2FF]"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                            lineNumber: 793,
                                                                            columnNumber: 31
                                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Mic$3e$__["Mic"], {
                                                                            className: "w-4 h-4 text-white/60"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                            lineNumber: 795,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-xs text-white/60 font-mono",
                                                                            children: message.timestamp
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                            lineNumber: 797,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                    lineNumber: 791,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm text-white/90 leading-relaxed font-medium",
                                                                    children: message.content
                                                                }, void 0, false, {
                                                                    fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                    lineNumber: 801,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, index, true, {
                                                            fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                            lineNumber: 785,
                                                            columnNumber: 25
                                                        }, this)),
                                                    isSpeaking && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-3 animate-pulse",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$volume$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Volume2$3e$__["Volume2"], {
                                                                        className: "w-4 h-4 text-[#00C2FF]"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                        lineNumber: 809,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-xs text-white/60 font-mono",
                                                                        children: "Now"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                        lineNumber: 810,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                lineNumber: 808,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm text-white/50 leading-relaxed font-medium italic",
                                                                children: "Speaking..."
                                                            }, void 0, false, {
                                                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                lineNumber: 812,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                        lineNumber: 807,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex-1 flex items-center justify-center",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-center space-y-4 max-w-md",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-16 h-16 mx-auto rounded-full bg-[#FF6B00] flex items-center justify-center",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__["Bot"], {
                                                                className: "w-8 h-8 text-white"
                                                            }, void 0, false, {
                                                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                lineNumber: 822,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                            lineNumber: 821,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-lg font-semibold text-white mb-2",
                                                                    children: "Welcome to Police Dispatch"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                    lineNumber: 825,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm text-white/70 mb-4",
                                                                    children: "Your AI-powered police dispatch assistant"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                    lineNumber: 828,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-left space-y-2 text-xs text-white/60",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-start gap-2",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-[#3b82f6] mt-0.5",
                                                                                    children: "•"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                                    lineNumber: 833,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    children: "Real-time incident monitoring and alerts"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                                    lineNumber: 834,
                                                                                    columnNumber: 31
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                            lineNumber: 832,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-start gap-2",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-[#3b82f6] mt-0.5",
                                                                                    children: "•"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                                    lineNumber: 837,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    children: "Live weather and environmental conditions"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                                    lineNumber: 838,
                                                                                    columnNumber: 31
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                            lineNumber: 836,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-start gap-2",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-[#3b82f6] mt-0.5",
                                                                                    children: "•"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                                    lineNumber: 841,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    children: "Voice-activated incident reporting"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                                    lineNumber: 842,
                                                                                    columnNumber: 31
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                            lineNumber: 840,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-start gap-2",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-[#3b82f6] mt-0.5",
                                                                                    children: "•"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                                    lineNumber: 845,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    children: "Unit dispatch and coordination"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                                    lineNumber: 846,
                                                                                    columnNumber: 31
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                            lineNumber: 844,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                    lineNumber: 831,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                            lineNumber: 824,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                    lineNumber: 820,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                lineNumber: 819,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                            lineNumber: 780,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                    lineNumber: 730,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                lineNumber: 684,
                                columnNumber: 11
                            }, this),
                            selectedIncident && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "glass-panel rounded-xl fade-in absolute top-[30px] right-0 w-full z-10",
                                children: environmentalConditionsCollapsed ? /* Collapsed State */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-3 cursor-pointer hover:bg-white/5 transition-all duration-200",
                                    onClick: ()=>setEnvironmentalConditionsCollapsed(false),
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-sm font-semibold text-white",
                                                children: "Environmental Conditions"
                                            }, void 0, false, {
                                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                lineNumber: 868,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__["ChevronUp"], {
                                                className: "w-4 h-4 text-white/60"
                                            }, void 0, false, {
                                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                lineNumber: 869,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                        lineNumber: 867,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                    lineNumber: 863,
                                    columnNumber: 15
                                }, this) : /* Expanded State */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-4 flex flex-col overflow-hidden h-[240px]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between mb-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-base font-semibold text-white",
                                                    children: "Environmental Conditions"
                                                }, void 0, false, {
                                                    fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                    lineNumber: 876,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                    onClick: ()=>setEnvironmentalConditionsCollapsed(true),
                                                    size: "sm",
                                                    variant: "ghost",
                                                    className: "h-6 w-6 p-0 hover:bg-white/10 rounded-md transition-all duration-200",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minimize$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Minimize2$3e$__["Minimize2"], {
                                                        className: "w-3 h-3 text-white/60"
                                                    }, void 0, false, {
                                                        fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                        lineNumber: 883,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                    lineNumber: 877,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                            lineNumber: 875,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex-1 overflow-hidden",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex gap-4 h-full",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex-1 space-y-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                className: "text-sm font-semibold text-white mb-3",
                                                                children: "Weather"
                                                            }, void 0, false, {
                                                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                lineNumber: 891,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "space-y-3",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex justify-between items-center",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-sm text-white/70 font-medium",
                                                                                children: "Humidity"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                                lineNumber: 894,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-base font-bold",
                                                                                style: {
                                                                                    color: weather ? getHumidityColor(weather.humidity) : '#00C2FF'
                                                                                },
                                                                                children: weatherLoading ? '...' : weather ? `${weather.humidity}%` : 'N/A'
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                                lineNumber: 895,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                        lineNumber: 893,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex justify-between items-center",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-sm text-white/70 font-medium",
                                                                                children: "Temperature"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                                lineNumber: 902,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-base font-bold",
                                                                                style: {
                                                                                    color: weather ? getTemperatureColor(weather.temp) : '#FF6B00'
                                                                                },
                                                                                children: weatherLoading ? '...' : weather ? `${weather.temp}°F` : 'N/A'
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                                lineNumber: 903,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                        lineNumber: 901,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex justify-between items-center",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-sm text-white/70 font-medium",
                                                                                children: "Visibility"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                                lineNumber: 910,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-base font-bold",
                                                                                style: {
                                                                                    color: weather?.visibility ? getVisibilityColor(weather.visibility) : '#00C2FF'
                                                                                },
                                                                                children: weatherLoading ? '...' : weather?.visibility ? getVisibilityLabel(weather.visibility) : 'N/A'
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                                lineNumber: 911,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                        lineNumber: 909,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex justify-between items-center",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-sm text-white/70 font-medium",
                                                                                children: "Air Quality"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                                lineNumber: 918,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-base font-bold",
                                                                                style: {
                                                                                    color: weather?.airQuality?.aqi ? getAirQualityColor(weather.airQuality.aqi) : '#FF4444'
                                                                                },
                                                                                children: weatherLoading ? '...' : weather?.airQuality?.aqi ? getAirQualityLabel(weather.airQuality.aqi) : 'N/A'
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                                lineNumber: 919,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                        lineNumber: 917,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                lineNumber: 892,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                        lineNumber: 890,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex-1 space-y-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                className: "text-sm font-semibold text-white mb-3",
                                                                children: "Risk Factors"
                                                            }, void 0, false, {
                                                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                lineNumber: 930,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "space-y-3",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex justify-between text-sm mb-1",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "text-white/70 font-medium",
                                                                                        children: "Fire Danger"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                                        lineNumber: 934,
                                                                                        columnNumber: 29
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "font-semibold text-[#FF4444]",
                                                                                        children: "Extreme"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                                        lineNumber: 935,
                                                                                        columnNumber: 29
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                                lineNumber: 933,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "h-1.5 bg-white/10 rounded-full overflow-hidden",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "h-full w-[95%] bg-gradient-to-r from-[#FF4444] to-[#FF4444]/80 rounded-full"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                                    lineNumber: 938,
                                                                                    columnNumber: 29
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                                lineNumber: 937,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                        lineNumber: 932,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex justify-between text-sm mb-1",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "text-white/70 font-medium",
                                                                                        children: "Fuel Moisture"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                                        lineNumber: 943,
                                                                                        columnNumber: 29
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "font-semibold text-[#FF6B00]",
                                                                                        children: "Critical"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                                        lineNumber: 944,
                                                                                        columnNumber: 29
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                                lineNumber: 942,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "h-1.5 bg-white/10 rounded-full overflow-hidden",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "h-full w-[88%] bg-gradient-to-r from-[#FF6B00] to-[#FF6B00]/80 rounded-full"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                                    lineNumber: 947,
                                                                                    columnNumber: 29
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                                lineNumber: 946,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                        lineNumber: 941,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                                lineNumber: 931,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                        lineNumber: 929,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                lineNumber: 888,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                            lineNumber: 887,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                    lineNumber: 874,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                lineNumber: 860,
                                columnNumber: 11
                            }, this),
                            selectedIncident && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute bottom-0 right-0 w-full z-30 space-y-2",
                                children: [
                                    alertStatus && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `p-3 rounded-lg text-xs font-medium animate-in slide-in-from-bottom-2 ${alertStatus.includes('successfully') ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`,
                                        children: [
                                            alertStatus.includes('successfully') ? '✓ ' : '✗ ',
                                            alertStatus.replace('Emergency alert sent successfully! Message ID: ', 'Alert sent! SID: ')
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                        lineNumber: 964,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        onClick: handleEmergencyAlert,
                                        disabled: alertSending || !selectedIncident,
                                        className: `w-full border-0 h-12 rounded-xl font-semibold shadow-lg transition-all duration-200 ${selectedIncident && !alertSending ? 'bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white hover:scale-[1.02]' : 'bg-white/10 text-white/40 cursor-not-allowed'}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                className: "w-5 h-5 mr-2"
                                            }, void 0, false, {
                                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                                lineNumber: 984,
                                                columnNumber: 15
                                            }, this),
                                            alertSending ? 'Sending Alert...' : selectedIncident ? `Alert: ${selectedIncident.name}` : 'Select Incident First'
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                        lineNumber: 975,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                                lineNumber: 961,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/projects/tartanhacks/app/page.tsx",
                        lineNumber: 682,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/projects/tartanhacks/app/page.tsx",
                lineNumber: 543,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/projects/tartanhacks/app/page.tsx",
        lineNumber: 469,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__660e5620._.js.map