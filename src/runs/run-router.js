const express = require("express");
const path = require("path");
const ValidationService = require("../validation-service");
const { requiredDictionary } = require("../caller-validation");
const RunService = require("./run-service");
const { requireAuth } = require("../middleware/jwt-auth");

const runRouter = express.Router();

runRouter.get("/", requireAuth, (req, res, next) => {
  RunService.getUserRuns(req.user.id, req.app.get("db"))
    .then((runEntries) => {
      return res.json(runEntries.map(RunService.serializeRuns));
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
    return res.status(400).json(validationErrorObj);
  }

  // Add user id into entry
  newEntry.user_id = req.user.id;

  // Insert into db with RunService
  RunService.insertRun(newEntry, req.app.get("db"))
    .then((entry) => {
      return res
        .status(201)
        .location(path.posix.join(req.originalUrl, `${entry.id}`))
        .json(RunService.serializeRuns(entry));
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

runRouter.delete("/:run_id", (req, res, next) => {
  const runId = req.params.run_id;
  RunService.deleteRun(runId, req.app.get("db"))
    .then(() => {
      return res.status(204).end();
    })
    .catch(next);
});

runRouter.patch("/:run_id", (req, res, next) => {
  let entryToUpdate = ({
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

  const { run_id } = req.params;

  // Validate the data
  const missingAndInvalidProps = ValidationService.validateProperties(
    entryToUpdate,
    requiredDictionary
  );

  if (
    missingAndInvalidProps.invalidProps.length ||
    missingAndInvalidProps.missingProps.length
  ) {
    const validationErrorObj = ValidationService.createValidationErrorObject(
      missingAndInvalidProps
    );
    return res.status(400).json(validationErrorObj);
  }

  RunService.updateRun(entryToUpdate, run_id, req.app.get('db'))
    .then(entry => {
      return res
        .status(204)
        .end();
    })
    .catch(next);
});

module.exports = runRouter;
