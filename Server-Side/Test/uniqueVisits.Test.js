const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { expect } = chai;
chai.use(chaiHttp);

const { app } = require('../app');
const pool = require('../db_connection');

const cleanDatabase = async () => {
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

describe('Unique Visits Controller', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

    
  afterEach(() => {
    sinon.restore();
  });

  it('should return visit statistics', (done) => {
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

    const startDate = '2023-05-01';
    const endDate = '2023-05-03';

    sinon.stub(pool, 'getConnection').returns({
      execute: () => Promise.resolve([fakeData]),
      release: () => Promise.resolve(),
    });

    chai
      .request(app)
      .get('/uniqueVisits')
      .query({ startDate, endDate })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.deep.equal(fakeData);
        done();
      });
  });

  it('should return 400 if startDate or endDate is missing', (done) => {
    chai
      .request(app)
      .get('/uniqueVisits')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('error', 'Missing startDate or endDate');
        done();
      });
  });

  it('should return 500 if there is an error fetching visit statistics', (done) => {
    const startDate = '2023-05-01';
    const endDate = '2023-05-03';
  
    const fakeConnection = {
      execute: sinon.stub().rejects(new Error('Failed to fetch visit statistics')),
      release: sinon.stub().resolves(),
    };
  
    sinon.stub(pool, 'getConnection').resolves(fakeConnection);
  
    chai
      .request(app)
      .get('/uniqueVisits')
      .query({ startDate, endDate })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(500);
        expect(res.body).to.have.property('error', 'Failed to fetch visit statistics');
        pool.getConnection.restore();
        done();
      });
  });
});