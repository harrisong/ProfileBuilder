/* eslint global-require: "off" */
const config = require('../config.json');

const getAccessToken = () => {
  if (process.env.ENVIRONMENT === 'DEBUG') {
    return require(config.access_token_test_file);
  }

  return require(config.access_token_file);
};

module.exports = {
  getAccessToken,
};
