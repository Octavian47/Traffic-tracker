// Import the required modules and controllers
const express = require('express');
const router = express.Router();
const statsController = require('../Controllers/statsController');

// Define the route and the controller method that will handle requests to the '/stats' endpoint
router.get('/stats', statsController.getStats);

// Export the router object
module.exports = router;