const express = require('express');

const app = express();
const fs = require('fs');
const request = require('request');
const simpleOauth2 = require('simple-oauth2');
const config = require('./config.json');

// Set the configuration settings
const credentials = {
  client: {
    id: config.client_id,
    secret: config.client_secret,
  },
  auth: {
    tokenHost: 'https://github.com',
    authorizePath: '/login/oauth/authorize',
  },
};

// Initialize the OAuth2 Library
const oauth2 = simpleOauth2.create(credentials);

app.get('/callback', (req) => {
  const [state, code] = [req.query.state, req.query.code];
  if (state !== 'dummystate') throw new Error('Wrong state');
  if (!code) throw new Error('Empty code');

  const tokenConfig = {
    code,
    redirect_uri: `${config.host}/callback`,
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
  // Authorization oauth2 URI
  const authorizationUri = oauth2.authorizationCode.authorizeURL({
    redirect_uri: `${config.host}/callback`,
    scope: 'user public_repo repo read:org',
    state: 'dummystate',
  });

  // Redirect example using Express (see http://expressjs.com/api.html#res.redirect)
  res.redirect(authorizationUri);
});

app.get('/get_commits', () => {
  request({
    url: 'https://api.github.com/graphql',
    method: 'POST',
    json: { query: 'query { viewer { login }}' },
    headers: {
      Authorization: `bearer ${config.token}`,
    },
  });
});

app.listen(8080);
