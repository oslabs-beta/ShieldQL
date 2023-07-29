// import file system, and path functionality
const { readFile } = require('fs');
const path = require('path');
const { sanitize } = require('./sanitize.js');

// import parse functionality from envfile library
const { parse } = require('envfile');
// import env file as envSource
const envSource = path.resolve(__dirname, '.env');

// init sanitizeQuery, an Express middleware function users will require and invoke in their applications to generate the secrets used during the creation of JWTs
const sanitizeQuery = async (res, req, next) => {
  try {
    // read env file (could potentially also implement with just reading from process.env object)
    readFile(envSource, 'utf8', async (err, data) => {
      // init const result as parsed (into JS object) env file contents
      const result = parse(data);
      // if error reading env file, invoke global error handler
      if (err)
        return next({
          log: `Error at shieldQL sanitizeQuery while reading env file: ${err}`,
          status: 400,
          message: 'Internal server error',
        });
      // init paramsArr as array with single element, input query
      const paramsArr = [req.body.query];
      // check if result (the .env file) contains any params for strict, maxLength, and maxDepth
      paramsArr.push(result.strictShieldQL ? result.strictShieldQL : false);
      paramsArr.push(result.maxLengthShieldQL ? result.maxLengthShieldQL : 10);
      paramsArr.push(result.maxDepthShieldQL ? result.maxDepthShieldQL : 2000);
      // reassign query property of req.body to the sanitized query with passed-in config from env file
      req.body.query = sanitize(...paramsArr);
      // move to next link in middleware chain
      return next();
    });
  } catch (err) {
    // if error sanitizing query, invoke global error handler
    return next({
      log: `Error at shieldQL sanitizeQuery while reading sanitizing query: ${err}`,
      status: 406,
      message: 'There is something wrong with this query',
    });
  }
};

// export sanitizeQuery
module.exports = { sanitizeQuery };
