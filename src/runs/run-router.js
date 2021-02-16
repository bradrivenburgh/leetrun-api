const express = require('express');
const RunService = require('./run-service');
const { requireAuth } = require('../middleware/jwt-auth');

const runRouter = express.Router();

runRouter
  .route('/')
  .get(requireAuth, (req, res, next) => {
    RunService.getUserRuns(req.user.id, req.app.get('db'))
      .then(runEntries => {
        res.json(runEntries.map(RunService.serializeRuns));
      })
      .catch(next);
  })

runRouter
  .route('/:run_id')
  .all(requireAuth)
  

module.exports = runRouter;