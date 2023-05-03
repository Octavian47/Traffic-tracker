// Import the required modules
const UAParser = require('ua-parser-js');
const pool = require('./db_connection');

module.exports = function (app) {
  app.get('/improvedTracking', async (req, res) => {
    const pageUrl = req.query.url;
    const pageTitle = req.query.title;
    const userAgent = req.query.ua;
    const timeOnPage = req.query.time;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const parser = new UAParser(userAgent);
    const deviceType = parser.getDevice().type || 'unknown';
    const visitDate = new Date();

    const connection = await pool.getConnection();

    try {
      // Check if there is an existing visit record for the page URL, IP address, and device type
      const [visitRows] = await connection.execute(
        `SELECT visits_version_improved.id, visits_version_improved.visits, page.id AS pageId 
        FROM visits_version_improved 
        LEFT JOIN page_visit ON visits_version_improved.id = page_visit.visit_id 
        LEFT JOIN page ON page_visit.page_id = page.id 
        WHERE page.url = ? AND visits_version_improved.ip = ? AND visits_version_improved.device_type = ?`,
        [pageUrl, ip, deviceType]
      );

      let visitId, newVisits;

      // If there is no existing visit record, insert a new record with the current visit count set to 1
      if (visitRows.length === 0) {
        const [insertVisitResult] = await connection.execute(
          'INSERT INTO visits_version_improved (ip, device_type, user_agent, device_info, visits, date) VALUES (?, ?, ?, ?, 1, ?)',
          [ip, deviceType, userAgent, JSON.stringify(parser.getResult()), visitDate]
        );
        visitId = insertVisitResult.insertId;
        newVisits = 1;
      }
      // If there is an existing visit record, update the record with the current visit count incremented by 1
      else {
        visitId = visitRows[0].id;
        newVisits = visitRows[0].visits + 1;
        await connection.execute(
          'UPDATE visits_version_improved SET user_agent = ?, device_info = ?, visits = ?, date = ? WHERE id = ?',
          [userAgent, JSON.stringify(parser.getResult()), newVisits, visitDate, visitId]
        );
      }

      let pageId;

      // If there is no existing page record, insert a new record with the page URL and title
      if (visitRows.length === 0) {
        const [insertPageResult] = await connection.execute(
          'INSERT INTO page (url, title) VALUES (?, ?)',
          [pageUrl, pageTitle]
        );
        pageId = insertPageResult.insertId;
      }
      // If there is an existing page record, use its ID
      else {
        pageId = visitRows[0].pageId;
      }

      // Insert a new page_visit record with the visit ID, page ID, and time spent on the page
      await connection.execute(
        'INSERT INTO page_visit (visit_id, page_id, duration) VALUES (?, ?, ?)',
        [visitId, pageId, timeOnPage]
      );
    } catch (error) {
      console.error('Error tracking visit:', error);
      res.sendStatus(500);
      return;
    } finally {
      await connection.release();
    }

    res.sendStatus(200);
  });
};