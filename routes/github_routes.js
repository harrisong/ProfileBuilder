const config = require('../config.json');
const githubService = require('../services/github_service');

const authorize = app => {
  app.get('/login/github', (req, res) => {
    res.redirect(`https://github.com/login/oauth/authorize?client_id=${config.client_id}&scope=user public_repo repo read:org&state=dummystate`);
  });
};

const getCommits = app => {
  app.get('/get_commits', (req, res) => {
    githubService.getCommits(req, res);
  });
};

module.exports = {
  authorize,
  getCommits,
};
