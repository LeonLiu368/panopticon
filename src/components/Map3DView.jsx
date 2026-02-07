import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoidGhlZXphbm9ueW1vdXMiLCJhIjoiY21sYnFzbTNvMHJwdDNlcTNnbHE0MzFkOSJ9.8GIdITSkZv_aYV4arbAFhg';
const styleUrl = import.meta.env.VITE_MAP_STYLE || 'mapbox://styles/mapbox/dark-v11';

export default function Map3DView({
  markers = [],
  crimeZones = [],
  units = [],
  selected,
  onAddMarker,
  onRemoveMarker,
  onSelectCrime,
  onError,
  lines = [],
}) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerObjects = useRef({});
  const unitObjects = useRef({});
  const zoneLayers = useRef(false);
  const pulseTimer = useRef(null);
  const mapLoaded = useRef(false);
  const [mapReady, setMapReady] = useState(false);
  const activeInputRef = useRef(null);
  const lineLayerId = 'dispatch-lines';
  const keyListenerRef = useRef(null);
  const lastPointerRef = useRef(null);
  const standbyStreamRef = useRef(null);
  const unitPopupCache = useRef({});

  useEffect(() => {
    if (mapInstance.current) return;

    mapboxgl.accessToken = mapboxToken;

    let map;
    try {
      map = new mapboxgl.Map({
        container: mapRef.current,
        style: styleUrl,
        center: [-79.9436, 40.4433],
        zoom: 14,
        pitch: 60,
        bearing: 25,
        attributionControl: false,
        antialias: false, // better perf
        collectResourceTiming: false,
        fadeDuration: 200,
      });
    } catch (err) {
      console.warn('Failed to initialize Mapbox', err);
      onError?.(err);
      return;
    }

    // ensure interactions stay enabled
    map.scrollZoom.enable();
    map.boxZoom.enable();
    map.dragPan.enable();
    map.dragRotate.enable();
    map.keyboard.enable();
    map.doubleClickZoom.enable();

    map.addControl(new mapboxgl.NavigationControl({ showCompass: true }), 'top-right');
    map.addControl(new mapboxgl.ScaleControl({ maxWidth: 100, unit: 'imperial' }), 'bottom-left');

    map.on('load', () => {
      mapLoaded.current = true;
      setMapReady(true);

      // 3D terrain
      map.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.terrain-rgb',
        tileSize: 512,
        maxzoom: 14,
      });
      map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });

      // 3D buildings
      map.addLayer({
        id: '3d-buildings',
        source: 'composite',
        'source-layer': 'building',
        filter: ['==', 'extrude', 'true'],
        type: 'fill-extrusion',
        paint: {
          'fill-extrusion-color': '#1a2535',
          'fill-extrusion-height': ['get', 'height'],
          'fill-extrusion-base': ['get', 'min_height'],
          'fill-extrusion-opacity': 0.7,
        },
      });

      // Sky / atmosphere
      map.addLayer({
        id: 'sky',
        type: 'sky',
        paint: {
          'sky-type': 'atmosphere',
          'sky-atmosphere-sun': [0.0, 0.0],
          'sky-atmosphere-sun-intensity': 15,
        },
      });
    });

    const spawnInputAt = (point, lngLat) => {
      document.querySelectorAll('.mapbox-checkpoint-input').forEach((el) => el.remove());
      activeInputRef.current = null;
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = 'Checkpoint label';
      Object.assign(input.style, {
        position: 'absolute',
        zIndex: 9999,
        padding: '6px 8px',
        border: '1px solid #00b4ff',
        borderRadius: '6px',
        background: '#0a0d14',
        color: '#00b4ff',
        fontSize: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
        left: `${point.x}px`,
        top: `${point.y}px`,
      });
      input.className = 'mapbox-checkpoint-input';
      mapRef.current.parentElement.appendChild(input);
      input.focus();
      activeInputRef.current = input;
      const cleanup = () => {
        input.remove();
        activeInputRef.current = null;
        document.removeEventListener('mousedown', outsideClose, true);
      };
      const outsideClose = (evt) => {
        if (evt.target !== input) cleanup();
      };
      document.addEventListener('mousedown', outsideClose, true);
      input.onkeydown = (ev) => {
        if (ev.key === 'Enter') {
          const markerData = {
            id: crypto.randomUUID(),
            lng: +lngLat.lng.toFixed(5),
            lat: +lngLat.lat.toFixed(5),
            label: input.value || 'Checkpoint',
            priority: 'medium',
          };
          cleanup();
          onAddMarker?.(markerData);
        } else if (ev.key === 'Escape') {
          cleanup();
        }
      };
    };

    map.on('mousemove', (e) => {
      lastPointerRef.current = { point: e.point, lngLat: e.lngLat };
    });

    const handleKey = (ev) => {
      const tag = ev.target?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;
      if (ev.key?.toLowerCase() !== 'c') return;
      const fallback = map.getCenter();
      const pointer = lastPointerRef.current;
      const lngLat = pointer?.lngLat || fallback;
      const point = pointer?.point || map.project(fallback);
      spawnInputAt(point, lngLat);
    };

    window.addEventListener('keydown', handleKey);
    keyListenerRef.current = handleKey;

    map.on('error', (e) => {
      console.warn('Mapbox error', e);
    });

    mapInstance.current = map;

    return () => {
      Object.values(markerObjects.current).forEach((mk) => mk.remove());
      markerObjects.current = {};
      Object.values(unitObjects.current).forEach((mk) => mk.remove());
      unitObjects.current = {};
      unitPopupCache.current = {};
      zoneLayers.current = {};
      mapLoaded.current = false;
      map.remove();
      mapInstance.current = null;
      if (keyListenerRef.current) {
        window.removeEventListener('keydown', keyListenerRef.current);
        keyListenerRef.current = null;
      }
    };
  }, [onAddMarker, onError]);

  // Sync checkpoint markers
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;
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
      const mk = new mapboxgl.Marker({ element: el })
        .setLngLat([m.lng, m.lat])
        .setPopup(new mapboxgl.Popup({ offset: 12 }).setHTML(`<strong>${m.label}</strong><br/>${m.lat}, ${m.lng}`))
        .addTo(map);
      markerObjects.current[m.id] = mk;
    });
  }, [markers, onRemoveMarker]);

  // sync crime zones as a single source + layers (with pulsing halo)
  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !mapReady) return;

    const sourceId = 'crime-zones';
    const layerId = 'crime-zones-circles';
    const pulseId = 'crime-zones-pulse';
    const labelId = 'crime-zones-labels';

    const riskRadius = (risk) => {
      switch ((risk || '').toLowerCase()) {
        case 'critical': return 52;
        case 'high': return 44;
        case 'medium': return 36;
        default: return 30;
      }
    };
    const riskColor = (risk) => {
      switch ((risk || '').toLowerCase()) {
        case 'low': return '#facc15';   // yellow
        case 'medium': return '#fb923c'; // orange
        default: return '#ef4444';      // red for high/critical
      }
    };
    const featureCollection = {
      type: 'FeatureCollection',
      features: crimeZones.map((c) => ({
        type: 'Feature',
        properties: { ...c, name: c.name || c.id, riskRadius: riskRadius(c.risk), riskColor: riskColor(c.risk) },
        geometry: { type: 'Point', coordinates: [c.lng, c.lat] },
      })),
    };

    if (map.getSource(sourceId)) {
      map.getSource(sourceId).setData(featureCollection);
    } else {
      map.addSource(sourceId, { type: 'geojson', data: featureCollection });
    }

    const ensureLayer = (id, def) => {
      if (!map.getLayer(id)) map.addLayer(def);
    };

    ensureLayer(layerId, {
      id: layerId,
      type: 'circle',
      source: sourceId,
      paint: {
        'circle-radius': ['get', 'riskRadius'],
        'circle-color': ['get', 'riskColor'],
        'circle-stroke-color': '#111827',
        'circle-stroke-width': 1.5,
        'circle-opacity': 0.55,
      },
    });

    ensureLayer(pulseId, {
      id: pulseId,
      type: 'circle',
      source: sourceId,
      paint: {
        'circle-radius': ['*', ['get', 'riskRadius'], 2.2],
        'circle-color': ['get', 'riskColor'],
        'circle-opacity': 0.12,
      },
    });

    ensureLayer(labelId, {
      id: labelId,
      type: 'symbol',
      source: sourceId,
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

    // click handler
    map.off('click', layerId);
    map.on('click', layerId, (e) => {
      const id = e.features?.[0]?.properties?.id || e.features?.[0]?.properties?.name;
      if (id) onSelectCrime?.(id);
    });

    // animation
    if (pulseTimer.current) clearInterval(pulseTimer.current);
    pulseTimer.current = setInterval(() => {
      const t = Date.now() / 600;
      const scale = 1 + 0.28 * Math.sin(t);
      if (map.getLayer(pulseId)) {
        map.setPaintProperty(pulseId, 'circle-radius', ['*', ['get', 'riskRadius'], 2.2 * scale]);
        map.setPaintProperty(pulseId, 'circle-opacity', 0.05 + 0.08 * (0.5 + 0.5 * Math.sin(t)));
      }
    }, 160);

    zoneLayers.current = true;
    return () => {
      if (pulseTimer.current) clearInterval(pulseTimer.current);
    };
  }, [crimeZones, onSelectCrime, mapReady]);

  // Sync police unit markers
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;
    Object.keys(unitObjects.current).forEach((id) => {
      if (!units.find((u) => u.id === id)) {
        unitObjects.current[id].remove();
        delete unitObjects.current[id];
      }
    });
    const buildBodycamPopup = (unit) => {
      const wrap = document.createElement('div');
      wrap.style.width = '220px';
      wrap.innerHTML = `<strong>${unit.name}</strong><br/><span style="color:#9fb3d1;">${unit.status}</span>`;
      const frame = document.createElement('div');
      frame.style.marginTop = '6px';
      frame.style.borderRadius = '8px';
      frame.style.overflow = 'hidden';
      frame.style.border = '1px solid #0d1627';
      frame.style.boxShadow = '0 6px 16px rgba(0,0,0,0.35)';
      const video = document.createElement('video');
      video.width = 220;
      video.height = 124;
      video.autoplay = true;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.style.display = 'block';
      video.style.objectFit = 'cover';
      frame.appendChild(video);
      wrap.appendChild(frame);
      const caption = document.createElement('div');
      caption.textContent = 'Bodycam feed';
      caption.style.fontSize = '10px';
      caption.style.color = '#72819e';
      caption.style.marginTop = '4px';
      wrap.appendChild(caption);

      const attachCamera = () => {
        if (unit.id === 'u-standby' && navigator.mediaDevices?.getUserMedia) {
          const tryStream = async () => {
            try {
              if (!standbyStreamRef.current) {
                standbyStreamRef.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
              }
              video.srcObject = standbyStreamRef.current;
              await video.play().catch(() => {});
              caption.textContent = 'Bodycam feed (live)';
            } catch (err) {
              video.src = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
              caption.textContent = 'Bodycam feed (demo)';
            }
          };
          tryStream();
        } else {
          video.src = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
          caption.textContent = 'Bodycam feed (demo)';
        }
      };
      return { el: wrap, attachCamera };
    };

    units.forEach((u) => {
      const color = u.status === 'dispatched' ? '#f6c452' : '#6ef4c3';
      const halo = u.status === 'dispatched' ? 'rgba(246,196,82,0.25)' : 'rgba(110,244,195,0.25)';
      const existing = unitObjects.current[u.id];
      if (!unitPopupCache.current[u.id]) unitPopupCache.current[u.id] = buildBodycamPopup(u);
      const popupContent = unitPopupCache.current[u.id];
      // keep text in sync
      const statusNode = popupContent.el.querySelector('span');
      if (statusNode) statusNode.textContent = u.status;
      if (existing) {
        existing.setLngLat([u.lng, u.lat]);
        const el = existing.getElement();
        if (el) {
          el.style.background = color;
          el.style.boxShadow = `0 0 0 4px ${halo}`;
          el.title = `${u.name} · ${u.status}`;
        }
        const popup = existing.getPopup();
        if (popup) {
          popup.setDOMContent(popupContent.el);
          popup.off('open', popupContent.attachCamera);
          popup.on('open', () => {
            popupContent.attachCamera();
            const vid = popupContent.el.querySelector('video');
            if (vid) vid.play().catch(() => {});
          });
        }
        return;
      }
      const el = document.createElement('div');
      el.style.width = '16px';
      el.style.height = '16px';
      el.style.borderRadius = '4px';
      el.style.background = color;
      el.style.boxShadow = `0 0 0 4px ${halo}`;
      el.title = `${u.name} · ${u.status}`;
      const popup = new mapboxgl.Popup({ offset: 10, closeOnClick: false, closeButton: true });
      popup.setDOMContent(popupContent.el);
      popup.on('open', () => {
        popupContent.attachCamera();
        const vid = popupContent.el.querySelector('video');
        if (vid) vid.play().catch(() => {});
      });
      const mk = new mapboxgl.Marker({ element: el })
        .setLngLat([u.lng, u.lat])
        .setPopup(popup)
        .addTo(map);
      unitObjects.current[u.id] = mk;
    });
  }, [units]);

  // Fly to selection
  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !selected) return;
    map.flyTo({ center: [selected.lng, selected.lat], zoom: 15, pitch: 60, speed: 0.9, curve: 1.6 });
  }, [selected]);

  // Dispatch lines (multi-point road routes)
  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !mapLoaded.current) return;
    if (map.getLayer(lineLayerId)) map.removeLayer(lineLayerId);
    if (map.getSource(lineLayerId)) map.removeSource(lineLayerId);
    if (!lines.length) return;
    map.addSource(lineLayerId, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: lines.map((l) => ({
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: (l.coords || []).map((p) => [p.lng, p.lat]),
          },
        })),
      },
    });
    map.addLayer({
      id: lineLayerId,
      type: 'line',
      source: lineLayerId,
      paint: {
        'line-color': '#3b82f6',
        'line-width': 2.5,
        'line-dasharray': [2, 2],
      },
    });
  }, [lines]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: '1 1 0', minHeight: 0 }}>
      <div className="section-title">
        <div className="flex">
          <h3 style={{ margin: 0 }}>3D Map (Mapbox GL)</h3>
          <span className="pill">3D terrain · extruded buildings · press C to add checkpoints</span>
        </div>
        <div className="badge">Style: {styleUrl.includes('mapbox://') ? 'Dark' : 'Custom'}</div>
      </div>
      <div className="map-wrap" ref={mapRef} />
    </div>
  );
}
