"""AI Dispatch Intelligence — uses Dedalus SDK with local tools + model handoffs."""

import asyncio
import json
import math
from dedalus_labs import AsyncDedalus, DedalusRunner
from .prompts import DISPATCH_SYSTEM_PROMPT
from .. import store

client = AsyncDedalus()
runner = DedalusRunner(client)


def _haversine(lat1, lng1, lat2, lng2):
    R = 6371000
    p = math.pi / 180
    a = (
        0.5
        - math.cos((lat2 - lat1) * p) / 2
        + math.cos(lat1 * p) * math.cos(lat2 * p) * (1 - math.cos((lng2 - lng1) * p)) / 2
    )
    return R * 2 * math.asin(math.sqrt(a))


# ── Local Tools (Dedalus Tool Calling Prize) ──────────────────────────

def list_available_units() -> str:
    """List all police units and their current status, position, and type."""
    units = store.state.get("units", [])
    result = []
    for u in units:
        result.append({
            "id": u["id"],
            "name": u["name"],
            "status": u["status"],
            "lat": u["lat"],
            "lng": u["lng"],
        })
    return json.dumps(result)


def get_unit_status(unit_id: str) -> str:
    """Get the current status and position of a specific police unit by its ID."""
    units = store.state.get("units", [])
    unit = next((u for u in units if u["id"] == unit_id), None)
    if not unit:
        return json.dumps({"error": f"Unit {unit_id} not found"})
    return json.dumps(unit)


def get_crime_zone_details(zone_id: str) -> str:
    """Get details about a specific crime zone / incident by its ID."""
    zones = store.state.get("crime_zones", [])
    zone = next((z for z in zones if z["id"] == zone_id), None)
    if not zone:
        return json.dumps({"error": f"Zone {zone_id} not found"})
    return json.dumps(zone)


def find_nearest_unit(target_id: str, unit_type: str = None) -> str:
    """Find the nearest available police unit to a crime zone or marker.
    Args:
        target_id: The ID of the crime zone or marker to find nearest unit for.
        unit_type: Optional filter like 'K9', 'Bike', 'Traffic'. Leave empty for any type.
    Returns: JSON with the nearest unit details and distance.
    """
    zones = store.state.get("crime_zones", [])
    markers = store.state.get("markers", [])
    units = store.state.get("units", [])

    target = next((z for z in zones if z["id"] == target_id), None)
    if not target:
        target = next((m for m in markers if m["id"] == target_id), None)
    if not target:
        return json.dumps({"error": f"Target {target_id} not found"})

    available = [u for u in units if u["status"] in ("available", "standby")]
    if unit_type:
        type_lower = unit_type.lower()
        typed = [u for u in available if type_lower in u["name"].lower()]
        if typed:
            available = typed

    if not available:
        return json.dumps({"error": "No available units"})

    for u in available:
        u["_distance"] = _haversine(u["lat"], u["lng"], target["lat"], target["lng"])

    nearest = min(available, key=lambda u: u["_distance"])
    return json.dumps({
        "unit_id": nearest["id"],
        "unit_name": nearest["name"],
        "distance_meters": round(nearest["_distance"]),
        "status": nearest["status"],
        "target_id": target_id,
        "target_name": target.get("name", target.get("label", target_id)),
    })


