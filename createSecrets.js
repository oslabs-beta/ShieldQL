// import file system, path, and encryption functionality
const fs = require('fs');
const path = require('path');
const encrypt = require('crypto');
// import parse and stringify functionality from envfile library
const { parse, stringify } = require('envfile');
// import env file as envSource
const envSource = '.env';
// import object containing user-configured GraphQL roles and corresponding permissions from the shieldql.json file as permissions
const permissions = require(path.resolve(__dirname, './shieldql.json'));

// init createSecrets, a function users will require and invoke in their applications to generate the secrets used during the creation of JWTs
const createSecrets = () => {
  // init const roles as array of uppercase strings (keys of permissions obj) describing permissions for each role in the shieldql file
  const roles = Object.keys(permissions).map(
    (role) => `ACCESS_TOKEN_${role.toUpperCase}_SECRET`
  );
  // read env file
  fs.readFile(envSource, 'utf8', (err, data) => {
    // if error reading file log error
    if (err) return console.log(err);
    // init const result to store parsed (into JS object) env file contents
    const result = parse(data);
    // for each role in the shieldql.json file, generate and store a secret as the value corresponding to each role from shieldql.json
    roles.forEach((role) => {
      // generate new secret
      const secret = encrypt.randomBytes(64).toString('hex');
      // store role and secret as key value pairs in the process.env obj (which was assigned to env variables at start and needs to be updated going forward) and the new env file (the result obj)
      process.env[role] = result[role] = secret;
    });
    // if refresh token secret doesn't already exist in the env file, create new refresh token secret
    if (!result['REFRESH_TOKEN_SECRET']) {
      const secret = encrypt.randomBytes(64).toString('hex');
      // add secret and string 'REFRESH_TOKEN_SECRET' as key-value pairs
      process.env['REFRESH_TOKEN_SECRET'] = result['REFRESH_TOKEN_SECRET'] =
        secret;
    }
    // update env file with new secrets
    fs.writeFile(envSource, stringify(result), (err) => {
      // if unsuccessful log error, else log confirmation message
      err ? console.log(err) : console.log('File Saved');
    });
  });
};

// export createSecrets
module.exports = createSecrets;
