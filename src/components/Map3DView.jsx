import { useEffect, useRef } from 'react';
const styleUrl = import.meta.env.VITE_MAP_STYLE || 'https://demotiles.maplibre.org/style.json';

export default function Map3DView({ markers = [], crimeZones = [], units = [], selected, onAddMarker, onRemoveMarker, onSelectCrime, onError, lines = [] }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const glRef = useRef(null);
  const markerObjects = useRef({});
  const unitObjects = useRef({});
  const zoneLayers = useRef({});
  const lineLayerId = 'dispatch-lines';

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      if (mapInstance.current) return;
      if (!document.getElementById('maplibre-css')) {
        const link = document.createElement('link');
        link.id = 'maplibre-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/maplibre-gl@4.1.2/dist/maplibre-gl.css';
        document.head.appendChild(link);
      }
      let maplibregl;
      try {
        maplibregl = await import(/* @vite-ignore */ 'https://unpkg.com/maplibre-gl@4.1.2/dist/maplibre-gl.esm.js');
      } catch (err) {
        console.warn('Failed to load MapLibre', err);
        onError?.(err);
        return;
      }
      glRef.current = maplibregl;
      if (!mounted) return;
      const map = new maplibregl.Map({
        container: mapRef.current,
        style: styleUrl,
        center: [-79.9436, 40.4433], // CMU area
        zoom: 14,
        pitch: 60,
        bearing: 25,
      });
      map.addControl(new maplibregl.NavigationControl({ showCompass: true }));
      map.on('load', () => {
        if (map.getStyle().layers.some((l) => l.id === 'building')) {
          map.setPaintProperty('building', 'fill-extrusion-height', ['get', 'render_height']);
          map.setPaintProperty('building', 'fill-extrusion-base', ['get', 'render_min_height']);
          map.setPaintProperty('building', 'fill-extrusion-opacity', 0.7);
        }
      });
      map.on('click', (e) => {
        const label = prompt('Checkpoint label?', 'Checkpoint');
        const markerData = {
          id: crypto.randomUUID(),
          lng: +e.lngLat.lng.toFixed(5),
          lat: +e.lngLat.lat.toFixed(5),
          label: label || 'Checkpoint',
          priority: 'medium',
        };
        onAddMarker?.(markerData);
      });
      mapInstance.current = map;
    };
    init();
    return () => { mounted = false; };
  }, [onAddMarker]);

  // sync checkpoints markers
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;
    const maplibregl = glRef.current;
    if (!maplibregl) return;
    Object.keys(markerObjects.current).forEach((id) => {
      if (!markers.find((m) => m.id === id)) {
        markerObjects.current[id].remove();
        delete markerObjects.current[id];
      }
    });
    markers.forEach((m) => {
      if (markerObjects.current[m.id]) return;
      const el = document.createElement('div');
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.gap = '6px';
      el.style.cursor = 'pointer';
      el.innerHTML = `<div style="width:12px;height:12px;border-radius:50%;background:${m.priority === 'high' ? '#ff6b6b' : '#7cc5ff'};border:2px solid #0d1627;box-shadow:0 0 0 4px rgba(124,197,255,0.25);"></div><span style="color:#e8eefc;font-size:12px;padding:2px 6px;background:rgba(0,0,0,0.45);border-radius:6px;">${m.label}</span>`;
      el.title = m.label;
      el.onclick = (ev) => {
        ev.stopPropagation();
        onRemoveMarker?.(m.id);
      };
      const mk = new maplibregl.Marker(el)
        .setLngLat([m.lng, m.lat])
        .setPopup(new maplibregl.Popup({ offset: 12 }).setHTML(`<strong>${m.label}</strong><br/>${m.lat}, ${m.lng}`))
        .addTo(map);
      markerObjects.current[m.id] = mk;
    });
  }, [markers, onRemoveMarker]);

  // sync crime zones as circles
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;
    const maplibregl = glRef.current;
    if (!maplibregl) return;
    Object.keys(zoneLayers.current).forEach((id) => {
      if (!crimeZones.find((c) => c.id === id)) {
        map.removeLayer(id);
        map.removeSource(id);
        delete zoneLayers.current[id];
      }
    });
    crimeZones.forEach((c) => {
      if (zoneLayers.current[c.id]) return;
      map.addSource(c.id, {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [c.lng, c.lat] },
          properties: c,
        },
      });
      map.addLayer({
        id: c.id,
        type: 'circle',
        source: c.id,
        paint: {
          'circle-radius': 14,
          'circle-color': '#ff4d4d',
          'circle-stroke-color': '#b30000',
          'circle-stroke-width': 1.5,
          'circle-opacity': 0.5,
        },
      });
      map.addLayer({
        id: `${c.id}-label`,
        type: 'symbol',
        source: c.id,
        layout: {
          'text-field': ['get', 'name'],
          'text-size': 12,
          'text-offset': [0, 1.2],
        },
        paint: {
          'text-color': '#ffecec',
          'text-halo-color': '#b30000',
          'text-halo-width': 1,
        },
      });
      map.on('click', c.id, () => onSelectCrime?.(c.id));
      zoneLayers.current[c.id] = true;
    });
  }, [crimeZones, onSelectCrime]);

  // sync police units markers
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;
    const maplibregl = glRef.current;
    if (!maplibregl) return;
    Object.keys(unitObjects.current).forEach((id) => {
      if (!units.find((u) => u.id === id)) {
        unitObjects.current[id].remove();
        delete unitObjects.current[id];
      }
    });
    units.forEach((u) => {
      if (unitObjects.current[u.id]) return;
      const el = document.createElement('div');
      el.style.width = '16px';
      el.style.height = '16px';
      el.style.borderRadius = '4px';
      el.style.background = u.status === 'dispatched' ? '#f6c452' : '#6ef4c3';
      el.style.boxShadow = '0 0 0 4px rgba(110,244,195,0.25)';
      el.title = `${u.name} · ${u.status}`;
      const mk = new maplibregl.Marker(el)
        .setLngLat([u.lng, u.lat])
        .setPopup(new maplibregl.Popup({ offset: 10 }).setHTML(`<strong>${u.name}</strong><br/>${u.status}`))
        .addTo(map);
      unitObjects.current[u.id] = mk;
    });
  }, [units]);

  // fly to selection
  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !selected) return;
    map.flyTo({ center: [selected.lng, selected.lat], zoom: 15, pitch: 60, speed: 0.9, curve: 1.6 });
  }, [selected]);

  // dispatch lines
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;
    const maplibregl = glRef.current;
    if (!maplibregl) return;
    if (map.getLayer(lineLayerId)) {
      map.removeLayer(lineLayerId);
    }
    if (map.getSource(lineLayerId)) {
      map.removeSource(lineLayerId);
    }
    if (!lines.length) return;
    map.addSource(lineLayerId, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: lines.map((l) => ({
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [
              [l.from.lng, l.from.lat],
              [l.to.lng, l.to.lat],
            ],
          },
        })),
      },
    });
    map.addLayer({
      id: lineLayerId,
      type: 'line',
      source: lineLayerId,
      paint: {
        'line-color': '#f6c452',
        'line-width': 2,
        'line-dasharray': [2, 2],
      },
    });
  }, [lines]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: '1 1 0', minHeight: 0 }}>
      <div className="section-title">
        <div className="flex">
          <h3 style={{ margin: 0 }}>3D Map (MapLibre)</h3>
          <span className="pill">Extruded buildings · click to add checkpoints</span>
        </div>
        <div className="badge">Style: {styleUrl.includes('demotiles') ? 'Demo' : 'Custom'}</div>
      </div>
      <div className="map-wrap" ref={mapRef} />
    </div>
  );
}
