const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, startServer } = require('../app');
const pool = require('../db_connection');
const expect = chai.expect;

chai.use(chaiHttp);

const cleanDatabase = async () => {
  const connection = await pool.getConnection();

  try {
    // Disable foreign key checks and delete all rows from relevant tables
    await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
    await connection.execute('DELETE FROM page_visit');
    await connection.execute('DELETE FROM visits_version_improved');
    await connection.execute('DELETE FROM page');
    await connection.execute('SET FOREIGN_KEY_CHECKS = 1'); // Re-enable foreign key checks
  } catch (error) {
    console.error('Error cleaning database:', error);
  } finally {
    await connection.release();
  }
};

// Start the server before running the tests
const server = startServer();

describe('Improved Tracking Controller', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  after(() => {
    server.close();
  });

  it('Should track a new visit and return a 200 status', async () => {
    const testParams = {
      url: 'https://example.com/test',
      title: 'Test Page',
      ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
      time: 3000
    };
  
    try {
      const res = await chai
        .request(app)
        .get('/improvedTracking')
        .query(testParams)
        .set('x-forwarded-for', '123.123.123.123');
  
      expect(res).to.have.status(200);
    } catch (err) {
      throw err;
    }
  });

  it('Should return a 400 status on invalid input', async () => {
    const testParams = {
      url: '',
      title: '',
      ua: '',
      time: ''
    };
  
    try {
      const res = await chai
        .request(app)
        .get('/improvedTracking')
        .query(testParams);
  
      expect(res).to.have.status(400);
    } catch (err) {
      throw err;
    }
  });
});
