"""In-memory state store. Frontend pushes state here so AI endpoints have context."""

state = {
    "units": [],
    "crime_zones": [],
    "dispatches": [],
    "markers": [],
    "transcript": [],
    "reports": [],
    "bodycam_analyses": [],
}
