import { useMemo, useState } from 'react';
import { formatDuration, haversineDistance } from '../utils/geo';

const defaultStart = { lat: 40.4406, lng: -79.9959 };

export default function DispatchPanel({
  markers,
  onAdd,
  onRemove,
  onComputeTime,
  timeResult,
  stats,
  crimeZones,
  selectedCrimeId,
  onSelectCrime,
  units,
  onAssign,
  dispatches,
  onUpdateDispatch,
}) {
  const [manualMarker, setManualMarker] = useState({ label: 'Flag', priority: 'high', lat: 40.44, lng: -79.99 });
  const [timeInputs, setTimeInputs] = useState({
    start: defaultStart,
    end: { lat: 40.45, lng: -79.98 },
  });
  const [etaUnitId, setEtaUnitId] = useState('');
  const [etaCrimeId, setEtaCrimeId] = useState(selectedCrimeId);

  const quickStats = useMemo(
    () => [
      { label: 'Open Calls', value: stats.openCalls },
      { label: 'Units Active', value: stats.unitsActive },
      { label: 'Median ETA', value: stats.etaMedian },
      { label: 'Cameras Online', value: stats.camsOnline },
    ],
    [stats]
  );

  const handleManual = (e) => {
    e.preventDefault();
    const marker = {
      ...manualMarker,
      id: crypto.randomUUID(),
      lat: Number(manualMarker.lat),
      lng: Number(manualMarker.lng),
    };
    setManualMarker((m) => ({ ...m, label: 'Flag' }));
    onAdd(marker);
    onComputeTime(timeInputs.start, { lat: marker.lat, lng: marker.lng });
  };

  const markerDistance = (marker) => {
    const dist = haversineDistance(defaultStart, marker);
    return `${(dist / 1000).toFixed(1)} km from HQ`;
  };

  const selectedCrime = crimeZones.find((c) => c.id === selectedCrimeId) || crimeZones[0];

  return (
    <div>
      <div className="section-title">
        <h3 style={{ margin: 0 }}>Dispatch Dashboard</h3>
        <span className="pill">Crime zones · units · ETAs</span>
      </div>

      <div className="dashboard-grid">
        {quickStats.map((s) => (
          <div key={s.label} className="dashboard-card">
            <div className="small">{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 600 }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="controls-row" style={{ marginTop: 14 }}>
        <form className="card" onSubmit={handleManual} style={{ background: 'rgba(255,255,255,0.02)' }}>
          <div className="section-title">
            <strong>Manual marker</strong>
            <button className="ghost" type="submit">Drop + ETA</button>
          </div>
          <div className="grid-2">
            <div className="input-group">
              <label>Label</label>
              <input value={manualMarker.label} onChange={(e) => setManualMarker({ ...manualMarker, label: e.target.value })} />
            </div>
            <div className="input-group">
              <label>Priority</label>
              <select value={manualMarker.priority} onChange={(e) => setManualMarker({ ...manualMarker, priority: e.target.value })}>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="input-group">
              <label>Latitude</label>
              <input type="number" step="0.0001" value={manualMarker.lat} onChange={(e) => setManualMarker({ ...manualMarker, lat: e.target.value })} />
            </div>
            <div className="input-group">
              <label>Longitude</label>
              <input type="number" step="0.0001" value={manualMarker.lng} onChange={(e) => setManualMarker({ ...manualMarker, lng: e.target.value })} />
            </div>
          </div>
          <p className="small">Adds a marker on the map and computes ETA from HQ.</p>
        </form>

        <div className="card" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <div className="section-title">
            <strong>ETA calculator</strong>
            <button
              className="primary"
              onClick={() => {
                const crime = crimeZones.find((c) => c.id === (etaCrimeId || selectedCrimeId));
                const unit = units.find((u) => u.id === etaUnitId);
                if (crime && unit) {
                  onComputeTime({ lat: unit.lat, lng: unit.lng }, { lat: crime.lat, lng: crime.lng });
                } else {
                  onComputeTime(timeInputs.start, timeInputs.end);
                }
              }}
            >
              Compute
            </button>
          </div>
          <div className="grid-2">
            <div className="input-group">
              <label>From unit</label>
              <select value={etaUnitId} onChange={(e) => setEtaUnitId(e.target.value)}>
                <option value="">(type start coords below)</option>
                {units.map((u) => (
                  <option key={u.id} value={u.id}>{u.name} · {(u.distance / 1000).toFixed(1)} km</option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label>To crime zone</label>
              <select value={etaCrimeId} onChange={(e) => setEtaCrimeId(e.target.value)}>
                <option value="">(type end coords below)</option>
                {crimeZones.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label>Start (lat,lng)</label>
              <input
                value={`${timeInputs.start.lat}, ${timeInputs.start.lng}`}
                onChange={(e) => {
                  const [lat, lng] = e.target.value.split(',').map(Number);
                  if (!Number.isNaN(lat) && !Number.isNaN(lng)) setTimeInputs((t) => ({ ...t, start: { lat, lng } }));
                }}
              />
            </div>
            <div className="input-group">
              <label>End (lat,lng)</label>
              <input
                value={`${timeInputs.end.lat}, ${timeInputs.end.lng}`}
                onChange={(e) => {
                  const [lat, lng] = e.target.value.split(',').map(Number);
                  if (!Number.isNaN(lat) && !Number.isNaN(lng)) setTimeInputs((t) => ({ ...t, end: { lat, lng } }));
                }}
              />
            </div>
          </div>
          {timeResult && (
            <div className="small" style={{ marginTop: 8 }}>
              Distance {(timeResult.distance / 1000).toFixed(2)} km ·
              {timeResult.times.map((t) => ` ${t.mode}: ${formatDuration(t.duration)}`).join(' | ')}
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <div className="section-title">
          <strong>Crime zones</strong>
          <span className="small">Tap to focus & compute distances</span>
        </div>
        <div className="marker-list">
          {crimeZones.map((c) => (
            <div key={c.id} className="marker-item" style={{ borderColor: c.id === selectedCrimeId ? 'var(--accent)' : 'var(--border)' }}>
              <div>
                <strong>{c.name}</strong>
                <div className="small">Severity {c.severity} · radius {c.radius}m · reported {c.reported}</div>
              </div>
              <button className="primary" onClick={() => onSelectCrime(c.id)}>View</button>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <div className="section-title">
          <strong>Units near scene</strong>
          <span className="small">{selectedCrime ? selectedCrime.name : 'Select a scene'}</span>
        </div>
        <div className="marker-list">
          {units.map((u) => (
            <div key={u.id} className="marker-item">
              <div>
                <strong>{u.name}</strong>
                <div className="small">{u.status} · {selectedCrime ? `${(u.distance / 1000).toFixed(2)} km away` : ''}</div>
              </div>
              <button className="ghost" disabled={u.status !== 'available'} onClick={() => onAssign(selectedCrimeId, u.id)}>Dispatch</button>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <div className="section-title">
          <strong>Dispatch board</strong>
          <span className="small">Manage active tasks</span>
        </div>
        <div className="marker-list">
          {dispatches.map((d) => {
            const crime = crimeZones.find((c) => c.id === d.crimeId);
            const unit = units.find((u) => u.id === d.unitId) || {};
            return (
              <div key={d.id} className="marker-item">
                <div>
                  <strong>{unit.name || d.unitId}</strong>
                  <div className="small">→ {crime?.name || d.crimeId} · {d.status}</div>
                </div>
                <div className="flex" style={{ gap: 6 }}>
                  <button className="ghost" onClick={() => onUpdateDispatch(d.id, 'arrived')}>Arrived</button>
                  <button className="ghost" onClick={() => onUpdateDispatch(d.id, 'cleared')}>Clear</button>
                </div>
              </div>
            );
          })}
          {dispatches.length === 0 && <div className="small">No active dispatches.</div>}
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <div className="section-title">
          <strong>Markers ({markers.length})</strong>
          <span className="small">Click a pin on the map to delete</span>
        </div>
        <div className="marker-list">
          {markers.map((marker) => (
            <div key={marker.id} className="marker-item">
              <div>
                <strong>{marker.label}</strong>
                <div className="small">{marker.lat}, {marker.lng} · {markerDistance(marker)}</div>
              </div>
              <button className="ghost" onClick={() => onRemove(marker.id)}>Remove</button>
            </div>
          ))}
          {markers.length === 0 && <div className="small">No markers yet — click map to place.</div>}
        </div>
      </div>
    </div>
  );
}
