const express = require("express");
const path = require("path");
const ValidationService = require('../validation-service');
const { requiredDictionary } = require('../caller-validation');
const RunService = require("./run-service");
const { requireAuth } = require("../middleware/jwt-auth");

const runRouter = express.Router();

runRouter.get("/", requireAuth, (req, res, next) => {
  RunService.getUserRuns(req.user.id, req.app.get("db"))
    .then((runEntries) => {
      res.json(runEntries.map(RunService.serializeRuns));
    })
    .catch(next);
});

runRouter.post("/", requireAuth, (req, res, next) => {
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

  const required = [
    "id",
    "date",
    "location",
    "distance",
    "hours",
    "minutes",
    "seconds",
  ];

  // Validate the data

  const missingAndInvalidProps = ValidationService.validateProperties(
    newEntry, 
    requiredDictionary
  );
  
  if (
    missingAndInvalidProps.invalidProps.length ||
    missingAndInvalidProps.missingProps.length
  ) {
    const validationErrorObj = ValidationService.createValidationErrorObject(
      missingAndInvalidProps
    );
    // logger.error(validationErrorObj.error.message);
    return res.status(400).json(validationErrorObj);
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

runRouter
  .route("/:run_id")
  .all(requireAuth)
  .all((req, res, next) => {
    const entryId = req.params.run_id;
    RunService.getById(entryId, req.app.get("db"))
      .then((entry) => {
        if (!entry) {
          return res.status(404).json({
            error: "Run entry does not exist",
          });
        }
        res.entry = entry;
        next();
      })
      .catch(next);
  });

runRouter.get("/:run_id", (req, res, next) => {
  res.json(RunService.serializeRuns(res.entry));
});

runRouter
.delete("/:run_id", (req, res, next) => {
    const runId = req.params.run_id;
    RunService.deleteRun(runId, req.app.get("db"))
      .then(() => {
        res
          .status(204)
          .end()
      })
      .catch(next);
});


module.exports = runRouter;
