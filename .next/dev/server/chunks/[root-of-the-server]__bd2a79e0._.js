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
"[project]/projects/tartanhacks/app/api/vapi-webhook/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projects/tartanhacks/node_modules/next/server.js [app-route] (ecmascript)");
;
// In-memory store for agent messages (for SSE streaming)
// In production, use Redis or similar
let agentMessages = [];
const MAX_MESSAGES = 100;
async function POST(request) {
    try {
        const body = await request.json();
        const { action, message, data } = body;
        if (!action || !message) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Missing required fields: action and message are required'
            }, {
                status: 400
            });
        }
        // Store message with timestamp
        const agentMessage = {
            action,
            message,
            data,
            timestamp: new Date().toISOString()
        };
        agentMessages.push(agentMessage);
        // Keep only last 100 messages
        if (agentMessages.length > MAX_MESSAGES) {
            agentMessages = agentMessages.slice(-MAX_MESSAGES);
        }
        console.log(`[VAPI Webhook] Received ${action}: ${message}`);
        return __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: 'Agent message received',
            queued: agentMessages.length
        });
    } catch (error) {
        console.error('VAPI webhook error:', error);
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
        const url = new URL(request.url);
        const since = url.searchParams.get('since');
        let messages = agentMessages;
        // Filter by timestamp if provided
        if (since) {
            const sinceDate = new Date(since);
            messages = messages.filter((msg)=>new Date(msg.timestamp) > sinceDate);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            messages,
            count: messages.length,
            latest_timestamp: messages.length > 0 ? messages[messages.length - 1].timestamp : null
        });
    } catch (error) {
        console.error('Error fetching VAPI messages:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to fetch messages',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__bd2a79e0._.js.map