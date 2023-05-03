// Import required modules
const express = require('express');

// Create an instance of the Express application
const app = express();
const port = 3000;

// Require and include the tracking module
const tracking = require('./track');

// Add the tracking module to the app instance
tracking(app); 


//Test the app
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start the server listening on the specified port
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});