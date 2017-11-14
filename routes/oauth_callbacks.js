const githubService = require('../services/github_service');

module.exports = (app) => {
  app.get('/callback/:service', (req, res) => {
    const [state, code] = [req.query.state, req.query.code];
    if (state !== 'dummystate') throw new Error('Wrong state');
    if (!code) throw new Error('Empty code');

    switch (req.params.service) {
      case 'github':
        githubService.getAccessToken(code, res);
        break;
    }
  });
};
