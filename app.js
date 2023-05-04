const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));

// Import route files
const trackingRoutes = require('./Routes/trackingRoutes');
const statsRoutes = require('./Routes/statsRoutes');
const uniqueVisitsRoutes = require('./Routes/uniqueVisitsRoutes');

// Use route files
app.use('/', trackingRoutes);
app.use('/', statsRoutes);
app.use('/', uniqueVisitsRoutes);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

function startServer() {
  const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
  return server;
}

let server;

if (require.main === module) {
  server = startServer();
}

module.exports = { app, server };