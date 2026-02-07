from flask import Blueprint, request, jsonify
from .. import store

state_bp = Blueprint("state", __name__)


@state_bp.route("/api/state/sync", methods=["POST"])
def sync_state():
    """Receive current frontend state so AI endpoints have fresh context."""
    data = request.get_json(force=True)

    for key in ("units", "crime_zones", "dispatches", "markers", "transcript"):
        if key in data:
            store.state[key] = data[key]

    return jsonify({"ok": True})
