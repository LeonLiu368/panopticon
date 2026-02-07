"""AI Incident Report Generation — uses Dedalus SDK with model handoffs."""

import asyncio
import json
from dedalus_labs import AsyncDedalus, DedalusRunner
from .prompts import REPORT_SYSTEM_PROMPT
from .. import store

client = AsyncDedalus()
runner = DedalusRunner(client)


def get_dispatch_history() -> str:
    """Get the full history of all dispatches including status and involved units."""
    dispatches = store.state.get("dispatches", [])
    zones = store.state.get("crime_zones", [])
    units = store.state.get("units", [])

    result = []
    for d in dispatches:
        unit = next((u for u in units if u["id"] == d.get("unitId")), {})
        zone = next((z for z in zones if z["id"] == d.get("crimeId")), {})
        result.append({
            "dispatch_id": d.get("id"),
            "unit": unit.get("name", d.get("unitId")),
            "crime_zone": zone.get("name", d.get("crimeId")),
            "status": d.get("status"),
            "eta_seconds": d.get("etaSeconds"),
        })
    return json.dumps(result)


def get_transcript_log() -> str:
    """Get the voice transcript log from the dispatch session."""
    return json.dumps(store.state.get("transcript", []))


def get_bodycam_analyses() -> str:
    """Get all bodycam AI analysis results from the session."""
    return json.dumps(store.state.get("bodycam_analyses", []))


async def generate_report(data: dict) -> dict:
    """Generate an incident report using model handoffs + tools."""
    # Update store with latest data from frontend
    if "dispatches" in data:
        store.state["dispatches"] = data["dispatches"]
    if "transcript" in data:
        store.state["transcript"] = data["transcript"]

    context = f"""Generate a professional law enforcement incident report based on the following dispatch session data.

Dispatches: {json.dumps(data.get('dispatches', []))}
Transcript entries: {json.dumps(data.get('transcript', []))}
Bodycam analyses: {json.dumps(store.state.get('bodycam_analyses', []))}
Crime zones: {json.dumps(data.get('crime_zones', []))}
Units: {json.dumps(data.get('units', []))}

Generate a complete incident report in JSON format."""

    result = await runner.run(
        input=context,
        # Use strong model for report writing quality
        model=["anthropic/claude-sonnet-4-20250514", "openai/gpt-4o-mini"],
        tools=[get_dispatch_history, get_transcript_log, get_bodycam_analyses],
        max_steps=5,
        instructions=REPORT_SYSTEM_PROMPT,
    )

    output = result.final_output if hasattr(result, "final_output") else str(result)

    try:
        clean = output.strip()
        if clean.startswith("```"):
            clean = clean.split("\n", 1)[1] if "\n" in clean else clean[3:]
            clean = clean.rsplit("```", 1)[0]
        return json.loads(clean)
    except (json.JSONDecodeError, IndexError):
        return {
            "title": "Incident Report",
            "narrative": output,
            "timeline": [],
            "units_involved": [],
            "evidence_notes": "",
            "recommendations": [],
            "status": "preliminary",
        }


def generate_report_sync(data: dict) -> dict:
    """Synchronous wrapper for Flask."""
    return asyncio.run(generate_report(data))
