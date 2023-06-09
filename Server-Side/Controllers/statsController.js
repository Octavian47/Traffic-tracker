// Import the database connection pool
const pool = require('../db_connection');

// Define the getStats controller function to handle requests for visit statistics
exports.getStats = async (req, res) => {
  // Extract the startDate and endDate query parameters from the request
  const { startDate, endDate } = req.query;

  // Return a 400 Bad Request response if either startDate or endDate is missing
  if (!startDate || !endDate) {
    return res.status(400).json({ error: 'Missing startDate or endDate' });
  }

  // Get a connection from the pool
  const connection = await pool.getConnection();

  try {
    // Query the database for visit statistics within the given date range
    const [rows] = await connection.execute(
      `SELECT visits_version_improved.id, page.url, visits_version_improved.ip, visits_version_improved.device_type, 
      visits_version_improved.user_agent, visits_version_improved.device_info, visits_version_improved.visits, page_visit.date, page_visit.duration
      FROM visits_version_improved 
      LEFT JOIN page_visit ON visits_version_improved.id = page_visit.visit_id 
      LEFT JOIN page ON page_visit.page_id = page.id 
      WHERE page_visit.date BETWEEN ? AND ?`,
      [startDate, endDate]
    );

    // Map the query results to an array of objects with the desired fields
    const stats = rows.map((row) => ({
      id: row.id,
      url: row.url,
      ip: row.ip,
      deviceType: row.device_type,
      userAgent: row.user_agent,
      deviceInfo: row.device_info ? JSON.parse(row.device_info) : null,
      visits: row.visits,
      date: row.date,
      duration: row.duration,
    }));

    // Send the array of visit statistics in the response body
    res.json(stats);
  } catch (error) {
    // Handle any errors that occur during the database query
    console.error('Error in controller:', error);
    res.status(500).json({ error: 'Failed to fetch visit statistics' });
  } finally {
    // Release the database connection back to the pool
    await connection.release();
  }
};