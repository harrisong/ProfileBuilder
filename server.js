const express = require('express');
const request = require('request');
const config = require('./config.json');

const app = express();

const oauthCallbacks = require('./routes/oauth_callbacks');
oauthCallbacks(app);

const githubRoutes = require('./routes/github_routes');
Object.keys(githubRoutes).forEach(key => {
  githubRoutes[key](app);
});

const server = app.listen(8080);

module.exports = server;
