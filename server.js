const express = require('express');
const oauthCallbacks = require('./routes/oauth_callbacks');
const githubRoutes = require('./routes/github_routes');

const app = express();

oauthCallbacks(app);

Object.keys(githubRoutes).forEach((key) => {
  githubRoutes[key](app);
});

const server = app.listen(8080);

module.exports = server;
