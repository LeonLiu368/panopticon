import { useEffect, useRef, useState } from 'react';

const tileUrl = import.meta.env.VITE_LEAFLET_TILES || 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const tileAttribution =
  import.meta.env.VITE_LEAFLET_ATTRIB ||
  '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>';

export default function LeafletView({
  markers,
  onAddMarker,
  onRemoveMarker,
  selected,
  crimeZones = [],
  units = [],
  selectedCrimeId,
  onSelectCrime,
  myLocation,
  lines = [],
}) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerObjects = useRef({});
  const userMarker = useRef(null);
  const crimeLayers = useRef({});
  const crimePulseTimers = useRef({});
  const crimePins = useRef({});
  const unitMarkers = useRef({});
  const lineLayer = useRef(null);
  const heatGroup = useRef(null);
  const activeInputRef = useRef(null);
  const keyListenerRef = useRef(null);
  const lastPointerRef = useRef(null);
  const standbyStreamRef = useRef(null);
  const unitPopupCache = useRef({});
  const [mapReady, setMapReady] = useState(false);

  // Helper: load Leaflet and return L
  const loadLeaflet = async () => {
    const Lmod = await import(/* @vite-ignore */ 'https://unpkg.com/leaflet@1.9.4/dist/leaflet-src.esm.js');
    const L = window.L || Lmod.default || Lmod;
    window.L = L;
    return L;
  };

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      if (mapInstance.current) return;
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }
      const L = await loadLeaflet();
      if (!isMounted) return;
      const map = L.map(mapRef.current, {
        center: [40.4433, -79.9436],
        zoom: 14,
        maxZoom: 20,
        worldCopyJump: true,
      });
      L.tileLayer(tileUrl, {
        attribution: tileAttribution,
        maxZoom: 20,
        detectRetina: true,
      }).addTo(map);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const coords = [pos.coords.latitude, pos.coords.longitude];
            map.setView(coords, 14);
            const marker = L.circleMarker(coords, { radius: 8, color: '#6ef4c3' }).addTo(map).bindPopup('You are here');
            userMarker.current = marker;
          },
          () => {},
          { enableHighAccuracy: true, timeout: 3000, maximumAge: 60000 }
        );
      }
      const spawnInput = (point, latlng) => {
        document.querySelectorAll('.leaflet-checkpoint-input').forEach((el) => el.remove());
        activeInputRef.current = null;
        const labelInput = document.createElement('input');
        labelInput.type = 'text';
        labelInput.placeholder = 'Checkpoint label';
        labelInput.style.position = 'absolute';
        labelInput.style.zIndex = 9999;
        labelInput.style.padding = '6px 8px';
        labelInput.style.border = '1px solid #00b4ff';
        labelInput.style.borderRadius = '6px';
        labelInput.style.background = '#0a0d14';
        labelInput.style.color = '#00b4ff';
        labelInput.style.fontSize = '12px';
        labelInput.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
        labelInput.style.left = `${point.x}px`;
        labelInput.style.top = `${point.y}px`;
        labelInput.style.pointerEvents = 'auto';
        labelInput.className = 'leaflet-checkpoint-input';
        mapRef.current.appendChild(labelInput);
        labelInput.focus();
        activeInputRef.current = labelInput;
        const cleanup = () => {
          labelInput.remove();
          activeInputRef.current = null;
          document.removeEventListener('mousedown', outsideClose, true);
        };
        const outsideClose = (evt) => {
          if (evt.target !== labelInput) cleanup();
        };
        document.addEventListener('mousedown', outsideClose, true);
        labelInput.onkeydown = (ev) => {
          if (ev.key === 'Enter') {
            const val = labelInput.value || 'Checkpoint';
            cleanup();
            const markerData = {
              id: crypto.randomUUID(),
              lng: +latlng.lng.toFixed(5),
              lat: +latlng.lat.toFixed(5),
              label: val,
              priority: 'medium',
            };
            onAddMarker(markerData);
          } else if (ev.key === 'Escape') {
            cleanup();
          }
        };
      };

      map.on('mousemove', (e) => {
        lastPointerRef.current = { latlng: e.latlng, point: map.latLngToContainerPoint(e.latlng) };
      });

      const handleKey = (ev) => {
        const tag = ev.target?.tagName?.toLowerCase();
        if (tag === 'input' || tag === 'textarea') return;
        if (ev.key?.toLowerCase() !== 'c') return;
        const fallback = map.getCenter();
        const pointer = lastPointerRef.current;
        const latlng = pointer?.latlng || fallback;
        const pt = pointer?.point || map.latLngToContainerPoint(fallback);
        spawnInput(pt, latlng);
      };

      window.addEventListener('keydown', handleKey);
      keyListenerRef.current = handleKey;
      mapInstance.current = map;
      setMapReady(true);
    };
    init();
    return () => {
      isMounted = false;
      if (keyListenerRef.current) {
        window.removeEventListener('keydown', keyListenerRef.current);
        keyListenerRef.current = null;
      }
      unitPopupCache.current = {};
      setMapReady(false);
    };
  }, [onAddMarker]);

  const checkpointIcon = (L, label) =>
    L.divIcon({
      className: 'checkpoint-icon',
      html: `<div class="checkpoint-dot"></div><span class="checkpoint-label">${label}</span>`,
      iconAnchor: [8, 8],
    });

  // Sync markers
  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !mapReady) return;
    const sync = async () => {
      const L = await loadLeaflet();
      Object.keys(markerObjects.current).forEach((id) => {
        if (!markers.find((m) => m.id === id)) {
          markerObjects.current[id].remove();
          delete markerObjects.current[id];
        }
      });
      markers.forEach((m) => {
        if (markerObjects.current[m.id]) return;
        const icon = checkpointIcon(L, m.label);
        const marker = L.marker([m.lat, m.lng], { icon });
        marker.bindPopup(`<strong>${m.label}</strong><br/>${m.lat}, ${m.lng}`);
        marker.on('click', (ev) => {
          ev.originalEvent.stopPropagation();
          onRemoveMarker(m.id);
        });
        marker.addTo(map);
        markerObjects.current[m.id] = marker;
      });
    };
    sync();
  }, [markers, onRemoveMarker, mapReady]);

  // Crime zones with pulsing visuals
  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !mapReady) return;
    const sync = async () => {
      const L = await loadLeaflet();
      // clear removed zones
      Object.keys(crimeLayers.current).forEach((id) => {
        if (!crimeZones.find((c) => c.id === id)) {
          crimeLayers.current[id].remove();
          delete crimeLayers.current[id];
          if (crimePins.current[id]) {
            crimePins.current[id].remove();
            delete crimePins.current[id];
          }
          if (crimePulseTimers.current[id]) {
            clearInterval(crimePulseTimers.current[id].timer);
            crimePulseTimers.current[id].circle.remove();
            delete crimePulseTimers.current[id];
          }
        }
      });
      const riskRadius = (risk) => {
        switch ((risk || '').toLowerCase()) {
          case 'critical': return (c) => c.radius || 260;
          case 'high': return (c) => c.radius || 220;
          case 'medium': return (c) => c.radius || 180;
          default: return (c) => c.radius || 150;
        }
      };
      const riskColor = (risk) => {
        switch ((risk || '').toLowerCase()) {
          case 'low': return { stroke: '#facc15', fill: '#facc15' }; // yellow
          case 'medium': return { stroke: '#fb923c', fill: '#fb923c' }; // orange
          default: return { stroke: '#ef4444', fill: '#ef4444' }; // red for high/critical
        }
      };
      const riskWeight = (risk) => {
        switch ((risk || '').toLowerCase()) {
          case 'critical': return 1;
          case 'high': return 0.75;
          case 'medium': return 0.55;
          default: return 0.4;
        }
      };
      crimeZones.forEach((c) => {
        if (crimeLayers.current[c.id]) {
          // update label if needed
          crimeLayers.current[c.id].bindTooltip(c.name, { permanent: true, direction: 'top', className: 'zone-label' });
          return;
        }
        // bright red marker pin
        const pinIcon = L.divIcon({
          className: 'crime-pin-icon',
          html: '<div class="crime-pin-head"></div><div class="crime-pin-stem"></div>',
          iconSize: [16, 26],
          iconAnchor: [8, 13],
        });
        const pin = L.marker([c.lat, c.lng], { icon: pinIcon, title: c.name });
        pin.bindTooltip(c.name, { permanent: false, direction: 'top', className: 'zone-label' });
        pin.on('click', () => onSelectCrime?.(c.id));
        pin.addTo(map);
        crimePins.current[c.id] = pin;

        const baseRadius = riskRadius(c.risk)(c);
        const colors = riskColor(c.risk);
        const inner = L.circleMarker([c.lat, c.lng], {
          radius: 10,
          color: colors.stroke,
          weight: 2,
          fillColor: colors.fill,
          fillOpacity: 0.55,
          className: 'danger-zone',
        }).addTo(map);
        inner.bindTooltip(c.name, { permanent: true, direction: 'top', className: 'zone-label' });
        inner.on('click', () => onSelectCrime?.(c.id));
        crimeLayers.current[c.id] = inner;

        // pulsing outer ring (meters)
        const pulseCircle = L.circle([c.lat, c.lng], {
          radius: baseRadius,
          color: '#ff2d2d',
          weight: 0,
          fillColor: '#ff2d2d',
          fillOpacity: 0.08,
          className: 'danger-pulse',
        }).addTo(map);
        const timer = setInterval(() => {
          const scale = 1 + 0.25 * Math.sin(Date.now() / 400);
          pulseCircle.setRadius(baseRadius * scale);
          pulseCircle.setStyle({ fillOpacity: 0.05 + 0.1 * (0.5 + 0.5 * Math.sin(Date.now() / 400)) });
        }, 120);
        crimePulseTimers.current[c.id] = { timer, circle: pulseCircle };
      });

      // Heatmap overlay (manual concentric circles as fallback to plugin)
      if (heatGroup.current) {
        heatGroup.current.remove();
        heatGroup.current = null;
      }
      const blobs = crimeZones.map((c) => {
        const weight = riskWeight(c.risk);
        const base = riskRadius(c.risk)(c);
        return [
          L.circle([c.lat, c.lng], { radius: base * 1.2, color: 'transparent', fillColor: 'rgba(255,150,50,0.25)', fillOpacity: 0.25, weight: 0 }),
          L.circle([c.lat, c.lng], { radius: base * 1.8, color: 'transparent', fillColor: 'rgba(255,90,30,0.18)', fillOpacity: 0.18 * weight, weight: 0 }),
          L.circle([c.lat, c.lng], { radius: base * 2.6, color: 'transparent', fillColor: 'rgba(255,0,0,0.12)', fillOpacity: 0.12 * weight, weight: 0 }),
        ];
      }).flat();
      if (blobs.length) {
        heatGroup.current = L.featureGroup(blobs).addTo(map);
      }
    };
    sync();
    return () => {
      Object.values(crimePulseTimers.current).forEach(({ timer, circle }) => {
        clearInterval(timer);
        circle.remove();
      });
      crimePulseTimers.current = {};
      Object.values(crimePins.current).forEach((m) => m.remove());
      crimePins.current = {};
      if (heatGroup.current) {
        heatGroup.current.remove();
        heatGroup.current = null;
      }
    };
  }, [crimeZones, onSelectCrime, mapReady]);

  // Unit markers
  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !mapReady) return;
    if (!map || !mapReady) return;
    const sync = async () => {
      const L = await loadLeaflet();
      Object.keys(unitMarkers.current).forEach((id) => {
        if (!units.find((u) => u.id === id)) {
          unitMarkers.current[id].remove();
          delete unitMarkers.current[id];
        }
      });
      units.forEach((u) => {
        const color = u.status === 'dispatched' ? '#f6c452' : u.status === 'on_scene' ? '#ff6b6b' : '#6ef4c3';
        const icon = L.divIcon({
          className: 'unit-marker',
          html: `<div style="width:14px;height:14px;border-radius:4px;background:${color};border:2px solid #0d1627;"></div>`,
          html: `<div style="width:14px;height:14px;border-radius:4px;background:${color};border:2px solid #0d1627;"></div>`,
          iconAnchor: [7, 7],
        });
        if (unitMarkers.current[u.id]) {
          unitMarkers.current[u.id].setLatLng([u.lat, u.lng]);
          unitMarkers.current[u.id].setIcon(icon);
          unitMarkers.current[u.id].setPopupContent(`<strong>${u.name}</strong><br/>${u.status}`);
          return;
        }
        const marker = L.marker([u.lat, u.lng], { title: u.name, opacity: u.status === 'available' ? 1 : 0.8, icon });
        marker.bindPopup(bodycam.el, { autoClose: false, closeOnClick: false, closeButton: true });
        marker.on('popupopen', () => {
          bodycam.attachCamera();
          const vid = bodycam.el.querySelector('video');
          if (vid) vid.play().catch(() => {});
        });
        marker.on('click', () => {
          map.flyTo([u.lat, u.lng], 15);
          marker.openPopup();
        });
        marker.addTo(map);
        unitMarkers.current[u.id] = marker;
      });
    };
    sync();
  }, [units, mapReady]);

  // Dispatch lines (supports multi-point road routes)
  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !mapReady) return;
    const draw = async () => {
      const L = await loadLeaflet();
      if (lineLayer.current) {
        lineLayer.current.remove();
        lineLayer.current = null;
      }
      if (!lines.length) return;
      const polylines = lines.map((l) =>
        L.polyline(
          l.coords && l.coords.length
            ? l.coords.map((p) => [p.lat, p.lng])
            : [],
          { color: '#3b82f6', weight: 2.5, dashArray: l.status === 'arrived' ? '' : '6 4' }
        )
      );
      const group = L.featureGroup(polylines).addTo(map);
      lineLayer.current = group;
    };
    draw();
  }, [lines, mapReady]);

  // Fly to selection
  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !selected) return;
    map.flyTo([selected.lat, selected.lng], 15, { animate: true, duration: 0.9, easeLinearity: 0.1 });
  }, [selected]);

  // Fly to my location
  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !myLocation) return;
    map.flyTo([myLocation.lat, myLocation.lng], 15, { animate: true, duration: 0.9, easeLinearity: 0.1 });
  }, [myLocation]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: '1 1 0', minHeight: 0 }}>
      <div className="section-title">
        <div className="flex">
          <h3 style={{ margin: 0 }}>Leaflet Map</h3>
          <span className="pill">2D · OSM/Tile backend</span>
        </div>
        <div className="badge">Tiles: {tileUrl.includes('openstreetmap') ? 'OSM' : 'Custom'}</div>
      </div>
      <div className="map-wrap" ref={mapRef} />
    </div>
  );
}
