ALTER TABLE run_entries
  DROP COLUMN IF EXISTS user_id;

DROP TABLE IF EXISTS leetrun_users;
