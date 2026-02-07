"""PANOPTICON Flask Backend — AI-powered dispatch with Dedalus SDK."""

from flask import Flask, jsonify
from flask_cors import CORS
from .config import FLASK_PORT, FLASK_DEBUG
from .routes.dispatch import dispatch_bp
from .routes.bodycam import bodycam_bp
from .routes.reports import reports_bp
from .routes.state import state_bp


def create_app():
    app = Flask(__name__)
    CORS(app, origins=["http://localhost:5173", "http://127.0.0.1:5173"])

    app.register_blueprint(dispatch_bp)
    app.register_blueprint(bodycam_bp)
    app.register_blueprint(reports_bp)
    app.register_blueprint(state_bp)

    @app.route("/api/health")
    def health():
        return jsonify({"status": "ok", "service": "panopticon-ai"})

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=FLASK_PORT, debug=FLASK_DEBUG)
