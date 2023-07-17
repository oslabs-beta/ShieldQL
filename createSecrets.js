// import file system, path, and encryption functionality
const fs = require('fs');
const path = require('path');
const encrypt = require('crypto');
// import parse and stringify functionality from envfile library
const { parse, stringify } = require('envfile');
// import env file as envSource
const envSource = '.env';
// import object containing user-configured GraphQL roles and corresponding permissions from the shieldql.json file as permissions
const permissions = require(path.resolve(__dirname, '../../shieldql.json'));

// init createSecrets, a middleware function users will require and invoke in their applications to generate the secrets used during the creation of JWTs
// configured to be used as express middleware or elsewhere
const createSecrets = (req = null, res = null, next = null) => {
  // init const roles as array of uppercase strings describing permissions for each role in the shieldql file
  const roles = Object.keys(permissions).map(
    (role) => `ACCESS_TOKEN_${role.toUpperCase}_SECRET`
  );
  // read env file
  fs.readFile(envSource, 'utf8', (err, data) => {
    // if error reading file, either log error or route to global error handler, depending on whether function is used as express middleware or not
    if (err) return next ? next(err) : console.log(err);
    // init const result to store parsed env file contents
    const result = parse(data);
    // for each role in the shieldql.json file, generate and store a secret as the value corresponding to each role from shieldql.json
    roles.forEach((role) => {
      const secret = encrypt.randomBytes(64).toString('hex');
      // store role and secret as key value pairs in the process.env file and result object
      process.env[role] = result[role] = secret;
    });
    // if refresh token doesn't already exist in the env file, create new refresh token secret
    if (!result['REFRESH_TOKEN_SECRET']) {
      const secret = encrypt.randomBytes(64).toString('hex');
      process.env['REFRESH_TOKEN_SECRET'] = result['REFRESH_TOKEN_SECRET'] =
        secret;
    }
    // update env file with new secrets
    fs.writeFile(envSource, stringify(result), (err) => {
      // if unsuccessful log error, else log confirmation message
      err ? console.log(err) : console.log('File Saved');
      // if next is defined (createSecrets effectively used as express MW), move to next link in middleware chain
      if (next) next();
    });
  });
};

// export createSecrets
module.exports = createSecrets;
