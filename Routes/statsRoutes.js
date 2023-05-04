const express = require('express');
const router = express.Router();
const statsController = require('../Controllers/statsController');

router.get('/stats', statsController.getStats);

module.exports = router;