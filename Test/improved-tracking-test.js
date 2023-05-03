const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
const supertest = require('supertest');
const server = require('../app');
const pool = require('../db_connection');

chai.use(chaiHttp);

describe('Improved Tracking Module', () => {
  it('Should track a visit and return a status of 200', async () => {
    const testUrl = 'https://example.com';
    const testTitle = 'Example Page';
    const testUserAgent =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36';
    const testTimeOnPage = 120;
    let visitId;

    try {
      const res = await supertest(server)
        .get('/improvedTracking')
        .query({
          url: testUrl,
          title: testTitle,
          ua: testUserAgent,
          time: testTimeOnPage,
        });

      expect(res.status).to.equal(200);
      expect(res.body.visitId).to.be.a('number');
      visitId = res.body.visitId;

      // Delete child records in page_visit table
      await pool.execute('DELETE FROM page_visit WHERE visit_id = ?', [visitId]);

      // Delete parent records in visits_version_improved and page tables
      await pool.execute('DELETE FROM visits_version_improved WHERE id = ?', [visitId]);
      await pool.execute('DELETE FROM page WHERE url = ?', [testUrl]);
    } catch (error) {
      console.error('Error tracking visit:', error);
      throw error;
    }
  });

  after(async () => {
    // Clean up the data after testing
    const connection = await pool.getConnection();
    try {
      await connection.query('DELETE FROM page_visit');
      await connection.query('DELETE FROM page');
      await connection.query('DELETE FROM visits_version_improved');
    } catch (error) {
      console.error('Error cleaning up data after testing:', error);
    } finally {
      connection.release();
    }
  });
});