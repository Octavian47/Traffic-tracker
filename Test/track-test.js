// Import required modules
const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
const supertest = require('supertest');

// Import the server and the database connection pool
const server = require('../app');
const pool = require('../db_connection');

// Configure Chai to use the chaiHttp plugin
chai.use(chaiHttp);

describe('Track Module', () => {
  // Test the /track endpoint
  it('Should track a visit and delete it after the test', async () => {
    const testUrl = 'https://example.com';
    const testUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36';

    const res = await supertest(server)
      .get('/track')
      .query({ u: testUrl, ua: testUserAgent });

    expect(res.status).to.equal(200);

    // Clean up the test data from the database
    const connection = await pool.getConnection();
    try {
      await connection.execute(
        'DELETE FROM visits WHERE url = ? AND user_agent = ?',
        [testUrl, testUserAgent]
      );
    } catch (error) {
      console.error('Error deleting test data from the database:', error);
    } finally {
      await connection.release();
    }
  });
});