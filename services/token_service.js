/* eslint global-require: "off" */
const fs = require('fs');
const config = require('../config.json');

const getAccessTokenFile = () => {
  if (process.env.ENVIRONMENT === 'DEBUG') {
    return config.access_token_test_file;
  }

  return config.access_token_file;
};

const getAccessToken = () => require(`../${getAccessTokenFile}`);

const saveAccssToken = (accessToken, res) => {
  fs.writeFile(config.access_token_file, accessToken, (err) => {
    if (err) throw err;
    res.send('Access Token Saved');
  });
};

module.exports = {
  getAccessTokenFile,
  getAccessToken,
  saveAccssToken,
};