def dispatch_unit(unit_id: str, target_id: str) -> str:
    """Dispatch a police unit to a crime zone or marker. This assigns the unit to respond.
    Args:
        unit_id: The ID of the unit to dispatch (e.g. 'u-14').
        target_id: The ID of the crime zone or marker to dispatch to (e.g. 'cz-04').
    Returns: JSON confirmation of the dispatch action.
    """
    units = store.state.get("units", [])
    zones = store.state.get("crime_zones", [])
    markers = store.state.get("markers", [])

    unit = next((u for u in units if u["id"] == unit_id), None)
    target = next((z for z in zones if z["id"] == target_id), None)
    target_type = "crime"
    if not target:
        target = next((m for m in markers if m["id"] == target_id), None)
        target_type = "marker"

    if not unit:
        return json.dumps({"error": f"Unit {unit_id} not found"})
    if not target:
        return json.dumps({"error": f"Target {target_id} not found"})

    distance = _haversine(unit["lat"], unit["lng"], target["lat"], target["lng"])
    eta_seconds = distance / 17  # ~38 mph average

    return json.dumps({
        "action": "dispatch",
        "unit_id": unit_id,
        "unit_name": unit["name"],
        "target_id": target_id,
        "target_name": target.get("name", target.get("label", target_id)),
        "target_type": target_type,
        "distance_meters": round(distance),
        "eta_seconds": round(eta_seconds),
        "reasoning": f"{unit['name']} dispatched to {target.get('name', target_id)}. Distance: {distance/1000:.1f}km, ETA: {eta_seconds/60:.0f} min.",
    })


def navigate_to_location(target_name: str) -> str:
    """Navigate the map view to a specific crime zone, unit, or marker by name.
    Args:
        target_name: The name to search for (crime zone name, unit name, or marker label).
    Returns: JSON with the coordinates to navigate to.
    """
    zones = store.state.get("crime_zones", [])
    units = store.state.get("units", [])
    markers = store.state.get("markers", [])

    search = target_name.lower()
    candidates = (
        [{"type": "crime", "id": z["id"], "name": z["name"], "lat": z["lat"], "lng": z["lng"]} for z in zones]
        + [{"type": "unit", "id": u["id"], "name": u["name"], "lat": u["lat"], "lng": u["lng"]} for u in units]
        + [{"type": "marker", "id": m["id"], "name": m.get("label", ""), "lat": m["lat"], "lng": m["lng"]} for m in markers]
    )

    # Score by substring match then similarity
    best = None
    best_score = 0
    for c in candidates:
        name_lower = c["name"].lower()
        if search in name_lower or name_lower in search:
            score = 1.0
        else:
            # Bigram similarity
            def bigrams(s):
                return [s[i:i+2] for i in range(len(s)-1)]
            a_bg, b_bg = bigrams(search), bigrams(name_lower)
            if not a_bg or not b_bg:
                score = 0
            else:
                overlap = sum(1 for bg in a_bg if bg in b_bg)
                score = (2 * overlap) / (len(a_bg) + len(b_bg))
        if score > best_score:
            best_score = score
            best = c

    if best and best_score > 0.2:
        return json.dumps({
            "action": "navigate",
            "target_type": best["type"],
            "target_id": best["id"],
            "target_name": best["name"],
            "lat": best["lat"],
            "lng": best["lng"],
        })
    return json.dumps({"error": f"Could not find location matching '{target_name}'"})


ALL_TOOLS = [
    list_available_units,
    get_unit_status,
    get_crime_zone_details,
    find_nearest_unit,
    dispatch_unit,
    navigate_to_location,
]


