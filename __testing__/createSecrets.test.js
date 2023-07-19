// import file system, path, and encryption functionality
const fs = require('fs');
const path = require('path');
// import parse functionality from envfile library
const { parse } = require('envfile');
// import createSecrets function and describe function
const { describe } = require('node:test');
const createSecrets = require('../createSecrets.js');
// init const envSource as path to env file
const envSource = path.resolve(__dirname, '.env');

describe('createSecret unit tests', () => {
  it('should not create a new refresh token secret if one already exists in the env file', () => {
    // init var prevRefreshSecret and nextRefreshSecret
    let prevRefreshSecret, nextRefreshSecret;
    // read env file
    fs.readFile(envSource, 'utf8', async (err, data) => {
      try {
        // init const result to store parsed (into JS object) env file contents
        const result = parse(data);
        // reassign prevRefreshSecret to current refresh secret in .env file
        prevRefreshSecret = result['REFRESH_TOKEN_SECRET'];
      } catch (err) {
        // if error reading file log error
        return err;
        // return console.log(err);
      }
    });
    // invoke createSecrets
    createSecrets();
    // read env file again
    fs.readFile(envSource, 'utf8', async (err, data) => {
      try {
        // init const result to store parsed (into JS object) env file contents
        const result = parse(data);
        // reassign nextRefreshSecret to current refresh secret in .env file
        nextRefreshSecret = result['REFRESH_TOKEN_SECRET'];
      } catch (err) {
        // if error reading file log error
        return err;
        // return console.log(err);
      }
    });
    expect(nextRefreshSecret).toEqual(prevRefreshSecret);
  });
  xit('should create a new refresh token secret if it does not already exist in the env file', () => {
    expect(5).toEqual(5);
  });
  xit('should create a new refresh token secret if it does not already exist in the env file', () => {});
});
