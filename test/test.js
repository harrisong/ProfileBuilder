const assert = require('assert');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);


describe('loading express', function () {
  let app;
  beforeEach(function () {
    app = require('../server');
  });
  afterEach(function () {
    app.close();
  });

  it('redirects to auth login page', function(done) {
    const requester = chai.request(app)
    requester.get('/login')
      .redirects(0)
      .end(function (err, res) {
        expect(res).to.have.status(302);
        done();
      });
  });
});
