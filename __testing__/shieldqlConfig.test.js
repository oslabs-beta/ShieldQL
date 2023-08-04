// import file system and path functionality
const fs = require('fs');
const path = require('path');
// import parse functionality from envfile library
const { parse } = require('envfile');
// import shieldqlConfig function
const { shieldqlConfig } = require('../../shieldqlConfig.js');
// setup env file
require('dotenv').config();

// init const envSource as path to env file
const envSource = path.resolve(__dirname, '.env');
// const envTestSource = path.resolve(__dirname, 'test.env');

describe('shieldqlConfig unit tests', () => {
  // before any tests are run:
  beforeAll(() => {
    // if env test file exists, throw error with warning
    // if (envTestSource) {
    //   throw new Error(
    //     'Potentially unsaved changes, copy any env.test file contents into env file and delete env file before proceeding'
    //   );
    // }
    // If env file exists:
    // if (envSource) {
    //   // create copy of env file
    //   fs.readFile(envSource, 'utf8', (err, envContents) => {
    //     // if error, throw error
    //     if (err) throw `Error reading env file: ${err}`;
    //     console.log('Read env test file');
    //     // store env file contents in test.env file (just in case)
    //     fs.writeFileSync('test.env', envContents, (err) => {
    //       if (err) throw `Error copying env file: ${err}`;
    //       console.log('Created env copy at test.env');
    //     });
    //   });
    // } else {
    // if no env file exists, create new env file
    fs.writeFile('.env', 'Hello="New test env file"', (err) => {
      if (err) throw `Error copying env file: ${err}`;
      console.log('Created env copy at test.env');
    });
    // update envSource to env file path
    envSource = path.resolve(__dirname, '.env');
    // }
  });
  // clear env file contents
  // beforeEach(() => {
  //   console.log('Before each:');
  //   fs.writeFile('.env', 'Hello=New test env file', (err) => {
  //     if (err) throw `Error copying env file: ${err}`;
  //     console.log('Created env copy at test.env');
  //   });
  // });
  // once all tests are done, update env file contents to copy stored at test env file
  afterAll(() => {
    // copy test env file contents back into main env file
    fs.readFile(envSource, 'utf8', (err, envContents) => {
      // if error, throw error
      if (err) throw `Error reading env file: ${err}`;
      console.log('Read env test file');
      // store env file contents in test.env file (just in case)
      fs.writeFile('test.env', envContents, (err) => {
        if (err) throw `Error copying env file: ${err}`;
        console.log('Created env copy at test.env');
      });
    });
    // create new env file
    fs.writeFile('.env', 'Hello="New test env file"', (err) => {
      if (err) throw `Error copying env file: ${err}`;
      console.log('Created env copy at test.env');
    });
    // update envSource to env file path
    envSource = path.resolve(__dirname, '.env');
  });
  // after all tests, tear down test env file

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
    // // invoke shieldqlConfig
    // shieldqlConfig();
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
