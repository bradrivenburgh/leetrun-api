const express = require('express');
const RunService = require('./run-service');
const { requireAuth } = require('../middleware/jwt-auth');

const runRouter = express.Router();



module.exports = runRouter;