// import file system, path, and encryption functionality
const fs = require('fs');
const path = require('path');
const encrypt = require('crypto');
// import parse and stringify functionality from envfile library
const { parse, stringify } = require('envfile');
// import path to env file as envSource
const envSource = path.resolve(__dirname, '.env');
// import object containing user-configured GraphQL roles and corresponding permissions from the shieldql.json file as permissions
const permissions = require(path.resolve(__dirname, '../../shieldql.json'));

// init func shieldqlConfig that accepts 3 params: strictShieldQL (bool), maxDepthShieldQL (number), maxLengthShieldQL (number) and creates new secrets and sanitizeQuery params properties in both the env file and the process.env object
const shieldqlConfig = (
  strictShieldQL = false,
  maxDepthShieldQL = 10,
  maxLengthShieldQL = 2000
) => {
  // init const roles as array of uppercase strings (keys of permissions obj) describing permissions for each role in the shieldql file
  const roles = Object.keys(permissions).map(
    (role) => `ACCESS_TOKEN_${role.toUpperCase()}_SECRET`
  );
  // read env file
  fs.readFile(envSource, 'utf8', (err, data) => {
    // if error reading file log error
    if (err) return console.log('Error at shieldqlConfig:', err);
    // init const newEnv to store parsed (into JS object) env file contents
    const newEnv = parse(data);
    // for each role in the shieldql.json file, generate and store a secret as the value corresponding to each role from shieldql.json
    roles.forEach((role) => {
      // generate new secret
      const secret = encrypt.randomBytes(64).toString('hex');
      // store role and secret as key value pairs in the process.env obj (which was assigned to env variables at start and needs to be updated going forward) and the new env file (the newEnv obj)
      process.env[role] = newEnv[role] = secret;
    });
    // add each passed-in arg as a value in both the new .env file and the process.env object
    process.env.strictShieldQL = newEnv.strictShieldQL = strictShieldQL;
    process.env.maxDepthShieldQL = newEnv.maxDepthShieldQL = maxDepthShieldQL;
    process.env.maxLengthShieldQL = newEnv.maxLengthShieldQL =
      maxLengthShieldQL;
    // if refresh token secret doesn't already exist in the env file, create new refresh token secret
    if (!newEnv['REFRESH_TOKEN_SECRET']) {
      const secret = encrypt.randomBytes(64).toString('hex');
      // add secret and string 'REFRESH_TOKEN_SECRET' as key-value pairs
      process.env['REFRESH_TOKEN_SECRET'] = newEnv['REFRESH_TOKEN_SECRET'] =
        secret;
    }
    // update env file with new secrets
    fs.writeFile(envSource, stringify(newEnv), (err) => {
      // if unsuccessful log error, else log confirmation message
      err ? console.log('Error updating env file at shieldqlConfig:', err) : console.log('ShieldQL successfully configured');
    });
  });
};

// export shieldqlConfig
module.exports = { shieldqlConfig };
