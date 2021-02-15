const express = require('express');
const RunService = require('./run-service');
const { requireAuth } = require('../middleware/jwt-auth');

const runRouter = express.Router();

runRouter
  .route('/')
  .get(requireAuth, (req, res, next) => {
    console.log(req.user.id)
    RunService.getUserRuns(req.user.id, req.app.get('db'))
      .then(runEntries => {
        res.json(runEntries.map(RunService.serializeRuns));
      })
      .catch(next);
  })


module.exports = runRouter;