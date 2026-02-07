from flask import Blueprint, request, jsonify
from ..ai.bodycam_ai import analyze_frame_sync
from .. import store

bodycam_bp = Blueprint("bodycam", __name__)


@bodycam_bp.route("/api/bodycam/analyze", methods=["POST"])
def analyze_bodycam():
    """AI vision analysis of a bodycam video frame."""
    data = request.get_json(force=True)
    frame = data.get("frame", "")
    context = data.get("context", {})

    if not frame:
        return jsonify({"error": "No frame provided"}), 400

    analysis = analyze_frame_sync(frame, context)

    # Store for report generation
    store.state["bodycam_analyses"].append(analysis)
    # Keep only last 20
    if len(store.state["bodycam_analyses"]) > 20:
        store.state["bodycam_analyses"] = store.state["bodycam_analyses"][-20:]

    return jsonify({"analysis": analysis})
