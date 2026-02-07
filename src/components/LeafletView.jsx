import { useEffect, useRef } from 'react';

const tileUrl = import.meta.env.VITE_LEAFLET_TILES || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tileAttribution =
  import.meta.env.VITE_LEAFLET_ATTRIB ||
  '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors';

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
  const unitMarkers = useRef({});
  const lineLayer = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      if (mapInstance.current) return;
      // Inject Leaflet CSS once
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }
      const L = await import(/* @vite-ignore */ 'https://unpkg.com/leaflet@1.9.4/dist/leaflet-src.esm.js');
      if (!isMounted) return;
      const map = L.map(mapRef.current, {
        center: [40.4433, -79.9436], // CMU area
        zoom: 14,
        maxZoom: 20,
        worldCopyJump: true,
      });
      L.tileLayer(tileUrl, { attribution: tileAttribution, maxZoom: 20 }).addTo(map);
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
      map.on('click', (e) => {
        const markerData = {
          id: crypto.randomUUID(),
          lng: +e.latlng.lng.toFixed(5),
          lat: +e.latlng.lat.toFixed(5),
          label: prompt('Checkpoint label?', 'Checkpoint') || 'Checkpoint',
          priority: 'medium',
        };
        onAddMarker(markerData);
      });
      mapInstance.current = map;
    };
    init();
    return () => { isMounted = false; };
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
    if (!map) return;
    const sync = async () => {
      const L = await import(/* @vite-ignore */ 'https://unpkg.com/leaflet@1.9.4/dist/leaflet-src.esm.js');
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
  }, [markers, onRemoveMarker]);

  // Crime zones
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;
    const sync = async () => {
      const L = await import(/* @vite-ignore */ 'https://unpkg.com/leaflet@1.9.4/dist/leaflet-src.esm.js');
      Object.keys(crimeLayers.current).forEach((id) => {
        if (!crimeZones.find((c) => c.id === id)) {
          crimeLayers.current[id].remove();
          delete crimeLayers.current[id];
        }
      });
      crimeZones.forEach((c) => {
        if (crimeLayers.current[c.id]) return;
        const circle = L.circleMarker([c.lat, c.lng], {
          radius: 10,
          color: '#ff4d4d',
          weight: 2,
          fillColor: '#ff4d4d',
          fillOpacity: 0.35,
        }).addTo(map);
        circle.bindTooltip(c.name, { permanent: true, direction: 'top', className: 'zone-label' });
        circle.on('click', () => onSelectCrime?.(c.id));
        crimeLayers.current[c.id] = circle;
      });
    };
    sync();
  }, [crimeZones, onSelectCrime]);

  // Unit markers / checkpoints
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;
    const sync = async () => {
      const L = await import(/* @vite-ignore */ 'https://unpkg.com/leaflet@1.9.4/dist/leaflet-src.esm.js');
      Object.keys(unitMarkers.current).forEach((id) => {
        if (!units.find((u) => u.id === id)) {
          unitMarkers.current[id].remove();
          delete unitMarkers.current[id];
          if (unitMarkers.current[`${id}-mini`]) {
            unitMarkers.current[`${id}-mini`].remove();
            delete unitMarkers.current[`${id}-mini`];
          }
        }
      });
      units.forEach((u) => {
        if (unitMarkers.current[u.id]) return;
        const icon = L.divIcon({
          className: 'unit-marker',
          html: `<div style="width:14px;height:14px;border-radius:4px;background:${u.status === 'dispatched' ? '#f6c452' : '#6ef4c3'};border:2px solid #0d1627;"></div>`,
          iconAnchor: [7, 7],
        });
        const marker = L.marker([u.lat, u.lng], { title: u.name, opacity: u.status === 'available' ? 1 : 0.8, icon });
        marker.bindPopup(`<strong>${u.name}</strong><br/>${u.status}`);
        marker.on('click', () => map.flyTo([u.lat, u.lng], 15));
        marker.addTo(map);
        unitMarkers.current[u.id] = marker;
      });
    };
    sync();
  }, [units]);

  // Dispatch lines
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;
    const draw = async () => {
      const L = await import(/* @vite-ignore */ 'https://unpkg.com/leaflet@1.9.4/dist/leaflet-src.esm.js');
      if (lineLayer.current) {
        lineLayer.current.remove();
        lineLayer.current = null;
      }
      if (!lines.length) return;
      const polylines = lines.map((l) =>
        L.polyline(
          [
            [l.from.lat, l.from.lng],
            [l.to.lat, l.to.lng],
          ],
          { color: '#f6c452', weight: 2, dashArray: l.status === 'arrived' ? '' : '6 4' }
        )
      );
      const group = L.featureGroup(polylines).addTo(map);
      lineLayer.current = group;
    };
    draw();
  }, [lines]);

  // Fly to selection
  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !selected) return;
    map.flyTo([selected.lat, selected.lng], 15, { animate: true, duration: 0.9, easeLinearity: 0.1 });
  }, [selected]);

  // fly to my location if provided
  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !myLocation) return;
    map.flyTo([myLocation.lat, myLocation.lng], 15, { animate: true, duration: 0.9, easeLinearity: 0.1 });
  }, [myLocation]);

  return (
    <div>
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
