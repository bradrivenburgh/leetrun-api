ALTER TABLE run_entries 
  DROP COLUMN IF EXISTS weather,
  DROP COLUMN IF EXISTS surface,
  DROP COLUMN IF EXISTS terrain;

DROP TYPE IF EXISTS weather_category;
DROP TYPE IF EXISTS surface_category;
DROP TYPE IF EXISTS terrain_category;