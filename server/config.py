import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env from project root (one level up from server/)
load_dotenv(Path(__file__).resolve().parent.parent / ".env")

DEDALUS_API_KEY = os.getenv("DEDALUS_API_KEY", "")
FLASK_PORT = int(os.getenv("FLASK_PORT", "5001"))
FLASK_DEBUG = os.getenv("FLASK_DEBUG", "true").lower() == "true"
