const mysql = require('mysql2/promise');

// Define the MySQL server credentials
const dbConfig = {
  host: 'localhost',
  user: 'root', // change to your MySQL username
  password: '', // change to your MySQL password
  database: 'traffic_tracker',
};

// Create a connection pool to the MySQL database
const pool = mysql.createPool(dbConfig);

// Test: Add an event listener for the 'connection' event
pool.on('connection', (connection) => {
  console.log('Connected to the MySQL database.');
});

// Test: Add an event listener for the 'error' event
pool.on('error', (error) => {
  console.error('Error connecting to the MySQL database:', error);
});

module.exports = pool;