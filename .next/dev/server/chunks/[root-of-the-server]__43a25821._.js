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
"[project]/projects/tartanhacks/app/api/weather/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projects/tartanhacks/node_modules/next/server.js [app-route] (ecmascript)");
;
async function GET(request) {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    if (!lat || !lon) {
        console.error('Weather API: Missing parameters', {
            lat,
            lon
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Missing latitude or longitude'
        }, {
            status: 400
        });
    }
    // Validate coordinates
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    if (isNaN(latitude) || isNaN(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
        console.error('Weather API: Invalid coordinates', {
            lat,
            lon
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Invalid latitude or longitude values'
        }, {
            status: 400
        });
    }
    try {
        console.log(`Weather API: Fetching data for coordinates: ${lat}, ${lon}`);
        // Using Open-Meteo API (free, no API key required)
        // Fetching current weather with wind speed, direction, temperature, humidity, and visibility
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,visibility&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto`;
        const controller = new AbortController();
        const timeoutId = setTimeout(()=>controller.abort(), 10000); // 10 second timeout
        const weatherResponse = await fetch(weatherUrl, {
            signal: controller.signal,
            next: {
                revalidate: 300
            },
            headers: {
                'Accept': 'application/json'
            }
        }).finally(()=>clearTimeout(timeoutId));
        if (!weatherResponse.ok) {
            const errorText = await weatherResponse.text();
            console.error(`Weather API error: ${weatherResponse.status} ${weatherResponse.statusText}`, errorText);
            throw new Error(`Open-Meteo API returned ${weatherResponse.status}: ${errorText}`);
        }
        const weatherData = await weatherResponse.json();
        if (!weatherData.current) {
            console.error('Weather API: Missing current data in response', weatherData);
            throw new Error('Invalid weather data structure received');
        }
        const current = weatherData.current;
        // Fetch Air Quality data from Open-Meteo Air Quality API (non-blocking)
        let airQuality = null;
        try {
            const airQualityUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm2_5,pm10&timezone=auto`;
            const aqController = new AbortController();
            const aqTimeoutId = setTimeout(()=>aqController.abort(), 5000); // 5 second timeout for air quality
            const airQualityResponse = await fetch(airQualityUrl, {
                signal: aqController.signal,
                next: {
                    revalidate: 300
                },
                headers: {
                    'Accept': 'application/json'
                }
            }).finally(()=>clearTimeout(aqTimeoutId));
            if (airQualityResponse.ok) {
                const airQualityData = await airQualityResponse.json();
                if (airQualityData.current) {
                    airQuality = {
                        aqi: airQualityData.current.us_aqi || null,
                        pm2_5: airQualityData.current.pm2_5 || null,
                        pm10: airQualityData.current.pm10 || null
                    };
                }
            } else {
                console.warn('Air Quality API failed (non-critical):', airQualityResponse.status);
            }
        } catch (airQualityError) {
            console.warn('Air Quality API error (non-critical):', airQualityError);
        // Continue without air quality data
        }
        // Extract relevant weather information
        const completeWeatherData = {
            wind: {
                speed: Math.round(current.wind_speed_10m || 0),
                deg: current.wind_direction_10m || 0,
                direction: getWindDirection(current.wind_direction_10m || 0)
            },
            temp: Math.round(current.temperature_2m || 0),
            humidity: current.relative_humidity_2m || 0,
            visibility: current.visibility ? Math.round(current.visibility / 1609.34) : null,
            airQuality: airQuality,
            description: getWeatherDescription(current.weather_code || 0),
            location: 'Current Location'
        };
        console.log('Weather API: Successfully fetched data', {
            temp: completeWeatherData.temp,
            humidity: completeWeatherData.humidity
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(completeWeatherData);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        // Check if it's an abort error (timeout)
        if (error instanceof Error && error.name === 'AbortError') {
            console.error('Weather API timeout:', errorMessage);
            return __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Weather service timeout',
                details: 'The weather service took too long to respond. Please try again.'
            }, {
                status: 504
            });
        }
        console.error('Error fetching weather data:', errorMessage, error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$projects$2f$tartanhacks$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to fetch weather data',
            details: errorMessage
        }, {
            status: 500
        });
    }
}
// Helper function to convert wind degrees to cardinal direction
function getWindDirection(degrees) {
    const directions = [
        'N',
        'NNE',
        'NE',
        'ENE',
        'E',
        'ESE',
        'SE',
        'SSE',
        'S',
        'SSW',
        'SW',
        'WSW',
        'W',
        'WNW',
        'NW',
        'NNW'
    ];
    const index = Math.round(degrees % 360 / 22.5);
    return directions[index % 16];
}
// Helper function to convert Open-Meteo weather codes to descriptions
function getWeatherDescription(code) {
    const weatherCodes = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Foggy',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        71: 'Slight snow',
        73: 'Moderate snow',
        75: 'Heavy snow',
        77: 'Snow grains',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        85: 'Slight snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with slight hail',
        99: 'Thunderstorm with heavy hail'
    };
    return weatherCodes[code] || 'Unknown';
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__43a25821._.js.map