// Import required modules
const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;

// Import the server and the database connection pool
const server = require('../app'); // Assuming the Express app is exported in app.js
const pool = require('../db_connection');

// Configure Chai to use the chaiHttp plugin
chai.use(chaiHttp);

describe('Improved Tracking Module', () => {
  // Test the /improvedTracking endpoint
  it('Should track a visit and delete it after the test', async () => {
    const testUrl = 'https://example.com';
    const testTitle = 'Example Page';
    const testUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36';
    const testTimeOnPage = '5000';

    const res = await chai.request(server)
      .get('/improvedTracking')
      .query({ url: testUrl, title: testTitle, ua: testUserAgent, time: testTimeOnPage });

    expect(res.status).to.equal(200);

    // Clean up the test data from the database
    const connection = await pool.getConnection();
    try {
      const [visitRows] = await connection.execute(
        `SELECT visits_version_improved.id 
        FROM visits_version_improved 
        LEFT JOIN page_visit ON visits_version_improved.id = page_visit.visit_id 
        LEFT JOIN page ON page_visit.page_id = page.id 
        WHERE page.url = ? AND visits_version_improved.user_agent = ?`,
        [testUrl, testUserAgent]
      );

      if (visitRows.length > 0) {
        const visitId = visitRows[0].id;
        await connection.execute('DELETE FROM page_visit WHERE visit_id = ?', [visitId]);
        await connection.execute('DELETE FROM visits_version_improved WHERE id = ?', [visitId]);
      }

      await connection.execute('DELETE FROM page WHERE url = ?', [testUrl]);
    } catch (error) {
      console.error('Error deleting test data from the database:', error);
    } finally {
      await connection.release();
    }
  });
});