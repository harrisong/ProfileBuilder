const express = require('express');
const fs = require('fs');
const request = require('request');
const jsonfile = require('jsonfile');
const config = require('./config.json');

const app = express();

app.get('/', (req, res) => {
  res.send('<a href="/login">Login</a>');
});

app.get('/callback', (req, res) => {
  const [state, code] = [req.query.state, req.query.code];
  if (state !== 'dummystate') throw new Error('Wrong state');
  if (!code) throw new Error('Empty code');

  request({
    url: 'https://github.com/login/oauth/access_token',
    method: 'POST',
    json: {
      client_id: config.client_id,
      client_secret: config.client_secret,
      code,
    },
  }, (error, response, body) => {
    const accessToken = JSON.stringify(body);
    fs.writeFile(config.access_token_file, accessToken, (err) => {
      if (err) throw err;
      res.send('Access Token Saved');
    });
  });
});


app.get('/login', (req, res) => {
  res.redirect(`https://github.com/login/oauth/authorize?client_id=${config.client_id}&scope=user public_repo repo read:org&state=dummystate`);
});

app.get('/get_commits', (req, res) => {
  const accessTokenFile = jsonfile.readFileSync(`./${config.access_token_file}`);

  request({
    url: 'https://api.github.com/graphql',
    method: 'POST',
    header: {
      'User-Agent': 'ProfileBuilder',
    },
    json: { query: 'query { viewer { login }}' },
    headers: {
      Authorization: `bearer ${accessTokenFile.access_token}`,
    },
  }, (error, response, body) => {
    console.log(response);
    res.send(body);
  });
});

const server = app.listen(8080);

module.exports = server;
