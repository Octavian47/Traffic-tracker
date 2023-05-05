const pool = require('../db_connection');

// Controller function for getting page visit statistics
exports.getStats = async (req, res) => {
  const { startDate, endDate } = req.query;

  // Check if the required query parameters are present
  if (!startDate || !endDate) {
    return res.status(400).json({ error: 'Missing startDate or endDate' });
  }

  // Get a database connection from the pool
  const connection = await pool.getConnection();

  try {
    // Execute the SQL query to get the page visit statistics
    const [rows] = await connection.execute(
      `SELECT page.id, page.title, page.url, COUNT(DISTINCT visits_version_improved.ip) AS uniqueVisits
      FROM visits_version_improved
      LEFT JOIN page_visit ON visits_version_improved.id = page_visit.visit_id
      LEFT JOIN page ON page_visit.page_id = page.id
      WHERE page_visit.date BETWEEN ? AND ?
      GROUP BY page.id, page.title, page.url`,
      [startDate, endDate]
    );

    // Map the result rows to the desired format for the response
    const stats = rows.map((row) => ({
      id: row.id,
      title: row.title,
      url: row.url,
      uniqueVisits: row.uniqueVisits,
    }));

    // Send the response with the page visit statistics
    res.json(stats);
  } catch (error) {
    // Log the error and send an error response
    console.error('Error fetching visit statistics:', error);
    res.status(500).json({ error: 'Failed to fetch visit statistics' });
  } finally {
    // Release the database connection back to the pool
    await connection.release();
  }
};