const pool = require('../db_connection');

exports.getStats = async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({ error: 'Missing startDate or endDate' });
  }

  const connection = await pool.getConnection();

  try {
    const [rows] = await connection.execute(
      `SELECT visits_version_improved.id, page.url, visits_version_improved.ip, visits_version_improved.device_type, 
      visits_version_improved.user_agent, visits_version_improved.device_info, visits_version_improved.visits, page_visit.date, page_visit.duration
      FROM visits_version_improved 
      LEFT JOIN page_visit ON visits_version_improved.id = page_visit.visit_id 
      LEFT JOIN page ON page_visit.page_id = page.id 
      WHERE page_visit.date BETWEEN ? AND ?`,
      [startDate, endDate]
    );

    const stats = rows.map((row) => ({
      id: row.id,
      url: row.url,
      ip: row.ip,
      deviceType: row.device_type,
      userAgent: row.user_agent,
      deviceInfo: JSON.parse(row.device_info),
      visits: row.visits,
      date: row.date,
      duration: row.duration,
    }));

    res.json(stats);
  } catch (error) {
    console.error('Error fetching visit statistics:', error);
    res.status(500).json({ error: 'Failed to fetch visit statistics' });
  } finally {
    await connection.release();
  }
};