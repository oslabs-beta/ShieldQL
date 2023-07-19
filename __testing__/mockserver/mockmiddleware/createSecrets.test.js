// import file system, path, and encryption functionality
const fs = require('fs');
const path = require('path');

// import createSecrets function and describe function
const { describe } = require('node:test');
const createSecrets = require('../../../createSecrets.js');
// import env file as envSource
const envSource = '.env';

describe('createSecret unit tests', () => {
  it('should not create a new refresh token secret if one already exists in the env file', async () => {
    // init var prevRefreshSecret and nextRefreshSecret
    let prevRefreshSecret, nextRefreshSecret;
    // read env file
    await fs.readFile(envSource, 'utf8', (err, data) => {
      // if error reading file log error
      if (err) return console.log(err);
      // init const result to store parsed (into JS object) env file contents
      const result = parse(data);
      // reassign prevRefreshSecret to current refresh secret in .env file
      prevRefreshSecret = result['REFRESH_TOKEN_SECRET'];
    });
    // invoke createSecrets
    await createSecrets();
    // read env file again
    await fs.readFile(envSource, 'utf8', (err, data) => {
      // if error reading file log error
      if (err) return console.log(err);
      // init const result to store parsed (into JS object) env file contents
      const result = parse(data);
      // reassign nextRefreshSecret to current refresh secret in .env file
      nextRefreshSecret = result['REFRESH_TOKEN_SECRET'];
    });
    return expect(nextRefreshSecret).toEqual(prevRefreshSecret);
  });
  xit('should create a new refresh token secret if it does not already exist in the env file', () => {});
  xit('should create a new refresh token secret if it does not already exist in the env file', () => {});
});
