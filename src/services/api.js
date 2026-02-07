const API_BASE = '/api';

export async function parseVoiceCommand(transcript, units, crimeZones, markers) {
  const res = await fetch(`${API_BASE}/dispatch/parse`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      transcript,
      units,
      crime_zones: crimeZones,
      markers,
    }),
  });
  if (!res.ok) throw new Error(`AI parse failed: ${res.status}`);
  return res.json();
}

export async function analyzeBodycamFrame(frameBase64, context) {
  const res = await fetch(`${API_BASE}/bodycam/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ frame: frameBase64, context }),
  });
  if (!res.ok) throw new Error(`Bodycam analysis failed: ${res.status}`);
  return res.json();
}

export async function generateIncidentReport(data) {
  const res = await fetch(`${API_BASE}/reports/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Report generation failed: ${res.status}`);
  return res.json();
}

export async function syncState(state) {
  try {
    await fetch(`${API_BASE}/state/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state),
    });
  } catch {
    // Silent fail — state sync is non-critical
  }
}
