// Import required modules
const express = require('express');

// Create an instance of the Express application
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello, World!');
  });

// Start the server listening on the specified port
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });