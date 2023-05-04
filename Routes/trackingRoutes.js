// Import the required modules and controllers
const express = require('express');
const router = express.Router();
const trackingController = require('../Controllers/trackingController');

// Define the route and the controller method that will handle requests to the '/tracking' endpoint
router.get('/improvedTracking', trackingController.improvedTracking);

// Export the router object
module.exports = router;