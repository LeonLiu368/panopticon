import { useState, useEffect, useRef, useCallback } from 'react';
import { parseVoiceCommand } from '../services/api';

// Pittsburgh neighborhoods with realistic incident types
const FAKE_INCIDENTS = [
  { area: 'Strip District', types: ['Armed Robbery', 'Aggravated Assault', 'Carjacking', 'Shots Fired'] },
  { area: 'Homewood', types: ['Domestic Disturbance', 'Burglary in Progress', 'Shots Fired', 'Suspicious Vehicle'] },
  { area: 'Squirrel Hill', types: ['Hit and Run', 'Shoplifting', 'Noise Complaint', 'Vandalism'] },
  { area: 'Hazelwood', types: ['Drug Activity', 'Trespassing', 'Abandoned Vehicle', 'Welfare Check'] },
  { area: 'Polish Hill', types: ['Break-In Report', 'Suspicious Person', 'Public Intoxication'] },
  { area: 'Garfield', types: ['Aggravated Assault', 'Stolen Vehicle', 'Disturbance', 'Gunshots Reported'] },
  { area: 'North Shore', types: ['Disorderly Conduct', 'Traffic Collision', 'Theft in Progress'] },
  { area: 'South Side Flats', types: ['Bar Fight', 'DUI Stop', 'Public Disturbance', 'Vandalism'] },
  { area: 'Highland Park', types: ['Suspicious Package', 'Prowler Report', 'Animal Complaint'] },
  { area: 'Brookline', types: ['Domestic Violence', 'Burglary Alarm', 'Reckless Driving'] },
  { area: 'Crafton Heights', types: ['Armed Robbery', 'Shots Fired', 'Vehicle Pursuit'] },
  { area: 'Point Breeze', types: ['Package Theft', 'Noise Violation', 'Suspicious Activity'] },
  { area: 'Manchester', types: ['Assault', 'Drug Deal in Progress', 'Disturbance'] },
  { area: 'Troy Hill', types: ['Break-In', 'Welfare Check', 'Suspicious Vehicle'] },
  { area: 'Beechview', types: ['Reckless Driving', 'Hit and Run', 'Domestic Call'] },
];

// Pittsburgh coordinate bounds
const PGH_BOUNDS = { latMin: 40.41, latMax: 40.48, lngMin: -80.03, lngMax: -79.90 };

const randomInRange = (min, max) => min + Math.random() * (max - min);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function generateCrimeZone(counter) {
  const spot = pick(FAKE_INCIDENTS);
  const type = pick(spot.types);
  const severity = pick(['low', 'medium', 'medium', 'high']);
  const now = new Date();
  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  return {
    id: `cz-auto-${counter}`,
    name: `${spot.area} ${type}`,
    lat: randomInRange(PGH_BOUNDS.latMin, PGH_BOUNDS.latMax),
    lng: randomInRange(PGH_BOUNDS.lngMin, PGH_BOUNDS.lngMax),
    severity,
    radius: Math.round(randomInRange(140, 300)),
    reported: time,
    risk: severity,
  };
}

const DAEDALUS_LINES = {
  greeting: "I am DAEDALUS. Shall I take command of dispatch operations?",
  activated: "Autonomous mode engaged. I have control.",
  deactivated: "Relinquishing control. Manual mode restored.",
  newIncident: (name, sev) => `New incident: ${name}. Severity: ${sev}.`,
  dispatching: (unit, zone) => `Dispatching ${unit} to ${zone}.`,
  clearing: (zone) => `${zone} resolved. Clearing dispatch.`,
  noUnits: "All units deployed. Awaiting availability.",
};

