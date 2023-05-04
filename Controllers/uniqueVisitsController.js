const pool = require('../db_connection');

exports.getStats = async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({ error: 'Missing startDate or endDate' });
  }

  const connection = await pool.getConnection();

  try {
    const [rows] = await connection.execute(
      `SELECT page.id, page.title, page.url, COUNT(DISTINCT visits_version_improved.ip) AS uniqueVisits
      FROM visits_version_improved
      LEFT JOIN page_visit ON visits_version_improved.id = page_visit.visit_id
      LEFT JOIN page ON page_visit.page_id = page.id
      WHERE page_visit.date BETWEEN ? AND ?
      GROUP BY page.id, page.title, page.url`,
      [startDate, endDate]
    );

    const stats = rows.map((row) => ({
      id: row.id,
      title: row.title,
      url: row.url,
      uniqueVisits: row.uniqueVisits,
    }));

    res.json(stats);
  } catch (error) {
    console.error('Error fetching visit statistics:', error);
    res.status(500).json({ error: 'Failed to fetch visit statistics' });
  } finally {
    await connection.release();
  }
};
