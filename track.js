// Import the required modules
const mysql = require('mysql2/promise');
const UAParser = require('ua-parser-js'); // Import ua-parser-js instead of device-detector-js

// Import the MySQL connection pool
const pool = require('./db_connection');

module.exports = function(app) {
  app.get('/track', async (req, res) => {
    const pageUrl = req.query.u;
    const userAgent = req.query.ua;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; // Get the IP address of the client

    const parser = new UAParser(userAgent); // Create a new parser instance with the user agent string
    const deviceType = parser.getDevice().type || 'unknown'; // Get the device type

    const visitDate = new Date(); // Get the current date and time

    const connection = await pool.getConnection(); // Get a connection from the MySQL connection pool

    try {
      // Check if there is an existing visit record for the page URL, IP address, and device type
      const [rows] = await connection.execute(
        'SELECT id, visits FROM visits WHERE url = ? AND ip = ? AND device_type = ?',
        [pageUrl, ip, deviceType]
      );

      // If there is no existing visit record, insert a new record with the current visit count set to 1
      if (rows.length === 0) {
        await connection.execute(
          'INSERT INTO visits (url, ip, device_type, user_agent, device_info, visits, date) VALUES (?, ?, ?, ?, ?, 1, ?)',
          [pageUrl, ip, deviceType, userAgent, JSON.stringify(parser.getResult()), visitDate]
        );
      }
      // If there is an existing visit record, update the record with the current visit count incremented by 1
      else {
        const visitId = rows[0].id;
        const newVisits = rows[0].visits + 1;
        await connection.execute(
          'UPDATE visits SET user_agent = ?, device_info = ?, visits = ?, date = ? WHERE id = ?',
          [userAgent, JSON.stringify(parser.getResult()), newVisits, visitDate, visitId]
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      // Release the connection back to the pool
      await connection.release();
    }

    // Return a success status code
    res.sendStatus(200);
  });
};