export default function DaedalusAgent({
  units,
  crimeZones,
  dispatches,
  markers,
  onDispatch,
  onAddCrimeZone,
  onClearDispatch,
  aiEnabled,
}) {
  const [open, setOpen] = useState(false);
  const [autonomous, setAutonomous] = useState(false);
  const [speaking, setSpeaking] = useState('');
  const [annotations, setAnnotations] = useState([]);
  const [thinking, setThinking] = useState(false);
  const autoRef = useRef(false);
  const busyRef = useRef(false);
  const crimeCounter = useRef(100);

  const addAnnotation = useCallback((text, type = 'info') => {
    const entry = { id: crypto.randomUUID(), text, type, at: new Date() };
    setAnnotations((prev) => [entry, ...prev].slice(0, 80));
  }, []);

  const speak = useCallback((text) => {
    setSpeaking(text);
    setTimeout(() => setSpeaking(''), 4000);
  }, []);

  useEffect(() => {
    autoRef.current = autonomous;
  }, [autonomous]);

  // INCIDENT GENERATOR — creates new fake crime zones periodically
  useEffect(() => {
    if (!autonomous) return;

    const genInterval = setInterval(() => {
      if (!autoRef.current) return;
      // Cap generated crime zones at 18
      const generatedCount = crimeZones.filter((z) => z.id.startsWith('cz-auto-')).length;
      if (generatedCount >= 18) {
        addAnnotation('Zone limit reached (18) — holding generation', 'wait');
        return;
      }
      crimeCounter.current += 1;
      const zone = generateCrimeZone(crimeCounter.current);
      onAddCrimeZone(zone);
      speak(DAEDALUS_LINES.newIncident(zone.name, zone.severity));
      addAnnotation(`NEW INCIDENT: ${zone.name} [${zone.severity.toUpperCase()}]`, 'new-incident');
      addAnnotation(`Location: ${zone.lat.toFixed(4)}, ${zone.lng.toFixed(4)} — radius ${zone.radius}m`, 'scan');
    }, randomInRange(10000, 15000));

    return () => clearInterval(genInterval);
  }, [autonomous, onAddCrimeZone, addAnnotation, speak]);

  // AUTO-CLEAR — resolve arrived dispatches after some time
  useEffect(() => {
    if (!autonomous) return;

    const clearInterval_ = setInterval(() => {
      if (!autoRef.current) return;
      const arrived = dispatches.filter((d) => d.status === 'arrived');
      if (arrived.length > 0) {
        const oldest = arrived[arrived.length - 1];
        const zone = crimeZones.find((z) => z.id === oldest.crimeId);
        const zoneName = zone?.name || oldest.crimeId;
        onClearDispatch(oldest.id);
        speak(DAEDALUS_LINES.clearing(zoneName));
        addAnnotation(`RESOLVED: ${zoneName} — unit cleared`, 'ok');
      }
    }, randomInRange(12000, 18000));

    return () => clearInterval(clearInterval_);
  }, [autonomous, dispatches, crimeZones, onClearDispatch, addAnnotation, speak]);

  // DISPATCH LOOP — dispatches units to unattended zones
  useEffect(() => {
    if (!autonomous || !aiEnabled) return;

    const tick = async () => {
      if (!autoRef.current || busyRef.current) return;

      const activeDispatches = dispatches.filter((d) => d.status !== 'cleared' && d.status !== 'cancelled');
      // Cap active dispatches at 14
      if (activeDispatches.length >= 14) {
        addAnnotation('Dispatch limit reached (14) — holding new assignments', 'wait');
        return;
      }

      const availableUnits = units.filter((u) => u.status === 'available');
      const activeDispatchCrimeIds = new Set(activeDispatches.map((d) => d.crimeId));
      const unattended = crimeZones.filter((z) => !activeDispatchCrimeIds.has(z.id));

      if (availableUnits.length === 0) {
        addAnnotation('All units deployed — awaiting availability', 'wait');
        return;
      }

      if (unattended.length === 0) {
        addAnnotation('All incidents covered — monitoring', 'ok');
        return;
      }

      // Prioritize by severity
      const severityOrder = { high: 0, medium: 1, low: 2 };
      const sorted = [...unattended].sort(
        (a, b) => (severityOrder[a.severity] ?? 2) - (severityOrder[b.severity] ?? 2)
      );
      const target = sorted[0];

      busyRef.current = true;
      setThinking(true);
      addAnnotation(`Analyzing: ${target.name} (${target.severity}) — needs response`, 'scan');

      try {
        const command = `dispatch the nearest available unit to ${target.name}`;
        addAnnotation(`AI Command: "${command}"`, 'command');

        const result = await parseVoiceCommand(command, units, crimeZones, markers);

        if (result.parsed && result.parsed.unit_id && result.parsed.target_id) {
          const unitName = result.parsed.unit_name || result.parsed.unit_id;
          const targetName = result.parsed.target_name || target.name;
          speak(DAEDALUS_LINES.dispatching(unitName, targetName));
          addAnnotation(`DISPATCH: ${unitName} → ${targetName}`, 'dispatch');
          if (result.parsed.reasoning) {
            addAnnotation(`Reasoning: ${result.parsed.reasoning}`, 'reasoning');
          }
          onDispatch({
            unitId: result.parsed.unit_id,
            targetId: result.parsed.target_id,
            targetType: result.parsed.target_type || 'crime',
          });
        } else {
          addAnnotation(`AI: ${result.ai_message || 'No action taken'}`, 'info');
        }
      } catch (err) {
        addAnnotation(`Error: ${err.message}`, 'error');
      } finally {
        busyRef.current = false;
        setThinking(false);
      }
    };

    const initialTimeout = setTimeout(tick, 2000);
    const interval = setInterval(tick, randomInRange(6000, 7000));
    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [autonomous, aiEnabled, units, crimeZones, dispatches, markers, onDispatch, addAnnotation, speak]);

  const handleToggleAutonomous = () => {
    if (!autonomous) {
      setAutonomous(true);
      speak(DAEDALUS_LINES.activated);
      addAnnotation('AUTONOMOUS MODE ENGAGED', 'system');
      addAnnotation('Generating incidents, dispatching units, clearing resolved cases', 'system');
    } else {
      setAutonomous(false);
      speak(DAEDALUS_LINES.deactivated);
      addAnnotation('AUTONOMOUS MODE DISENGAGED', 'system');
    }
  };

  const handleClick = () => {
    if (!open) {
      setOpen(true);
      speak(DAEDALUS_LINES.greeting);
    } else if (!autonomous) {
      setOpen(false);
    }
  };

  return (
    <>
      <div className={`daedalus-container ${open ? 'open' : ''} ${autonomous ? 'autonomous' : ''}`}>
        <button className="daedalus-avatar" onClick={handleClick}>
          <div className="daedalus-frame">
            <svg viewBox="0 0 80 80" className="daedalus-face">
              <ellipse cx="40" cy="36" rx="22" ry="26" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <g className="daedalus-eyes">
                <rect x="28" y="28" width="8" height="4" rx="1" fill="currentColor" />
                <rect x="44" y="28" width="8" height="4" rx="1" fill="currentColor" />
                <rect x="30" y="29" width="4" height="2" rx="0.5" fill={autonomous ? '#ffffff' : '#ffffff'} className="daedalus-pupil" />
                <rect x="46" y="29" width="4" height="2" rx="0.5" fill={autonomous ? '#ffffff' : '#ffffff'} className="daedalus-pupil" />
              </g>
              <line x1="33" y1="42" x2="47" y2="42" stroke="currentColor" strokeWidth="1" />
              <line x1="35" y1="45" x2="45" y2="45" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
              <line x1="40" y1="10" x2="40" y2="4" stroke="currentColor" strokeWidth="1" />
              <circle cx="40" cy="3" r="2" fill={autonomous ? '#ffffff' : '#ffffff'} className="daedalus-beacon" />
              <path d="M22 38 Q22 56 40 58 Q58 56 58 38" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4" />
              <rect x="14" y="26" width="5" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="0.8" />
              <rect x="61" y="26" width="5" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="0.8" />
            </svg>
          </div>
          <div className="daedalus-label">DAEDALUS</div>
          {autonomous && <div className="daedalus-status-dot" />}
        </button>

        {open && (
          <div className="daedalus-panel">
            <div className="daedalus-panel-header">
              <span className="daedalus-panel-title">DAEDALUS</span>
              <span className="pill" style={{ fontSize: '0.55rem' }}>
                {autonomous ? 'AUTONOMOUS' : 'STANDBY'}
              </span>
              <button className="ghost" onClick={() => { setOpen(false); }} style={{ marginLeft: 'auto', padding: '2px 6px' }}>X</button>
            </div>

            {speaking && (
              <div className="daedalus-speech">
                <span className="daedalus-speech-text">{speaking}</span>
              </div>
            )}

            <div className="daedalus-controls">
              <button
                className={`daedalus-auto-btn ${autonomous ? 'active' : ''}`}
                onClick={handleToggleAutonomous}
                disabled={!aiEnabled}
              >
                {autonomous ? 'DISENGAGE AUTONOMOUS' : 'ENGAGE AUTONOMOUS MODE'}
              </button>
              {!aiEnabled && <div className="small" style={{ color: '#888', marginTop: 4 }}>Enable AI to use autonomous mode</div>}
            </div>

            <div className="daedalus-annotations">
              <div className="daedalus-annotations-header">
                <span>AI ANNOTATIONS</span>
                {thinking && <span className="daedalus-thinking">THINKING...</span>}
              </div>
              <div className="daedalus-feed">
                {annotations.length === 0 && (
                  <div className="daedalus-annotation-item info">Awaiting activation...</div>
                )}
                {annotations.map((a) => (
                  <div key={a.id} className={`daedalus-annotation-item ${a.type}`}>
                    <span className="daedalus-annotation-time">
                      {a.at.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                    <span className="daedalus-annotation-text">{a.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
