const express = require('express');
const router = express.Router();
const trackingController = require('../Controllers/trackingController');

router.get('/improvedTracking', trackingController.improvedTracking);

module.exports = router;