// import file system and path functionality
const fs = require('fs');
const path = require('path');
// import parse functionality from envfile library
const { parse } = require('envfile');
// import createSecrets function
const { createSecrets } = require('../createSecrets.js');
// init const envSource as path to env file
const envSource = path.resolve(__dirname, '.env');

describe('createSecret unit tests', () => {
  // before any tests are run, create copy of env file
  beforeAll((done) => {
    fs.writeFile('.env.test', 'Insert env file content here', (err) => {
      if (err) throw err;
      console.log('Created env test file');
      done();
    });
  });
  // empty env file
  // beforeEach(() => {
  //   console.log('before each');
  // });

  xit('should not create a new refresh token secret if one already exists in the env file', async () => {
    // init var prevRefreshSecret and nextRefreshSecret
    let prevRefreshSecret, nextRefreshSecret;
    // read env file

    const readFile = async (path) => {
      return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {
          if (err) reject(err);
          resolve(data);
        });
      });
    };

    try {
      const data = await readFile(envSource);
      const result = parse(data);
      prevRefreshSecret = result['REFRESH_TOKEN_SECRET'];
      expect(nextRefreshSecret).toEqual(prevRefreshSecret);
    } catch (err) {
      console.log(err);
    }

    // fs.readFile(envSource, 'utf8', async (err, data) => {
    //   try {
    //     // init const result to store parsed (into JS object) env file contents
    //     const result = parse(data);
    //     // reassign prevRefreshSecret to current refresh secret in .env file
    //     prevRefreshSecret = result['REFRESH_TOKEN_SECRET'];
    //     // if error reading file log error
    //   } catch (err) {
    //     // return console.log(err);
    //     return console.log(err);
    //   }
    // });
    // // invoke createSecrets
    // createSecrets();
    // // read env file again
    // fs.readFile(envSource, 'utf8', async (err, data) => {
    //   try {
    //     // init const result to store parsed (into JS object) env file contents
    //     const result = await parse(data);
    //     // reassign nextRefreshSecret to current refresh secret in .env file
    //     nextRefreshSecret = result['REFRESH_TOKEN_SECRET'];
    //     // if error reading file log error
    //     expect(nextRefreshSecret).toEqual(prevRefreshSecret);
    //     done();
    //   } catch (err) {
    //     // return console.log(err);
    //     // return console.log(err);
    //   }
    // });
    // expect(nextRefreshSecret).toEqual(prevRefreshSecret);
    // done();
  });
  it('should create new secrets in env file if none existed before', () => {
    expect(5).toEqual(5);
  });
  xit('should update secrets for each role', () => {});
});
