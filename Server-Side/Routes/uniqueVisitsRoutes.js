// Import the required modules and controllers
const express = require('express');
const router = express.Router();
const uniqueVisitsController = require('../Controllers/uniqueVisitsController');

// Define the route and the controller method that will handle requests to the '/uniqueVisits' endpoint
router.get('/uniqueVisits', uniqueVisitsController.getStats);

// Export the router object
module.exports = router;