async def parse_command(transcript: str) -> dict:
    """Parse a voice command using Dedalus with model handoffs + local tools."""
    import re

    # Build context message
    units_summary = json.dumps(store.state.get("units", []), indent=None)
    crimes_summary = json.dumps(store.state.get("crime_zones", []), indent=None)

    context = f"""CURRENT STATE:
Units: {units_summary}
Crime Zones: {crimes_summary}

DISPATCHER SAID: "{transcript}"

Use the tools to execute the dispatcher's command. Call the appropriate tool(s), then give a brief confirmation.
IMPORTANT: After calling tools, include the full JSON result from dispatch_unit or navigate_to_location in your final response so it can be parsed."""

    result = await runner.run(
        input=context,
        # Model handoffs: fast model for parsing, strong model for complex reasoning
        model=["openai/gpt-4o-mini", "anthropic/claude-sonnet-4-20250514"],
        tools=ALL_TOOLS,
        max_steps=5,
        instructions=DISPATCH_SYSTEM_PROMPT,
    )

    # Parse the tool call results from the final output
    output = result.final_output if hasattr(result, "final_output") else str(result)

    # Try to extract structured dispatch/navigate actions from tool results
    # Clean the AI message — strip JSON blocks from display text
    clean_message = output
    if clean_message:
        clean_message = re.sub(r'```json\s*\{[^`]*\}\s*```', '', clean_message).strip()
        clean_message = re.sub(r'```\s*\{[^`]*\}\s*```', '', clean_message).strip()
        # Remove trailing "Here is the JSON..." sentences
        clean_message = re.sub(r'Here is the JSON[^.]*\.?\s*$', '', clean_message).strip()

    response = {
        "intent": "unknown",
        "ai_message": clean_message or output,
        "parsed": None,
    }

    # Check runner attributes for tool results
    for attr in ("tool_results", "steps", "messages", "raw_messages"):
        items = getattr(result, attr, None)
        if not items or response["parsed"]:
            continue
        if isinstance(items, list):
            for item in items:
                # Could be a string, dict, or object with content
                text = None
                if isinstance(item, str):
                    text = item
                elif isinstance(item, dict):
                    text = item.get("content") or item.get("output") or json.dumps(item)
                elif hasattr(item, "content"):
                    text = str(item.content)
                if not text:
                    continue
                # Try to find JSON with "action" key
                for match in re.finditer(r'\{[^{}]*"action"\s*:\s*"[^"]+?"[^{}]*\}', text):
                    try:
                        data = json.loads(match.group())
                        if data.get("action") == "dispatch":
                            response["intent"] = "dispatch"
                            response["parsed"] = data
                            break
                        elif data.get("action") == "navigate":
                            response["intent"] = "navigate"
                            response["parsed"] = data
                            break
                    except json.JSONDecodeError:
                        pass

    # Fallback: try to parse action from the AI's final text output
    if not response["parsed"] and output:
        # Find ALL JSON objects in the output
        for match in re.finditer(r'\{[^{}]*\}', output):
            try:
                data = json.loads(match.group())
                if data.get("action") == "dispatch":
                    response["intent"] = "dispatch"
                    response["parsed"] = data
                    break
                elif data.get("action") == "navigate":
                    response["intent"] = "navigate"
                    response["parsed"] = data
                    break
            except json.JSONDecodeError:
                pass

    # Last resort: extract unit/target IDs from text and match against store
    if not response["parsed"] and output:
        lower = output.lower()
        units_data = store.state.get("units", [])
        zones_data = store.state.get("crime_zones", [])

        matched_unit = None
        matched_zone = None
        for u in units_data:
            if u["name"].lower() in lower or u["id"] in lower:
                matched_unit = u
                break
        for z in zones_data:
            if z["name"].lower() in lower or z["id"] in lower:
                matched_zone = z
                break

        if matched_unit and matched_zone:
            dist = _haversine(matched_unit["lat"], matched_unit["lng"], matched_zone["lat"], matched_zone["lng"])
            response["intent"] = "dispatch"
            response["parsed"] = {
                "action": "dispatch",
                "unit_id": matched_unit["id"],
                "unit_name": matched_unit["name"],
                "target_id": matched_zone["id"],
                "target_name": matched_zone["name"],
                "target_type": "crime",
                "distance_meters": round(dist),
                "eta_seconds": round(dist / 17),
                "reasoning": output[:200],
            }
        elif matched_zone and not matched_unit:
            response["intent"] = "navigate"
            response["parsed"] = {
                "action": "navigate",
                "target_type": "crime",
                "target_id": matched_zone["id"],
                "target_name": matched_zone["name"],
                "lat": matched_zone["lat"],
                "lng": matched_zone["lng"],
            }
        elif "dispatch" in lower or "sent" in lower or "sending" in lower:
            response["intent"] = "dispatch"
        elif "navigat" in lower or "focusing" in lower or "showing" in lower:
            response["intent"] = "navigate"

    return response


def parse_command_sync(transcript: str) -> dict:
    """Synchronous wrapper for Flask."""
    return asyncio.run(parse_command(transcript))
