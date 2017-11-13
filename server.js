const express = require('express');
const app = express();
const fs = require('fs');
const request = require('request');
const simpleOauth2 = require('simple-oauth2');
const config = require('./config.json');

app.get('/callback', (req, res) => {
  const state = req.query.state;
  if (state !== 'dummystate') throw 'Wrong state';

  const code = req.query.code;
  if (!code) throw 'Empty code';

  const tokenConfig = {
    code: code,
    redirect_uri: `${config.host}/callback`
  };

  oauth2.authorizationCode.getToken(tokenConfig)
    .then((result) => {
      const accessToken = oauth2.accessToken.create(result);
      fs.writeFile(config.access_token_file, accessToken, (err) => {
        if (err) throw err;
        console.log('Access Token saved');
      });
    })
    .catch((error) => {
      console.log('Access Token Error', error.message);
    });
});


app.get('/login', (req, res) => {
  // Set the configuration settings
  const credentials = {
    client: {
      id: config.client_id,
      secret: config.client_secret
    },
    auth: {
      tokenHost: 'https://github.com',
      authorizePath: '/login/oauth/authorize'
    }
  };

  // Initialize the OAuth2 Library
  const oauth2 = simpleOauth2.create(credentials);

  // Authorization oauth2 URI
  const authorizationUri = oauth2.authorizationCode.authorizeURL({
    redirect_uri: `${config.host}/callback`,
    scope: 'user public_repo repo read:org',
    state: 'dummystate'
  });

  // Redirect example using Express (see http://expressjs.com/api.html#res.redirect)
  res.redirect(authorizationUri);
});

app.get('/get_commits', (req, res) => {
  const graphQL = request({
    url: 'https://api.github.com/graphql',
    method: 'POST',
    json: {'query': 'query { viewer { login }}'},
    headers: {
      'Authorization': `bearer ${config.token}`
    }
  })
});

app.listen(8080);
