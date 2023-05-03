// Import required modules
const express = require('express');
const trackingController = require('./Controllers/trackingController');

// Create an instance of the Express application
const app = express();
const port = 3000;

// Serve static files from the public folder
app.use(express.static('public'));

// Set up the improvedTracking route
app.get('/improvedTracking', trackingController.improvedTracking);

// Test the app
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Function to start the server
function startServer() {
  const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
  return server;
}

// Start the server only if the script is executed directly
if (require.main === module) {
  startServer();
}

// Export the app for testing
module.exports = app;