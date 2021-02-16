const express = require("express");
const path = require('path');
const RunService = require("./run-service");
const { requireAuth } = require("../middleware/jwt-auth");

const runRouter = express.Router();

runRouter.route("/").get(requireAuth, (req, res, next) => {
  RunService.getUserRuns(req.user.id, req.app.get("db"))
    .then((runEntries) => {
      res.json(runEntries.map(RunService.serializeRuns));
    })
    .catch(next);
});

runRouter.route("/").post(requireAuth, (req, res, next) => {
  // Get properties for run from request body
  let newEntry = ({
    id,
    date,
    location,
    distance,
    hours,
    minutes,
    seconds,
    notes,
    public,
    weather,
    surface,
    terrain,
  } = req.body);
  const required = { id, date, location, distance, hours, minutes, seconds };

  // Validate the data
  for (const [key, value] of Object.entries(newEntry)) {
    if (required[key] && value == null) {
      return res.status(400).json({
        error: `Missing '${key}' in request body`,
      });
    }
  }

  // Add user id into entry
  newEntry.user_id = req.user.id;
  // Sanitize
  newEntry = RunService.serializeRuns(newEntry);

  // Insert into db with RunService
  RunService.insertRun(newEntry, req.app.get("db"))
    .then((entry) => {
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `${entry.id}`))
        .json(entry);
    })
    .catch(next);
});

// runRouter
//   .route('/:run_id')
//   .all(requireAuth)

module.exports = runRouter;
