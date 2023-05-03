// Import the MySQL connection pool
const pool = require('./db_connection');


module.exports = function (app) {
  // Create a new route for the /stats endpoint that handles GET requests
  app.get('/stats', async (req, res) => {
    // Extract the startDate and endDate query parameters from the request
    const { startDate, endDate } = req.query;

    // Check if startDate and endDate are provided
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Missing startDate or endDate' });
    }

    // Get a connection from the MySQL connection pool
    const connection = await pool.getConnection();

    try {
      // Query the database for visit statistics between startDate and endDate
      const [rows] = await connection.execute(
        'SELECT id, url, ip, device_type, user_agent, device_info, visits, date FROM visits WHERE date BETWEEN ? AND ?',
        [startDate, endDate]
      );

      // Format the data as a JSON object and map each row from the database query result to a JavaScript object
      const stats = rows.map((row) => ({
        id: row.id,
        url: row.url,
        ip: row.ip,
        deviceType: row.device_type,
        userAgent: row.user_agent,
        deviceInfo: JSON.parse(row.device_info), // Parse the JSON string
        visits: row.visits,
        date: row.date,
      }));

      // Return the JSON object as the response
      res.json(stats);
    } catch (error) {
      // Log the error and return a 500 Internal Server Error status with an error message
      console.error('Error fetching visit statistics:', error);
      res.status(500).json({ error: 'Failed to fetch visit statistics' });
    } finally {
      // Release the connection back to the pool
      await connection.release();
    }
  });
};