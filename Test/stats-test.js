// Import required modules
const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
const supertest = require('supertest');

// Import the server
const server = require('../app');

// Configure Chai to use the chaiHttp plugin
chai.use(chaiHttp);

// Test suite for the 'stats' endpoint
describe('Stats Module', () => {
  // Test the /stats endpoint
  it('Should retrieve visit statistics for a given date range', async () => {
    const startDate = '2023-01-01';
    const endDate = '2023-12-31';

    const res = await supertest(server)
      .get('/stats')
      .query({ startDate, endDate });

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');

    res.body.forEach((visit) => {
      expect(visit).to.have.property('id');
      expect(visit).to.have.property('url');
      expect(visit).to.have.property('ip');
      expect(visit).to.have.property('deviceType');
      expect(visit).to.have.property('userAgent');
      expect(visit).to.have.property('deviceInfo');
      expect(visit).to.have.property('visits');
      expect(visit).to.have.property('date');
      expect(new Date(visit.date)).to.be.within(new Date(startDate), new Date(endDate));
    });
  });
});