BEGIN;

TRUNCATE
  run_entries,
  leetrun_users
  RESTART IDENTITY CASCADE;

INSERT INTO leetrun_users (user_name, first_name, last_name, password)
VALUES
  ('BradR', 'Brad', 'Wilson', '$2a$04$wR8bUTCAYo5CjADgnyFACO8WUasIc/QYWPVxTId7M51vHX24CF.5y'),
  ('jogger', 'Betty', 'Boop', '$2a$12$VQ5HgWm34QQK2rJyLc0lmu59cy2jcZiV6U1.bE8rBBnC9VxDf/YQO'),
  ('sprinter', 'Charlie', 'Coolson', '$2a$12$2fv9OPgM07xGnhDbyL6xsuAeQjAYpZx/3V2dnu0XNIR27gTeiK2gK'),
  ('leetrunner', 'Sam', 'Champion', '$2a$12$/4P5/ylaB7qur/McgrEKwuCy.3JZ6W.cRtqxiJsYCdhr89V4Z3rp.'),
  ('rivdog', 'Alex', 'Trebek', '$2a$12$Hq9pfcWWvnzZ8x8HqJotveRHLD13ceS7DDbrs18LpK6rfj4iftNw.');

INSERT INTO run_entries (id, date, location, distance, hours, minutes, seconds, notes, public, weather, surface, terrain, user_id)
VALUES
  ('1', '2021-02-02', 'Philadelphia, PA', '5', '00', '17', '00', 'Great run!', TRUE, 'clear', 'pavement', 'flat', 1),
  ('2', '2021-02-15', 'Haddonfield, NJ', '10', '00', '40', '00', 'Great run!', TRUE, 'rain', 'pavement', 'mixed', 1),
  ('3', '2021-02-14', 'Cinnaminson, NJ', '15', '01', '02', '00', 'Exhausting!', FALSE, 'snow', 'pavement', 'uphill', 1),
  ('4', '2021-02-05', 'Langhorne, PA', '25', '01', '20', '00', 'Run down a mountain. My quads hurt!', TRUE, 'clear', 'pavement', 'downhill', 1),
  ('5', '2021-01-20', 'Philadelphia, PA', '30', '02', '00', '00', 'Ouch!  The blisters are real', TRUE, 'clear', 'pavement', 'mixed', 1),
  ('6', '2021-01-15', 'Philadelphia, PA', '5', '00', '17', '30', 'The long distance training has helped me improve my endurance considerably.', TRUE, 'clear', 'trail', 'mixed', 1),
  ('7', '2021-01-13', 'Philadelphia, PA', '5', '00', '17', '30', 'The long distance training has helped me improve my endurance considerably.', TRUE, 'clear', 'trail', 'mixed', 1),
  ('8', '2020-12-01', 'Philadelphia, PA', '5', '00', '17', '30', 'The long distance training has helped me improve my endurance considerably.', TRUE, 'clear', 'trail', 'mixed', 1),
  ('9', '2020-12-20', 'Philadelphia, PA', '5', '00', '17', '30', 'The long distance training has helped me improve my endurance considerably.', TRUE, 'clear', 'trail', 'mixed', 1),
  ('10', '2020-11-15', 'Philadelphia, PA', '5', '00', '17', '30', 'The long distance training has helped me improve my endurance considerably.', TRUE, 'clear', 'trail', 'mixed', 1),
  ('11', '2020-11-02', 'Philadelphia, PA', '5', '00', '17', '30', 'The long distance training has helped me improve my endurance considerably.', TRUE, 'clear', 'trail', 'mixed', 1),
  ('12', '2020-10-02', 'Philadelphia, PA', '5', '00', '17', '30', 'The long distance training has helped me improve my endurance considerably.', TRUE, 'clear', 'trail', 'mixed', 1),
  ('13', '2020-09-02', 'Philadelphia, PA', '5', '00', '17', '30', 'The long distance training has helped me improve my endurance considerably.', TRUE, 'clear', 'trail', 'mixed', 1),
  ('14', '2020-08-01', 'Philadelphia, PA', '5', '00', '17', '30', 'The long distance training has helped me improve my endurance considerably.', TRUE, 'clear', 'trail', 'mixed', 1);

COMMIT;