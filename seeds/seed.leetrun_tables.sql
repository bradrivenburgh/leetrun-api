BEGIN;

TRUNCATE
  run_entries,
  leetrun_users
  RESTART IDENTITY CASCADE;

INSERT INTO leetrun_users (user_name, first_name, last_name, password)
VALUES
  ('runner', 'Brad', 'Wilson', '$2a$12$lHK6LVpc15/ZROZcKU00QeiD.RyYq5dVlV/9m4kKYbGibkRc5l4Ne'),
  ('jogger', 'Betty', 'Boop', '$2a$12$VQ5HgWm34QQK2rJyLc0lmu59cy2jcZiV6U1.bE8rBBnC9VxDf/YQO'),
  ('sprinter', 'Charlie', 'Coolson', '$2a$12$2fv9OPgM07xGnhDbyL6xsuAeQjAYpZx/3V2dnu0XNIR27gTeiK2gK'),
  ('leetrunner', 'Sam', 'Champion', '$2a$12$/4P5/ylaB7qur/McgrEKwuCy.3JZ6W.cRtqxiJsYCdhr89V4Z3rp.'),
  ('rivdog', 'Alex', 'Trebek', '$2a$12$Hq9pfcWWvnzZ8x8HqJotveRHLD13ceS7DDbrs18LpK6rfj4iftNw.');

INSERT INTO run_entries (id, user_id, date, location, distance, hours, minutes, seconds, notes, public, weather, surface, terrain)
VALUES
  ("1", 1, "2021-02-01", "Philadelphia, PA", "5", "00", "17", "00", "Great run!", TRUE, "clear", "pavement", "flat"),
  ("2", 2, "2021-01-15", "Haddonfield, NJ", "10", "00", "40", "00", "Great run!", TRUE, "rain", "pavement", "mixed"),
  ("3", 3, "2021-01-14", "Cinnaminson, NJ", "15", "01", "02", "00", "Exhausting!", FALSE, "snow", "pavement", "uphill"),
  ("4", 4, "2021-01-05", "Langhorne, PA", "25", "01", "20", "00", "Run down a mountain. My quads hurt!", TRUE, "clear", "pavement", "downhill"),
  ("5", 4, "2021-01-04", "Philadelphia, PA", "30", "02", "00", "00", "Almost at marathon distance", TRUE, "clear", "pavement", "mixed"),
  ("6", 4, "2021-01-01", "Philadelphia, PA", "5", "00", "17", "30", "The long distance training has helped me improve my endurance considerably.", TRUE, "clear", "trail", "mixed"),
  ("7", 1, "2021-01-01", "Philadelphia, PA", "5", "00", "17", "30", "The long distance training has helped me improve my endurance considerably.", TRUE, "clear", "trail", "mixed"),
  ("8", 2, "2021-01-01", "Philadelphia, PA", "5", "00", "17", "30", "The long distance training has helped me improve my endurance considerably.", TRUE, "clear", "trail", "mixed"),
  ("9", 3, "2021-01-01", "Philadelphia, PA", "5", "00", "17", "30", "The long distance training has helped me improve my endurance considerably.", TRUE, "clear", "trail", "mixed"),
  ("10", 4, "2021-01-01", "Philadelphia, PA", "5", "00", "17", "30", "The long distance training has helped me improve my endurance considerably.", TRUE, "clear", "trail", "mixed"),
  ("11", 5, "2021-01-01", "Philadelphia, PA", "5", "00", "17", "30", "The long distance training has helped me improve my endurance considerably.", TRUE, "clear", "trail", "mixed"),
  ("12", 1, "2021-01-01", "Philadelphia, PA", "5", "00", "17", "30", "The long distance training has helped me improve my endurance considerably.", TRUE, "clear", "trail", "mixed");


COMMIT;