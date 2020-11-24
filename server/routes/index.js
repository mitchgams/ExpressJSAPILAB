const express = require('express');
const chirpsRouter = require('./chirps');
const usersRouter = require('./users');

let router = express.Router();

router.use('/chirps', chirpsRouter);

module.exports = router;