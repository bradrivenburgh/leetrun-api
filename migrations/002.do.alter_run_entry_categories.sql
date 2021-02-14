CREATE TYPE weather_category AS ENUM (
  'clear',
  'rain',
  'snow',
);

CREATE TYPE surface_category AS ENUM (
  'pavement',
  'trail',
);

CREATE TYPE terrain_category AS ENUM (
  'mixed',
  'flat',
  'uphill',
  'downhill',
);

ALTER TABLE run_entries
  ADD COLUMN
    weather weather_category,
  ADD COLUMN
    surface surface_category,
  ADD COLUMN
    terrain terrain_category;
