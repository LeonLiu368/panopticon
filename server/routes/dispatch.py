from flask import Blueprint, request, jsonify
from ..ai.dispatch_ai import parse_command_sync

dispatch_bp = Blueprint("dispatch", __name__)


@dispatch_bp.route("/api/dispatch/parse", methods=["POST"])
def parse_dispatch():
    """AI-powered voice command parsing with tool calling + model handoffs."""
    data = request.get_json(force=True)
    transcript = data.get("transcript", "")

    if not transcript.strip():
        return jsonify({"error": "No transcript provided"}), 400

    # Update store with current frontend state so tools have fresh data
    from .. import store
    if "units" in data:
        store.state["units"] = data["units"]
    if "crime_zones" in data:
        store.state["crime_zones"] = data["crime_zones"]
    if "markers" in data:
        store.state["markers"] = data.get("markers", [])

    result = parse_command_sync(transcript)
    return jsonify(result)
