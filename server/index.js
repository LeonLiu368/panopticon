import http from 'http';
import { randomUUID } from 'crypto';
import url from 'url';

const send = (res, status, data) => {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(data));
};

// In-memory state
let crimeZones = [
  { id: 'cz-01', name: 'Forbes & Morewood Robbery', lat: 40.4427, lng: -79.9425, severity: 'high', radius: 220, reported: '02:10' },
  { id: 'cz-02', name: 'Cohon Center Disturbance', lat: 40.4439, lng: -79.9429, severity: 'medium', radius: 180, reported: '02:18' },
  { id: 'cz-03', name: 'Schenley Drive Assault', lat: 40.4387, lng: -79.9438, severity: 'high', radius: 240, reported: '02:26' },
];
let markers = [];
let units = [
  { id: 'u-11', name: 'Unit A1', lat: 40.4385, lng: -79.992, status: 'available' },
  { id: 'u-12', name: 'Unit B4', lat: 40.446, lng: -79.955, status: 'available' },
  { id: 'u-13', name: 'Bike Squad 2', lat: 40.4422, lng: -79.982, status: 'available' },
  { id: 'u-14', name: 'K9-7', lat: 40.4308, lng: -79.999, status: 'standby' },
];
let dispatches = [];

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return send(res, 200, {});
  const parsed = url.parse(req.url, true);
  const path = parsed.pathname || '';

  const readBody = () =>
    new Promise((resolve) => {
      let data = '';
      req.on('data', (chunk) => (data += chunk));
      req.on('end', () => resolve(data ? JSON.parse(data) : {}));
    });

  if (req.method === 'GET' && path === '/api/state') {
    return send(res, 200, { crimeZones, markers, units, dispatches });
  }

  if (req.method === 'POST' && path === '/api/marker') {
    const body = await readBody();
    const marker = { id: randomUUID(), ...body };
    markers.push(marker);
    return send(res, 200, marker);
  }

  if (req.method === 'DELETE' && path.startsWith('/api/marker/')) {
    const id = path.split('/').pop();
    markers = markers.filter((m) => m.id !== id);
    return send(res, 200, { ok: true });
  }

  if (req.method === 'POST' && path === '/api/dispatch') {
    const body = await readBody();
    const { crimeId, unitId, etaSeconds } = body;
    const dispatch = { id: randomUUID(), crimeId, unitId, status: 'en route', etaSeconds, createdAt: new Date().toISOString() };
    dispatches = [dispatch, ...dispatches];
    units = units.map((u) => (u.id === unitId ? { ...u, status: 'dispatched' } : u));
    return send(res, 200, dispatch);
  }

  if (req.method === 'POST' && path.startsWith('/api/dispatch/') && path.endsWith('/status')) {
    const id = path.split('/')[3];
    const body = await readBody();
    dispatches = dispatches.map((d) => (d.id === id ? { ...d, status: body.status } : d));
    return send(res, 200, { ok: true });
  }

  if (req.method === 'POST' && path.startsWith('/api/unit/')) {
    const id = path.split('/').pop();
    const body = await readBody();
    units = units.map((u) => (u.id === id ? { ...u, ...body } : u));
    return send(res, 200, units.find((u) => u.id === id));
  }

  return send(res, 404, { error: 'Not found' });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`API server running on ${PORT}`);
});
