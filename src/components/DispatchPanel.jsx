import { useMemo } from 'react';

export default function DispatchPanel({
  markers,
  onRemove,
  onDispatchMarker,
  stats,
  crimeZones,
  selectedCrimeId,
  onSelectCrime,
  onSelectUnit,
  units,
  onAssign,
  dispatches,
  onUpdateDispatch,
}) {
  const quickStats = useMemo(
    () => [
      { label: 'Open Calls', value: stats.openCalls },
      { label: 'Units Active', value: stats.unitsActive },
      { label: 'Median ETA', value: stats.etaMedian },
      { label: 'Cameras Online', value: stats.camsOnline },
    ],
    [stats]
  );

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
              <button className="primary" onClick={() => onSelectCrime(c.id, { lat: c.lat, lng: c.lng })}>View</button>
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
                <button
                  className="ghost"
                  style={{ padding: 0, color: 'inherit', textAlign: 'left' }}
                  onClick={() => onSelectUnit && onSelectUnit(selectedCrimeId, u)}
                >
                  <strong>{u.name}</strong>
                  <div className="small">{u.status} · {selectedCrime ? `${(u.distance / 1000).toFixed(2)} km away` : ''}</div>
                </button>
              </div>
              <button className="dispatch" disabled={u.status !== 'available'} onClick={() => onAssign(selectedCrimeId, u.id)}>Dispatch</button>
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
                  <div className="small">&rarr; {crime?.name || d.crimeId} · {d.status}</div>
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
          <span className="small">Click a pin on the map to delete · Dispatch to checkpoint</span>
        </div>
        <div className="marker-list">
          {markers.map((marker) => (
            <div key={marker.id} className="marker-item">
              <div>
                <strong>{marker.label}</strong>
                <div className="small">{marker.lat}, {marker.lng}</div>
              </div>
              <div className="flex" style={{ gap: 6 }}>
                <button className="dispatch" onClick={() => onDispatchMarker?.(marker.id)}>Dispatch nearest</button>
                <button className="ghost" onClick={() => onRemove(marker.id)}>Remove</button>
              </div>
            </div>
          ))}
          {markers.length === 0 && <div className="small">No markers yet — click map to place.</div>}
        </div>
      </div>
    </div>
  );
}
