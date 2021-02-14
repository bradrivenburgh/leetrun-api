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

INSERT INTO run_entries (id, date, location, distance, hours, minutes, seconds, notes, public, weather, surface, terrain, user_id)
VALUES
  ('1', '2021-02-01', 'Philadelphia, PA', '5', '00', '17', '00', 'Great run!', TRUE, 'clear', 'pavement', 'flat', 1),
  ('2', '2021-01-15', 'Haddonfield, NJ', '10', '00', '40', '00', 'Great run!', TRUE, 'rain', 'pavement', 'mixed', 2),
  ('3', '2021-01-14', 'Cinnaminson, NJ', '15', '01', '02', '00', 'Exhausting!', FALSE, 'snow', 'pavement', 'uphill', 3),
  ('4', '2021-01-05', 'Langhorne, PA', '25', '01', '20', '00', 'Run down a mountain. My quads hurt!', TRUE, 'clear', 'pavement', 'downhill', 4),
  ('5', '2021-01-04', 'Philadelphia, PA', '30', '02', '00', '00', 'Almost at marathon distance', TRUE, 'clear', 'pavement', 'mixed', 5),
  ('6', '2021-01-01', 'Philadelphia, PA', '5', '00', '17', '30', 'The long distance training has helped me improve my endurance considerably.', TRUE, 'clear', 'trail', 'mixed', 4),
  ('7', '2021-01-01', 'Philadelphia, PA', '5', '00', '17', '30', 'The long distance training has helped me improve my endurance considerably.', TRUE, 'clear', 'trail', 'mixed', 1),
  ('8', '2021-01-01', 'Philadelphia, PA', '5', '00', '17', '30', 'The long distance training has helped me improve my endurance considerably.', TRUE, 'clear', 'trail', 'mixed', 2),
  ('9', '2021-01-01', 'Philadelphia, PA', '5', '00', '17', '30', 'The long distance training has helped me improve my endurance considerably.', TRUE, 'clear', 'trail', 'mixed', 3),
  ('10', '2021-01-01', 'Philadelphia, PA', '5', '00', '17', '30', 'The long distance training has helped me improve my endurance considerably.', TRUE, 'clear', 'trail', 'mixed', 4),
  ('11', '2021-01-01', 'Philadelphia, PA', '5', '00', '17', '30', 'The long distance training has helped me improve my endurance considerably.', TRUE, 'clear', 'trail', 'mixed', 5),
  ('12', '2021-01-01', 'Philadelphia, PA', '5', '00', '17', '30', 'The long distance training has helped me improve my endurance considerably.', TRUE, 'clear', 'trail', 'mixed', 1);

COMMIT;