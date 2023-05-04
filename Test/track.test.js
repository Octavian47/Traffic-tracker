// Import the necessary modules and dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { expect } = chai;
chai.use(chaiHttp);

// Import the app, pool, and cleanDatabase function
const { app } = require('../app');
const pool = require('../db_connection');

const cleanDatabase = async () => {
  // Clean the database by deleting all entries and disabling/reenabling foreign key checks
  const connection = await pool.getConnection();
  try {
    await connection.execute('SET FOREIGN_KEY_CHECKS = 0'); // Disable foreign key checks
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

// Define the tests for the Unique Visits Controller
describe('Unique Visits Controller', () => {
  // Before each test, clean the database
  beforeEach(async () => {
    await cleanDatabase();
  });

  // After each test, restore all the stubs
  afterEach(() => {
    sinon.restore();
  });

  // Test the '/uniqueVisits' endpoint when provided with a valid startDate and endDate
  it('should return visit statistics', (done) => {
    // Define fake data to return from the stubbed pool.getConnection().execute() method
    const fakeData = [
      {
        id: 1,
        title: 'Page 1',
        url: '/page1',
        uniqueVisits: 10,
      },
      {
        id: 2,
        title: 'Page 2',
        url: '/page2',
        uniqueVisits: 15,
      },
    ];

    // Define valid startDate and endDate query parameters
    const startDate = '2023-05-01';
    const endDate = '2023-05-03';

    // Stub the pool.getConnection method to return a fake connection object
    sinon.stub(pool, 'getConnection').returns({
      execute: () => Promise.resolve([fakeData]),
      release: () => Promise.resolve(),
    });

    // Make a GET request to the '/uniqueVisits' endpoint with the startDate and endDate query parameters
    chai
      .request(app)
      .get('/uniqueVisits')
      .query({ startDate, endDate })
      .end((err, res) => {
        // Assert that there is no error and the response has a status code of 200
        expect(err).to.be.null;
        expect(res).to.have.status(200);

        // Assert that the response body is an array that matches the fake data
        expect(res.body).to.be.an('array');
        expect(res.body).to.deep.equal(fakeData);

        // Call the done() function to indicate that the test is complete
        done();
      });
  });

 // Test the '/uniqueVisits' endpoint when missing the startDate or endDate query parameter
 it('should return 400 if startDate or endDate is missing', (done) => {
  // Make a GET request to the '/uniqueVisits' endpoint without any query parameters
  chai
    .request(app)
    .get('/uniqueVisits')
    .end((err, res) => {
      // Assert that there is no error and the response has a status code of 400
      expect(err).to.be.null;
      expect(res).to.have.status(400);
       // Assert that the response body contains an error message
    expect(res.body).to.have.property('error', 'Missing startDate or endDate');
    
    // Call the done callback to end the test
    done();
  });

});

// Test the '/uniqueVisits' endpoint when there is an error fetching visit statistics
it('should return 500 if there is an error fetching visit statistics', (done) => {
// Define mock startDate and endDate query parameters
const startDate = '2023-05-01';
const endDate = '2023-05-03';
// Stub the pool.getConnection method to return a fake connection object
const fakeConnection = {
  execute: sinon.stub().rejects(new Error('Failed to fetch visit statistics')),
  release: sinon.stub().resolves(),
};
sinon.stub(pool, 'getConnection').resolves(fakeConnection);

// Make a GET request to the '/uniqueVisits' endpoint with the mock query parameters
chai
  .request(app)
  .get('/uniqueVisits')
  .query({ startDate, endDate })
  .end((err, res) => {
    // Assert that there is no error and the response has a status code of 500
    expect(err).to.be.null;
    expect(res).to.have.status(500);

    // Assert that the response body contains an error message
    expect(res.body).to.have.property('error', 'Failed to fetch visit statistics');

    // Restore the stub and call the done callback to end the test
    pool.getConnection.restore();
    done();
  });
});
});
