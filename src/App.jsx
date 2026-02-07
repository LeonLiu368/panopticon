import { useCallback, useEffect, useMemo, useState } from 'react';
import LeafletView from './components/LeafletView';
import Map3DView from './components/Map3DView';
import DispatchPanel from './components/DispatchPanel';
import VoiceControl from './components/VoiceControl';
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
    { id: 'cz-01', name: 'Forbes & Morewood Robbery', lat: 40.4427, lng: -79.9425, severity: 'high', radius: 220, reported: '02:10' },
    { id: 'cz-02', name: 'Cohon Center Disturbance', lat: 40.4439, lng: -79.9429, severity: 'medium', radius: 180, reported: '02:18' },
    { id: 'cz-03', name: 'Schenley Drive Assault', lat: 40.4387, lng: -79.9438, severity: 'high', radius: 240, reported: '02:26' },
  ]);
  const [units, setUnits] = useState([
    { id: 'u-11', name: 'Unit A1', lat: 40.4385, lng: -79.992, status: 'available' },
    { id: 'u-12', name: 'Unit B4', lat: 40.446, lng: -79.955, status: 'available' },
    { id: 'u-13', name: 'Bike Squad 2', lat: 40.4422, lng: -79.982, status: 'available' },
    { id: 'u-14', name: 'K9-7', lat: 40.4308, lng: -79.999, status: 'standby' },
  ]);
  const [dispatches, setDispatches] = useState([]);
  const [selectedCrimeId, setSelectedCrimeId] = useState('cz-01');
  const [myLocation, setMyLocation] = useState(null);

  const handleMap3dError = useCallback(() => {
    setMap3dOk(false);
    setMode('2d');
  }, []);

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
    const dist = haversineDistance(start, end); // meters
    const speeds = {
      cruiser: 17, // m/s ~ 38 mph
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

  const assignDispatch = async (crimeId, unitId) => {
    const crime = crimeZones.find((c) => c.id === crimeId);
    const unit = units.find((u) => u.id === unitId);
    if (!crime || !unit) return;
    const route = await fetchRoute({ lat: unit.lat, lng: unit.lng }, { lat: crime.lat, lng: crime.lng });
    const etaSeconds = route.duration || route.distance / 17;
    const dispatch = {
      id: crypto.randomUUID(),
      crimeId,
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
    setSelected({ lat: crime.lat, lng: crime.lng });
    setTimeResult({ distance: route.distance, times: [{ mode: 'cruiser', duration: etaSeconds }] });
  };

  const updateDispatchStatus = (dispatchId, status) => {
    setDispatches((d) => d.map((x) => (x.id === dispatchId ? { ...x, status } : x)));
  };

  // move dispatched units toward their crime target (follow road route if available)
  useEffect(() => {
    const stepMs = 1000;
    const speed = 15; // m/s cruiser
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

  const selectedCrime = crimeZones.find((c) => c.id === selectedCrimeId) || crimeZones[0];
  const unitsByDistance = selectedCrime
    ? [...units].map((u) => ({
        ...u,
        distance: haversineDistance(
          { lat: u.lat, lng: u.lng },
          { lat: selectedCrime.lat, lng: selectedCrime.lng }
        ),
      }))
      .sort((a, b) => a.distance - b.distance)
    : units;

  // keep map focused on selected crime zone
  useEffect(() => {
    if (selectedCrime) {
      setSelected({ lat: selectedCrime.lat, lng: selectedCrime.lng });
    }
  }, [selectedCrimeId]); // eslint-disable-line react-hooks/exhaustive-deps

  // prepare dispatch lines crime -> unit
  const dispatchLines = dispatches
    .map((d) => {
      const crime = crimeZones.find((c) => c.id === d.crimeId);
      const unit = units.find((u) => u.id === d.unitId);
      if (!crime || !unit) return null;
      const coords = d.routeCoords
        ? d.routeCoords.map(([lng, lat]) => ({ lat, lng }))
        : [
            { lat: unit.lat, lng: unit.lng },
            { lat: crime.lat, lng: crime.lng },
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
          <VoiceControl onCommand={updateFromVoice} />
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
            {searching ? 'Searching…' : 'Go'}
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
          onAdd={addMarker}
          onRemove={removeMarker}
          onComputeTime={computeTime}
          timeResult={timeResult}
          stats={dashboardStats}
          crimeZones={crimeZones}
          selectedCrimeId={selectedCrimeId}
          onSelectCrime={setSelectedCrimeId}
          units={unitsByDistance}
          onAssign={assignDispatch}
          dispatches={dispatches}
          onUpdateDispatch={updateDispatchStatus}
        />
        <TranscriptRecorder />
      </div>
    </div>
  );
}
