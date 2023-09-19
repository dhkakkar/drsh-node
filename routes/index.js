const express = require('express');
const router = express.Router()

router.use('/', require('./getRoutes'));

module.exports = router;