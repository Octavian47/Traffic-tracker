const UAParser = require('ua-parser-js');
const pool = require('../db_connection');

exports.improvedTracking = async (req, res) => {
  // Extract data from request query and headers
  const pageUrl = req.query.url;
  const pageTitle = req.query.title;
  const userAgent = req.query.ua;
  const timeOnPage = req.query.time;
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  // Use user agent parser to extract device type and other info
  const parser = new UAParser(userAgent);
  const deviceType = parser.getDevice().type || 'unknown';

  // Get current date and time
  const visitDate = new Date();

  // Establish database connection
  const connection = await pool.getConnection();
  
  try {
    // Check if there is an existing visit for this page from this device
    const [visitRows] = await connection.execute(
      `SELECT visits_version_improved.id, visits_version_improved.visits, page.id AS pageId 
      FROM visits_version_improved 
      LEFT JOIN page_visit ON visits_version_improved.id = page_visit.visit_id 
      LEFT JOIN page ON page_visit.page_id = page.id 
      WHERE page.url = ? AND visits_version_improved.ip = ? AND visits_version_improved.device_type = ?`,
      [pageUrl, ip, deviceType]
    );

    let visitId, newVisits;

    if (visitRows.length === 0) {
      // If there is no existing visit, insert a new one and set newVisits to 1
      const [insertVisitResult] = await connection.execute(
        'INSERT INTO visits_version_improved (ip, device_type, user_agent, device_info, visits) VALUES (?, ?, ?, ?, 1)',
        [ip, deviceType, userAgent, JSON.stringify(parser.getResult())]
      );
      visitId = insertVisitResult.insertId;
      newVisits = 1;
    } else {
      // If there is an existing visit, update it and increment newVisits
      visitId = visitRows[0].id;
      newVisits = visitRows[0].visits + 1;
      await connection.execute(
        'UPDATE visits_version_improved SET user_agent = ?, device_info = ?, visits = ? WHERE id = ?',
        [userAgent, JSON.stringify(parser.getResult()), newVisits, visitId]
      );
    }

    let pageId;

    if (visitRows.length === 0) {
      // If there is no existing visit, insert a new page and get its ID
      const [insertPageResult] = await connection.execute(
        'INSERT INTO page (url, title) VALUES (?, ?)',
        [pageUrl, pageTitle]
      );
      pageId = insertPageResult.insertId;
    } else {
      // If there is an existing visit, get the page ID from the first row in visitRows
      pageId = visitRows[0].pageId;
    }

    // Insert a new page visit with the visit ID, page ID, time on page, and visit date
    await connection.execute(
      'INSERT INTO page_visit (visit_id, page_id, duration, date) VALUES (?, ?, ?, ?)',
      [visitId, pageId, timeOnPage, visitDate]
    );
  } catch (error) {
    console.error('Error tracking visit:', error);
    // If there is an error, send a 500 error response and return
    res.sendStatus(500);
    return;
  } finally {
    // Release the database connection in a finally block to ensure it is always released
    await connection.release();
  }

  res.status(200);
};
