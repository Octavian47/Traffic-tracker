const express = require('express');
const router = express.Router();
const uniqueVisitsController = require('../Controllers/uniqueVisitsController');

router.get('/uniqueVisits', uniqueVisitsController.getStats);

module.exports = router;

