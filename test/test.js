const mocha = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');

const { expect } = chai;
chai.use(chaiHttp);

const {
  describe,
  beforeEach,
  afterEach,
  it,
} = mocha;

describe('loading express', () => {
  let app;
  beforeEach(() => {
    app = require('../server'); // eslint-disable-line global-require
  });
  afterEach(() => {
    app.close();
  });

  it('redirects to auth login page', (done) => {
    const requester = chai.request(app);
    requester.get('/login')
      .redirects(0)
      .end((err, res) => {
        expect(res).to.have.status(302);
        done();
      });
  });
});
