-- Police Dispatch Service Database Schema
-- Based on CalHacks Orion architecture, adapted for police operations

-- Create incidents table (police incidents/crimes)
CREATE TABLE IF NOT EXISTS incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  status TEXT CHECK (status IN ('active', 'resolved', 'closed')),
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  lat NUMERIC,
  lon NUMERIC,
  containment NUMERIC DEFAULT 0, -- Progress on resolving incident (0-100)
  start_time TIMESTAMPTZ DEFAULT NOW(),
  last_update TIMESTAMPTZ DEFAULT NOW(),
  description TEXT,
  incident_type TEXT, -- e.g., 'robbery', 'assault', 'traffic', 'disturbance'
  reported_by TEXT, -- Who reported the incident
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create police_stations table (replaces firestations)
CREATE TABLE IF NOT EXISTS police_stations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT,
  county TEXT,
  lat NUMERIC NOT NULL,
  lon NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create units table (police units/patrol cars)
CREATE TABLE IF NOT EXISTS units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id BIGINT REFERENCES police_stations(id),
  incident_id UUID REFERENCES incidents(id), -- null when available
  status TEXT CHECK (status IN ('available', 'dispatched', 'en_route', 'on_scene', 'off_duty')),
  unit_number TEXT NOT NULL, -- e.g., 'Unit A1', 'Patrol 3', 'K9-7'
  unit_type TEXT DEFAULT 'patrol', -- 'patrol', 'k9', 'bike', 'traffic', 'swat'
  current_lat NUMERIC,
  current_lon NUMERIC,
  dispatched_at TIMESTAMPTZ,
  arrived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create dispatches table (tracks unit assignments to incidents)
CREATE TABLE IF NOT EXISTS dispatches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID REFERENCES incidents(id) NOT NULL,
  unit_id UUID REFERENCES units(id) NOT NULL,
  status TEXT CHECK (status IN ('assigned', 'en_route', 'on_scene', 'completed', 'cancelled')),
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  eta_seconds INTEGER, -- Estimated time of arrival in seconds
  route_geometry JSONB, -- Mapbox route geometry
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create checkpoints table (manual markers/checkpoints on map)
CREATE TABLE IF NOT EXISTS checkpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  lat NUMERIC NOT NULL,
  lon NUMERIC NOT NULL,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  description TEXT,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS incidents_last_update_idx ON incidents(last_update DESC);
CREATE INDEX IF NOT EXISTS incidents_status_idx ON incidents(status);
CREATE INDEX IF NOT EXISTS incidents_priority_idx ON incidents(priority);
CREATE INDEX IF NOT EXISTS police_stations_location_idx ON police_stations(lat, lon);
CREATE INDEX IF NOT EXISTS units_status_idx ON units(status);
CREATE INDEX IF NOT EXISTS units_station_idx ON units(station_id);
CREATE INDEX IF NOT EXISTS units_incident_idx ON units(incident_id);
CREATE INDEX IF NOT EXISTS dispatches_incident_idx ON dispatches(incident_id);
CREATE INDEX IF NOT EXISTS dispatches_unit_idx ON dispatches(unit_id);
CREATE INDEX IF NOT EXISTS dispatches_status_idx ON dispatches(status);

-- Create view for unit statistics
CREATE OR REPLACE VIEW unit_stats AS
SELECT 
  ps.id AS station_id,
  ps.name AS station_name,
  COUNT(CASE WHEN u.status = 'available' THEN 1 END) AS available_units,
  COUNT(CASE WHEN u.status IN ('dispatched', 'en_route') THEN 1 END) AS dispatched_units,
  COUNT(CASE WHEN u.status = 'on_scene' THEN 1 END) AS on_scene_units,
  COUNT(*) AS total_units
FROM police_stations ps
LEFT JOIN units u ON u.station_id = ps.id
GROUP BY ps.id, ps.name;

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE incidents;
ALTER PUBLICATION supabase_realtime ADD TABLE police_stations;
ALTER PUBLICATION supabase_realtime ADD TABLE units;
ALTER PUBLICATION supabase_realtime ADD TABLE dispatches;
ALTER PUBLICATION supabase_realtime ADD TABLE checkpoints;

-- Insert sample police stations (adjust coordinates for your area)
INSERT INTO police_stations (name, city, county, lat, lon) VALUES
('Station 1 - Downtown', 'Pittsburgh', 'Allegheny', 40.4406, -79.9959),
('Station 2 - North', 'Pittsburgh', 'Allegheny', 40.4500, -79.9500),
('Station 3 - South', 'Pittsburgh', 'Allegheny', 40.4300, -79.9800)
ON CONFLICT DO NOTHING;

-- Insert sample units (3 units per station)
INSERT INTO units (station_id, unit_number, unit_type, status, current_lat, current_lon)
SELECT 
  ps.id,
  'Unit ' || ps.id || '-' || generate_series(1, 3),
  CASE generate_series(1, 3)
    WHEN 1 THEN 'patrol'
    WHEN 2 THEN 'patrol'
    ELSE 'k9'
  END,
  'available',
  ps.lat,
  ps.lon
FROM police_stations ps
ON CONFLICT DO NOTHING;

-- Insert sample incident
INSERT INTO incidents (name, status, priority, lat, lon, description, incident_type, reported_by)
VALUES 
('Robbery at Forbes & Morewood', 'active', 'high', 40.4427, -79.9425, 'Reported robbery at intersection', 'robbery', 'Dispatch')
ON CONFLICT DO NOTHING;
