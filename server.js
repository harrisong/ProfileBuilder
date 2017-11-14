const express = require('express');
const app = express();
const fs = require('fs');
const request = require('request');
const config = require('./config.json');

app.get('/callback', (req, res) => {
  const [state, code] = [req.query.state, req.query.code];
  if (state !== 'dummystate') throw new Error('Wrong state');
  if (!code) throw new Error('Empty code');

  const result = request({
    url: 'https://github.com/login/oauth/access_token',
    method: 'POST',
    json: {
      client_id : config.client_id,
      client_secret : config.client_secret,
      code : code
    }
  }, (error, response, body) => {
    const access_token = JSON.stringify(body);
    fs.writeFile(config.access_token_file, access_token, (err) => {
      if (err) throw err;
      res.send("Access Token Saved");
    });
  });
});


app.get('/login', (req, res) => {
  res.redirect(`https://github.com/login/oauth/authorize?client_id=${config.client_id}&scope=user public_repo repo read:org&state=dummystate`);
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
