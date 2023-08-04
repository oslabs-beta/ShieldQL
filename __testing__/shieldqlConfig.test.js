// import file system and path functionality
const fs = require('fs');
const path = require('path');
// import parse functionality from envfile library
const { parse } = require('envfile');
// import shieldqlConfig function
const { shieldqlConfig } = require('../shieldqlConfig.js');

// setup env file
require('dotenv').config();

// init const envSource as path to env file
const envSource = path.resolve(__dirname, './.env');

describe('shieldqlConfig unit tests', () => {
  // clear env file contents
  beforeEach(() => {
    fs.writeFile(envSource, 'Hello=Reset env file', (err) => {
      if (err) throw `Error clearing env file: ${err}`;
    });
  });
  // once all tests are done, delete test env file
  afterAll(() => {
    // create new env file
    fs.writeFileSync(envSource, '', (err) => {
      if (err) throw `Error clearing env file: ${err}`;
    });
  });

  it('should not add a new refresh token secret if one already exists in the env file', async () => {
    // init var prevRefreshSecret and nextRefreshSecret
    let prevRefreshSecret, nextRefreshSecret;
    // read env file
    try {
      fs.readFileSync(envSource, 'utf8', async (err, data) => {
        try {
          // init const prevEnv to store parsed (into JS object) env file contents
          const prevEnv = parse(data);
        } catch (err) {
          return console.log(err);
        }
        // reassign prevRefreshSecret to current refresh secret in .env file
        prevRefreshSecret = prevEnv['REFRESH_TOKEN_SECRET'];
        // if error reading file log error
      });
    } catch (err) {
      return console.log(err);
    }
    // invoke shieldqlConfig
    shieldqlConfig();
    // read env file again
    fs.readFileSync(envSource, 'utf8', async (err, data) => {
      try {
        // init const nextEnv to store parsed (into JS object) env file contents
        const nextEnv = await parse(data);
        // reassign nextRefreshSecret to current refresh secret in .env file
        nextRefreshSecret = nextEnv['REFRESH_TOKEN_SECRET'];
        // if error reading file log error
        expect(nextRefreshSecret).toEqual(prevRefreshSecret);
      } catch (err) {
        return console.log(err);
      }
    });
    expect(nextRefreshSecret).toEqual(prevRefreshSecret);
  });
  xit('should create new secrets in env file if none existed before', () => {});
  xit('should update secrets for each role', () => {});
});
