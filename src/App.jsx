import { useCallback, useEffect, useMemo, useState } from 'react';
import LeafletView from './components/LeafletView';
import Map3DView from './components/Map3DView';
import DispatchPanel from './components/DispatchPanel';
import TranscriptRecorder from './components/TranscriptRecorder';
import { haversineDistance, formatDuration } from './utils/geo';

export default function App() {
  const [markers, setMarkers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [timeResult, setTimeResult] = useState(null);
  const [mode, setMode] = useState('3d');
  const [map3dOk, setMap3dOk] = useState(true);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [crimeZones, setCrimeZones] = useState([
    { id: 'cz-02', name: 'Cohon Center Disturbance', lat: 40.4431, lng: -79.9425, severity: 'medium', radius: 500, reported: '02:18', risk: 'medium' },
    { id: 'cz-03', name: 'Schenley Drive Assault', lat: 40.4387, lng: -79.9438, severity: 'high', radius: 240, reported: '02:26', risk: 'high' },
    { id: 'cz-04', name: 'Downtown Market Theft', lat: 40.4411, lng: -79.9965, severity: 'medium', radius: 200, reported: '02:35', risk: 'medium' },
    // Spread-out zones
    { id: 'cz-05', name: 'East Liberty Assault', lat: 40.4635, lng: -79.9260, severity: 'high', radius: 210, reported: '02:42', risk: 'high' },
    { id: 'cz-06', name: 'Oakland Traffic Incident', lat: 40.4475, lng: -79.9555, severity: 'medium', radius: 180, reported: '02:50', risk: 'medium' },
    { id: 'cz-07', name: 'South Side Disturbance', lat: 40.4265, lng: -79.9868, severity: 'low', radius: 170, reported: '03:01', risk: 'low' },
    { id: 'cz-08', name: 'Shadyside Vandalism', lat: 40.4548, lng: -79.9355, severity: 'medium', radius: 190, reported: '03:07', risk: 'medium' },
    { id: 'cz-09', name: 'Bloomfield Burglary', lat: 40.4592, lng: -79.9498, severity: 'high', radius: 205, reported: '03:14', risk: 'high' },
    { id: 'cz-10', name: 'Lawrenceville Theft', lat: 40.4715, lng: -79.9605, severity: 'medium', radius: 185, reported: '03:20', risk: 'medium' },
    { id: 'cz-11', name: 'Greenfield Noise Complaint', lat: 40.4269, lng: -79.9398, severity: 'low', radius: 160, reported: '03:28', risk: 'low' },
    { id: 'cz-12', name: 'Mt. Washington Alarm', lat: 40.4316, lng: -80.0140, severity: 'medium', radius: 175, reported: '03:35', risk: 'medium' },
  ]);
  const [units, setUnits] = useState([
    { id: 'u-11', name: 'Unit A1', lat: 40.4360, lng: -79.9950, status: 'available' },
    { id: 'u-12', name: 'Unit B4', lat: 40.4525, lng: -79.9600, status: 'available' },
    { id: 'u-13', name: 'Bike Squad 2', lat: 40.4485, lng: -79.9780, status: 'available' },
    { id: 'u-14', name: 'K9-7', lat: 40.4255, lng: -79.9900, status: 'standby' },
    { id: 'u-15', name: 'Traffic 5', lat: 40.4700, lng: -79.9400, status: 'available' },
    { id: 'u-16', name: 'Unit C3', lat: 40.4335, lng: -79.9700, status: 'available' },
    { id: 'u-17', name: 'Bike Squad 4', lat: 40.4580, lng: -79.9185, status: 'available' },
  ]);
  const [dispatches, setDispatches] = useState([]);
  const [selectedCrimeId, setSelectedCrimeId] = useState('cz-01');
  const [selectedTarget, setSelectedTarget] = useState({ type: 'crime', id: 'cz-01' });
  const [myLocation, setMyLocation] = useState(null);

  const handleMap3dError = useCallback(() => {
    setMap3dOk(false);
    setMode('2d');
  }, []);

  // Inject a standby unit at the user's current location when available
  useEffect(() => {
    if (!myLocation) return;
    setUnits((prev) => {
      const exists = prev.find((u) => u.id === 'u-standby');
      if (exists) {
        return prev.map((u) => (u.id === 'u-standby' ? { ...u, lat: myLocation.lat, lng: myLocation.lng } : u));
      }
      return [
        ...prev,
        {
          id: 'u-standby',
          name: 'Officer Leon',
          lat: myLocation.lat,
          lng: myLocation.lng,
          status: 'available',
        },
      ];
    });
  }, [myLocation]);

  const addMarker = useCallback((marker) => {
    setMarkers((prev) => [...prev, marker]);
  }, []);

  const removeMarker = useCallback((id) => {
    setMarkers((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const updateFromVoice = (action) => {
    if (action.type === 'addMarker' && action.coords) {
      addMarker({
        id: crypto.randomUUID(),
        label: action.label || 'Voice pin',
        ...action.coords,
        priority: action.priority || 'medium',
      });
    }
    if (action.type === 'removeMarker' && action.targetId) {
      removeMarker(action.targetId);
    }
    if (action.type === 'navigate' && action.coords) {
      setSelected(action.coords);
    }
  };

  const computeTime = (start, end) => {
    const dist = haversineDistance(start, end);
    const speeds = {
      cruiser: 17,
      bike: 6,
      foot: 1.8,
    };
    const times = Object.entries(speeds).map(([mode, speed]) => ({
      mode,
      duration: dist / speed,
    }));
    setTimeResult({ distance: dist, times });
  };

  const fetchRoute = async (from, to) => {
    const token = import.meta.env.VITE_MAPBOX_TOKEN;
    try {
      if (token) {
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${from.lng},${from.lat};${to.lng},${to.lat}?geometries=geojson&overview=full&access_token=${token}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data?.routes?.length) {
          return {
            coords: data.routes[0].geometry.coordinates, // [lng,lat]
            distance: data.routes[0].distance, // meters
            duration: data.routes[0].duration, // seconds
          };
        }
      }
    } catch (e) {
      console.warn('Route fetch failed, using straight line', e);
    }
    const dist = haversineDistance(from, to);
    return {
      coords: [
        [from.lng, from.lat],
        [to.lng, to.lat],
      ],
      distance: dist,
      duration: dist / 17,
    };
  };

  const resolveTarget = useCallback((target) => {
    if (!target) return null;
    if (target.type === 'crime') return crimeZones.find((c) => c.id === target.id);
    if (target.type === 'marker') return markers.find((m) => m.id === target.id);
    return null;
  }, [crimeZones, markers]);

  const assignDispatch = async (target, unitId) => {
    const unit = units.find((u) => u.id === unitId);
    const dest = resolveTarget(target);
    if (!unit || !dest) return;
    const route = await fetchRoute({ lat: unit.lat, lng: unit.lng }, { lat: dest.lat, lng: dest.lng });
    const etaSeconds = route.duration || route.distance / 17;
    const dispatch = {
      id: crypto.randomUUID(),
      destType: target.type,
      destId: target.id,
      crimeId: target.type === 'crime' ? target.id : null,
      unitId,
      status: 'en route',
      createdAt: new Date(),
      etaSeconds,
      routeCoords: route.coords,
      totalMeters: route.distance,
      progress: 0,
    };
    setDispatches((d) => [dispatch, ...d]);
    setUnits((list) => list.map((u) => (u.id === unitId ? { ...u, status: 'dispatched' } : u)));
    setSelected({ lat: dest.lat, lng: dest.lng });
    setTimeResult({ distance: route.distance, times: [{ mode: 'cruiser', duration: etaSeconds }] });
    // keep UI state in sync with this dispatch
    setSelectedTarget(target);
    if (target.type === 'crime') setSelectedCrimeId(target.id);
  };

  const dispatchToMarker = async (markerId) => {
    const marker = markers.find((m) => m.id === markerId);
    if (!marker) return;
    const avail = units.filter((u) => u.status === 'available');
    if (!avail.length) {
      alert('No available units to dispatch');
      return;
    }
    const withDistance = avail.map((u) => ({
      ...u,
      distance: haversineDistance({ lat: u.lat, lng: u.lng }, { lat: marker.lat, lng: marker.lng }),
    }));
    const nearest = withDistance.sort((a, b) => a.distance - b.distance)[0];
    setSelectedTarget({ type: 'marker', id: markerId });
    await assignDispatch({ type: 'marker', id: markerId }, nearest.id);
  };

  // Voice dispatch: find best matching unit and crime text and dispatch
  const handleVoiceDispatch = useCallback(
    async ({ unit: unitText, crime: crimeText }) => {
      if (!unitText || !crimeText) return;
      const sim = (a, b) => {
        a = (a || '').toLowerCase(); b = (b || '').toLowerCase();
        if (!a || !b) return 0;
        if (a.includes(b) || b.includes(a)) return 1;
        const makeBg = (s) => {
          const r = [];
          for (let i = 0; i < s.length - 1; i++) r.push(s.slice(i, i + 2));
          return r;
        };
        const A = makeBg(a), B = makeBg(b);
        let overlap = 0; const used = {};
        A.forEach((bg) => { const idx = B.indexOf(bg); if (idx !== -1 && !used[idx]) { overlap++; used[idx] = true; } });
        return (2 * overlap) / (A.length + B.length || 1);
      };
      const bestUnit = units
        .map((u) => ({ u, score: sim(unitText, u.name) + (u.status === 'available' ? 0.2 : 0) }))
        .sort((a, b) => b.score - a.score)[0]?.u;
    const bestCrime = crimeZones
      .map((c) => ({ c, score: sim(crimeText, c.name) }))
      .sort((a, b) => b.score - a.score)[0]?.c;
    if (!bestUnit || !bestCrime) return;
      await assignDispatch({ type: 'crime', id: bestCrime.id }, bestUnit.id);
      setSelectedTarget({ type: 'crime', id: bestCrime.id });
      setSelectedCrimeId(bestCrime.id);
      setSelected({ lat: bestUnit.lat, lng: bestUnit.lng });
    },
    [assignDispatch, crimeZones, units]
  );

  // focus map on a unit from sidebar click
  const focusUnit = (_crimeId, unit) => {
    if (!unit) return;
    setSelected({ lat: unit.lat, lng: unit.lng });
  };
  const focusCrime = (crimeId, loc) => {
    const crime = crimeZones.find((c) => c.id === crimeId) || loc;
    if (!crime) return;
    setSelected({ lat: crime.lat, lng: crime.lng });
  };

  // Voice navigation handler with best-match lookup
  const handleVoiceNavigate = (target) => {
    if (!target) return;
    const text = target.toLowerCase().trim();

    // Coordinate override
    const coordMatch = text.match(/(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/);
    if (coordMatch) {
      const lat = parseFloat(coordMatch[1]);
      const lng = parseFloat(coordMatch[2]);
      setSelected({ lat, lng });
      return;
    }

    const sim = (a, b) => {
      a = a.toLowerCase(); b = b.toLowerCase();
      if (!a || !b) return 0;
      if (a.includes(b) || b.includes(a)) return 1;
      const makeBigrams = (s) => {
        const r = [];
        for (let i = 0; i < s.length - 1; i++) r.push(s.slice(i, i + 2));
        return r;
      };
      const bgA = makeBigrams(a);
      const bgB = makeBigrams(b);
      let overlap = 0;
      const used = {};
      bgA.forEach((bg) => {
        const idx = bgB.indexOf(bg);
        if (idx !== -1 && !used[idx]) {
          overlap++;
          used[idx] = true;
        }
      });
      return (2 * overlap) / (bgA.length + bgB.length || 1);
    };

    const candidates = [
      ...crimeZones.map((c) => ({ type: 'crime', id: c.id, name: c.name, lat: c.lat, lng: c.lng })),
      ...units.map((u) => ({ type: 'unit', id: u.id, name: u.name, lat: u.lat, lng: u.lng })),
      ...markers.map((m) => ({ type: 'marker', id: m.id, name: m.label, lat: m.lat, lng: m.lng })),
    ];

    let best = null;
    let bestScore = 0;
    candidates.forEach((c) => {
      const score = sim(c.name || '', text);
      if (score > bestScore) {
        bestScore = score;
        best = c;
      }
    });

    if (best && bestScore > 0.2) {
      setSelected({ lat: best.lat, lng: best.lng });
      if (best.type === 'crime') setSelectedCrimeId(best.id);
      setSelectedTarget({ type: best.type, id: best.id });
    }
  };

  const updateDispatchStatus = (dispatchId, status) => {
    setDispatches((d) => {
      const dispatch = d.find((x) => x.id === dispatchId);
      if (!dispatch) return d;
      // cancel/clear -> remove dispatch and free unit
      if (['cleared', 'cancelled', 'cancel', 'clear'].includes(status)) {
        setUnits((u) =>
          u.map((unit) => (unit.id === dispatch.unitId ? { ...unit, status: 'available' } : unit))
        );
        return d.filter((x) => x.id !== dispatchId);
      }
      // arrived -> mark arrived and set unit on_scene
      if (status === 'arrived' || status === 'on_scene') {
        setUnits((u) =>
          u.map((unit) => (unit.id === dispatch.unitId ? { ...unit, status: 'on_scene' } : unit))
        );
        return d.map((x) => (x.id === dispatchId ? { ...x, status: 'arrived', progress: 1 } : x));
      }
      // en_route / dispatched fallback
      if (status === 'en_route' || status === 'dispatched') {
        setUnits((u) =>
          u.map((unit) => (unit.id === dispatch.unitId ? { ...unit, status: 'dispatched' } : unit))
        );
        return d.map((x) => (x.id === dispatchId ? { ...x, status } : x));
      }
      return d;
    });
  };

  // move dispatched units toward their crime target (follow road route if available)
  useEffect(() => {
    const stepMs = 1000;
    const speed = 25; // m/s cruiser (~56 mph) faster response
    const pointAlong = (coords, progress) => {
      if (!coords || coords.length < 2) return null;
      const segLens = [];
      let total = 0;
      for (let i = 0; i < coords.length - 1; i++) {
        const a = { lng: coords[i][0], lat: coords[i][1] };
        const b = { lng: coords[i + 1][0], lat: coords[i + 1][1] };
        const d = haversineDistance(a, b);
        segLens.push(d);
        total += d;
      }
      if (total === 0) return { lat: coords[0][1], lng: coords[0][0] };
      let remaining = progress * total;
      for (let i = 0; i < segLens.length; i++) {
        if (remaining <= segLens[i]) {
          const r = segLens[i] === 0 ? 0 : remaining / segLens[i];
          const a = coords[i];
          const b = coords[i + 1];
          return { lat: a[1] + (b[1] - a[1]) * r, lng: a[0] + (b[0] - a[0]) * r };
        }
        remaining -= segLens[i];
      }
      const last = coords[coords.length - 1];
      return { lat: last[1], lng: last[0] };
    };
    const id = setInterval(() => {
      setUnits((prevUnits) => {
        let updatedUnits = prevUnits;
        let arrivedIds = [];
        updatedUnits = updatedUnits.map((u) => {
          const dispatch = dispatches.find((d) => d.unitId === u.id && d.status === 'en route');
          if (!dispatch) return u;
          const target = crimeZones.find((c) => c.id === dispatch.crimeId);
          if (!target) return u;
          const coords = dispatch.routeCoords || [
            [u.lng, u.lat],
            [target.lng, target.lat],
          ];
          const total = dispatch.totalMeters || haversineDistance({ lat: coords[0][1], lng: coords[0][0] }, { lat: coords.at(-1)[1], lng: coords.at(-1)[0] });
          const progress = Math.min(1, (dispatch.progress || 0) + (speed * (stepMs / 1000)) / (total || 1));
          const nextPoint = pointAlong(coords, progress) || { lat: target.lat, lng: target.lng };
          const remaining = haversineDistance(nextPoint, { lat: target.lat, lng: target.lng });
          if (remaining < 8 || progress >= 1) {
            arrivedIds.push(dispatch.id);
            return { ...u, lat: target.lat, lng: target.lng, status: 'on_scene' };
          }
          setDispatches((dlist) =>
            dlist.map((d) => (d.id === dispatch.id ? { ...d, progress, totalMeters: total, routeCoords: coords } : d))
          );
          return { ...u, lat: nextPoint.lat, lng: nextPoint.lng, status: 'dispatched' };
        });
        if (arrivedIds.length) {
          setDispatches((d) =>
            d.map((x) => (arrivedIds.includes(x.id) ? { ...x, status: 'arrived', progress: 1 } : x))
          );
        }
        return updatedUnits;
      });
    }, stepMs);
    return () => clearInterval(id);
  }, [dispatches, crimeZones]);

  const dashboardStats = useMemo(() => ({
    openCalls: crimeZones.length,
    unitsActive: units.filter((u) => u.status !== 'available').length,
    etaMedian: timeResult ? formatDuration(timeResult.times[0].duration) : 'n/a',
    camsOnline: 0,
  }), [crimeZones.length, timeResult, units]);

  const handleSearch = async (queryParam) => {
    const query = queryParam || searchQuery;
    if (!query?.trim()) return;
    setSearching(true);
    setSearchError('');
    try {
      const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=1`;
      const res = await fetch(url, { headers: { 'User-Agent': 'dispatch-console/0.1' } });
      const data = await res.json();
      if (!data?.features?.length) throw new Error('No match');
      const feat = data.features[0];
      const [lng, lat] = feat.geometry.coordinates;
      const name = feat.properties.name || feat.properties.label || query;
      const coords = { lat: Number(lat), lng: Number(lng) };
      setSelected(coords);
      addMarker({ id: crypto.randomUUID(), label: name, priority: 'medium', ...coords });
    } catch (err) {
      setSearchError('Location not found');
    } finally {
      setSearching(false);
    }
  };

  const selectedDestination = useMemo(() => {
    const dest = resolveTarget(selectedTarget);
    return dest || crimeZones[0];
  }, [crimeZones, resolveTarget, selectedTarget]);

  const unitsByDistance = selectedDestination
    ? [...units].map((u) => ({
        ...u,
        distance: haversineDistance(
          { lat: u.lat, lng: u.lng },
          { lat: selectedDestination.lat, lng: selectedDestination.lng }
        ),
      }))
      .sort((a, b) => a.distance - b.distance)
    : units;

  // Keep map focused on selected crime zone
  useEffect(() => {
    if (selectedDestination) {
      setSelected({ lat: selectedDestination.lat, lng: selectedDestination.lng });
    }
  }, [selectedDestination]); // eslint-disable-line react-hooks/exhaustive-deps

  // Prepare dispatch lines (multi-point road routes)
  const dispatchLines = dispatches
    .map((d) => {
      const target = resolveTarget({ type: d.destType || (d.crimeId ? 'crime' : 'marker'), id: d.destId || d.crimeId });
      const unit = units.find((u) => u.id === d.unitId);
      if (!target || !unit) return null;
      const coords = d.routeCoords
        ? d.routeCoords.map(([lng, lat]) => ({ lat, lng }))
        : [
            { lat: unit.lat, lng: unit.lng },
            { lat: target.lat, lng: target.lng },
          ];
      return {
        id: d.id,
        coords,
        status: d.status,
      };
    })
    .filter(Boolean);

  return (
    <div className="app-shell">
      <div className="top-bar">
        <div className="brand">
          <span className="badge"><span className="status-dot" />Live</span>
          <h1>PATROLOPS</h1>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <div className="stat-label">Active INC</div>
            <div className="stat-value">{dashboardStats.openCalls}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Units Active</div>
            <div className="stat-value">{dashboardStats.unitsActive}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Sys Status</div>
            <div className="stat-value" style={{ fontSize: '0.9rem' }}>OPERATIONAL</div>
          </div>
        </div>
        <div className="flex">
          <div className="pill">{mode === '3d' ? '3D Mapbox' : '2D Leaflet'}</div>
          <button
            className="ghost"
            onClick={() => {
              if (mode === '3d') return setMode('2d');
              if (!map3dOk) return alert('3D tiles unavailable; staying in 2D.');
              setMode('3d');
            }}
          >
            Switch to {mode === '3d' ? '2D' : '3D'}
          </button>
          <button className="ghost" onClick={() => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition((pos) => {
                const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                setMyLocation(coords);
                setSelected(coords);
              });
            }
          }}>My location</button>
        </div>
      </div>
      <div className="hazard-stripe" />

      <div className="card">
        <div className="search-bar">
          <input
            placeholder="Search address / landmark"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(e.target.value); }}
          />
          <button className="primary" onClick={() => handleSearch()} disabled={searching}>
            {searching ? 'Searching...' : 'Go'}
          </button>
          {searchError && <span className="small" style={{ color: 'var(--danger)' }}>{searchError}</span>}
        </div>
        {mode === '3d' ? (
          <Map3DView
            markers={markers}
            onAddMarker={addMarker}
            onRemoveMarker={removeMarker}
            selected={selected}
            crimeZones={crimeZones}
            units={units}
            onSelectCrime={setSelectedCrimeId}
            lines={dispatchLines}
            onError={handleMap3dError}
          />
        ) : (
          <LeafletView
            markers={markers}
            onAddMarker={addMarker}
            onRemoveMarker={removeMarker}
            selected={selected}
            crimeZones={crimeZones}
            units={units}
            selectedCrimeId={selectedCrimeId}
            onSelectCrime={setSelectedCrimeId}
            myLocation={myLocation}
            lines={dispatchLines}
          />
        )}
      </div>

      <div className="card">
        <DispatchPanel
          markers={markers}
          onRemove={removeMarker}
          onDispatchMarker={dispatchToMarker}
          stats={dashboardStats}
          crimeZones={crimeZones}
          selectedCrimeId={selectedCrimeId}
          onSelectCrime={(crimeId, locOrUnit) => {
            setSelectedCrimeId(crimeId);
            setSelectedTarget({ type: 'crime', id: crimeId });
            if (locOrUnit?.lat && locOrUnit?.lng) setSelected({ lat: locOrUnit.lat, lng: locOrUnit.lng });
            else focusCrime(crimeId);
          }}
          units={unitsByDistance}
          onAssign={(crimeId, unitId) => assignDispatch({ type: 'crime', id: crimeId }, unitId)}
          onSelectUnit={(crimeId, unit) => focusUnit(crimeId, unit)}
          dispatches={dispatches}
          onUpdateDispatch={updateDispatchStatus}
        />
      </div>
      {/* Floating voice FAB */}
      <TranscriptRecorder
        onNavigate={handleVoiceNavigate}
        onDispatchCommand={handleVoiceDispatch}
      />
    </div>
  );
}
