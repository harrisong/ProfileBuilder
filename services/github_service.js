const request = require('request');
const fs = require('fs');
const config = require('../config.json');
const accessTokenFile = require(`../${config.access_token_file}`);

const getAccessToken = (code, res) => {
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
};

const getCommits = (req, res) => {
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
};

module.exports = {
  getAccessToken,
  getCommits,
};