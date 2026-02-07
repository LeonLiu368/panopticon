from flask import Blueprint, request, jsonify
from ..ai.report_ai import generate_report_sync
from .. import store
import uuid
from datetime import datetime

reports_bp = Blueprint("reports", __name__)


@reports_bp.route("/api/reports/generate", methods=["POST"])
def generate_report():
    """AI-generated incident report from dispatch session data."""
    data = request.get_json(force=True)

    report = generate_report_sync(data)
    report["id"] = f"rpt-{uuid.uuid4().hex[:8]}"
    report["generated_at"] = datetime.utcnow().isoformat() + "Z"

    store.state["reports"].append(report)
    return jsonify({"report": report})
