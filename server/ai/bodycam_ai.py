"""AI Bodycam Frame Analysis — uses Dedalus SDK vision capabilities."""

import asyncio
import json
from dedalus_labs import AsyncDedalus
from .prompts import BODYCAM_SYSTEM_PROMPT

client = AsyncDedalus()


async def analyze_frame(frame_base64: str, context: dict) -> dict:
    """Analyze a bodycam video frame using vision model."""
    unit_name = context.get("unit_name", "Unknown Unit")
    crime_zone = context.get("crime_zone", "Unknown Location")

    messages = [
        {"role": "system", "content": BODYCAM_SYSTEM_PROMPT},
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": f"Analyze this bodycam frame from {unit_name} responding to {crime_zone}.",
                },
                {
                    "type": "image_url",
                    "image_url": {"url": frame_base64},
                },
            ],
        },
    ]

    # Use a vision-capable model via Dedalus
    completion = await client.chat.completions.create(
        model="anthropic/claude-sonnet-4-20250514",
        messages=messages,
        max_tokens=500,
    )

    text = completion.choices[0].message.content
    # Parse JSON from response
    try:
        # Strip markdown code fences if present
        clean = text.strip()
        if clean.startswith("```"):
            clean = clean.split("\n", 1)[1] if "\n" in clean else clean[3:]
            clean = clean.rsplit("```", 1)[0]
        return json.loads(clean)
    except (json.JSONDecodeError, IndexError):
        return {
            "scene_description": text[:200] if text else "Analysis unavailable",
            "person_count": 0,
            "threat_level": "unknown",
            "observations": [text[:300]] if text else ["Could not parse analysis"],
            "recommended_actions": ["Manual assessment recommended"],
        }


def analyze_frame_sync(frame_base64: str, context: dict) -> dict:
    """Synchronous wrapper for Flask."""
    return asyncio.run(analyze_frame(frame_base64, context))
