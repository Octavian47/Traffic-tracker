// Import required modules
const express = require('express');

// Create an instance of the Express application
const app = express();
const port = 3000;

// Serve static files from the public folder
app.use(express.static('public'));

// Require and include the tracking and stats modules
const tracking = require('./track');
const improvedTracking = require('./improvedTracking');
const stats = require('./stats'); 

// Add the tracking and stats modules to the app instance
tracking(app);
improvedTracking(app);
stats(app);

// Test the app
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start the server listening on the specified port
const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

module.exports = server;