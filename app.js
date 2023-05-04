// Import the express module
const express = require('express');

// Create an instance of the express application
const app = express();

// Set the port to 3000
const port = process.env.PORT || 3000;

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Import route files
const trackingRoutes = require('./Routes/trackingRoutes');
const statsRoutes = require('./Routes/statsRoutes');
const uniqueVisitsRoutes = require('./Routes/uniqueVisitsRoutes');

// Use route files
app.use('/', trackingRoutes);
app.use('/', statsRoutes);
app.use('/', uniqueVisitsRoutes);

// Define a function to start the server and listen on the specified port
function startServer() {
  const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
  return server;
}

let server;

// If this module is the main module, start the server
if (require.main === module) {
  server = startServer();
}

// Export the app and server objects for testing
module.exports = { app, server };