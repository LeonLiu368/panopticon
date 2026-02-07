// Lightweight in-memory Supabase mock so the app runs with zero external services.
// Supports the minimal chainable API surface we use in the UI and route handlers.

type TableName =
  | 'incidents'
  | 'police_stations'
  | 'units'
  | 'dispatches'
  | 'checkpoints'
  | 'unit_stats';

// Seed data for local/offline demo
const db: Record<TableName, any[]> = {
  incidents: [
    {
      id: 'robbery-forbes-morewood',
      name: 'Robbery at Forbes & Morewood',
      status: 'active',
      priority: 'high',
      risk: 'high',
      lat: 40.4427,
      lon: -79.9425,
      containment: 15,
      description: 'Reported robbery near CMU campus',
      incident_type: 'robbery',
      start_time: new Date().toISOString(),
      last_update: new Date().toISOString(),
      reported_by: 'Dispatch',
    },
    {
      id: 'traffic-cmu',
      name: 'Multi-vehicle collision on Fifth Ave',
      status: 'active',
      priority: 'medium',
      risk: 'medium',
      lat: 40.4433,
      lon: -79.9490,
      containment: 35,
      description: '3-car collision blocking two lanes',
      incident_type: 'traffic',
      start_time: new Date().toISOString(),
      last_update: new Date().toISOString(),
      reported_by: '911',
    },
  ],
  police_stations: [
    { id: 1, name: 'Station 1 - Downtown', city: 'Pittsburgh', county: 'Allegheny', lat: 40.4406, lon: -79.9959, created_at: new Date().toISOString() },
    { id: 2, name: 'Station 2 - North', city: 'Pittsburgh', county: 'Allegheny', lat: 40.4500, lon: -79.9500, created_at: new Date().toISOString() },
    { id: 3, name: 'Station 3 - South', city: 'Pittsburgh', county: 'Allegheny', lat: 40.4300, lon: -79.9800, created_at: new Date().toISOString() },
  ],
  units: [],
  dispatches: [],
  checkpoints: [],
  unit_stats: [],
};

// Create three units per station
db.police_stations.forEach((station) => {
  Array.from({ length: 3 }).forEach((_, idx) => {
    db.units.push({
      id: `${station.id}-unit-${idx + 1}`,
      station_id: station.id,
      unit_number: `Unit ${station.id}-${idx + 1}`,
      unit_type: idx === 2 ? 'k9' : 'patrol',
      status: 'available',
      current_lat: station.lat,
      current_lon: station.lon,
      incident_id: null,
      dispatched_at: null,
      arrived_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  });
});

// Helper to compute unit_stats view on the fly
const computeUnitStats = () => {
  return db.police_stations.map((ps) => {
    const units = db.units.filter((u) => u.station_id === ps.id);
    return {
      station_id: ps.id,
      station_name: ps.name,
      available_units: units.filter((u) => u.status === 'available').length,
      dispatched_units: units.filter((u) => ['dispatched', 'en_route'].includes(u.status)).length,
      on_scene_units: units.filter((u) => u.status === 'on_scene').length,
      total_units: units.length,
    };
  });
};

// Utility clone
const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v));

// Query builder
function buildSelect(table: TableName, rows: any[]) {
  let working = [...rows];

  const api: any = {
    select: (_cols: string = '*') => api,
    eq: (col: string, val: any) => {
      working = working.filter((r) => r[col] === val);
      return api;
    },
    in: (col: string, vals: any[]) => {
      working = working.filter((r) => vals.includes(r[col]));
      return api;
    },
    order: (col: string, opts: { ascending?: boolean } = {}) => {
      const asc = opts.ascending !== false;
      working = [...working].sort((a, b) => {
        if (a[col] === b[col]) return 0;
        return (a[col] > b[col] ? 1 : -1) * (asc ? 1 : -1);
      });
      return api;
    },
    limit: (n: number) => {
      working = working.slice(0, n);
      return Promise.resolve({ data: clone(working), error: null });
    },
    then: (resolve: any, reject: any) =>
      Promise.resolve({ data: clone(working), error: null }).then(resolve, reject),
  };

  return api;
}

function buildUpdate(table: TableName, values: Record<string, any>) {
  return {
    eq: (col: string, val: any) => {
      const updated: any[] = [];
      db[table] = db[table].map((row) => {
        if (row[col] === val) {
          const next = { ...row, ...values, updated_at: new Date().toISOString() };
          updated.push(next);
          return next;
        }
        return row;
      });
      return Promise.resolve({ data: clone(updated), error: null });
    },
    in: (col: string, vals: any[]) => {
      const updated: any[] = [];
      db[table] = db[table].map((row) => {
        if (vals.includes(row[col])) {
          const next = { ...row, ...values, updated_at: new Date().toISOString() };
          updated.push(next);
          return next;
        }
        return row;
      });
      return Promise.resolve({ data: clone(updated), error: null });
    },
  };
}

function buildInsert(table: TableName, payload: any | any[]) {
  const items = Array.isArray(payload) ? payload : [payload];
  const withIds = items.map((item) => ({
    ...item,
    id: item.id || crypto.randomUUID?.() || `id-${Math.random().toString(36).slice(2, 8)}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));
  db[table].push(...withIds);
  return Promise.resolve({ data: clone(withIds), error: null });
}

function buildDelete(table: TableName) {
  return {
    eq: (col: string, val: any) => {
      const removed = db[table].filter((row) => row[col] === val);
      db[table] = db[table].filter((row) => row[col] !== val);
      return Promise.resolve({ data: clone(removed), error: null });
    },
  };
}

const mockChannel = () => {
  const ch: any = {
    on: () => ch,
    subscribe: () => ch,
    unsubscribe: () => {},
  };
  return ch;
};

export const supabase: any = {
  from: (table: TableName) => {
    if (table === 'unit_stats') {
      return buildSelect(table, computeUnitStats());
    }
    return {
      select: (_cols: string = '*') => buildSelect(table, db[table]),
      update: (values: Record<string, any>) => buildUpdate(table, values),
      insert: (payload: any | any[]) => buildInsert(table, payload),
      delete: () => buildDelete(table),
    };
  },
  channel: (_name: string) => mockChannel(),
  removeChannel: (_ch: any) => {},
  // Expose db for debugging in dev tools
  __data: db,
};
