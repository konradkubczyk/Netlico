require('../bin/www');

const request = require('supertest');
const app = require('../app');

describe('App', function () {
  it('has the homepage', function (done) {
    request(app)
      .get('/')
      .expect(/Get started/, done);
  });
  it('redirects unauthorized clients', function (done) {
    request(app)
      .get('/account')
      .expect(302, done);
  });
});
