// import file system, and path functionality
// const { readFile } = require('fs');
// const path = require('path');
const { sanitize } = require('./sanitize.js');

// import parse functionality from envfile library
// const { parse } = require('envfile');
// import env file as envSource
// const envSource = path.resolve(__dirname, '.env');

// init sanitizeQuery, an Express middleware function users will require and invoke in their applications to sanitize graphQL queries
// const sanitizeQueryPrev = async (res, req, next) => {
//   try {
//     // read env file (could potentially also implement with just reading from process.env object)
//     readFile(envSource, 'utf8', async (err, data) => {
//       // init const result as parsed (into JS object) env file contents
//       const result = parse(data);
//       // if error reading env file, invoke global error handler
//       if (err)
//         return next({
//           log: `Error at shieldQL sanitizeQuery while reading env file: ${err}`,
//           status: 400,
//           message: 'Internal server error',
//         });
//       // init paramsArr, an array that will store all args to be passed into the sanitize helper function, with single element input query
//       const paramsArr = [req.body.query];
//       // check if result (the .env file) contains any params for strict, maxLength, and maxDepth
//       paramsArr.push(result.strictShieldQL ? result.strictShieldQL : false);
//       paramsArr.push(result.maxDepthShieldQL ? result.maxDepthShieldQL : 10);
//       paramsArr.push(
//         result.maxLengthShieldQL ? result.maxLengthShieldQL : 2000
//       );
//       // reassign query property of req.body to the sanitized query with passed-in config from env file
//       req.body.query = sanitize(...paramsArr);
//       // move to next link in middleware chain
//       return next();
//     });
//   } catch (err) {
//     // if error sanitizing query, invoke global error handler
//     return next({
//       log: `Error at shieldQL sanitizeQuery while sanitizing query: ${err}`,
//       status: 406,
//       message: 'There is something wrong with this query',
//     });
//   }
// };

// Version of sanitizeQuery that does not read .env file and instead directly pulls data from process.env object
// this version of sanitizeQuery should be more performant (no need to find and read file)
// init sanitizeQuery, an Express middleware function users will require and invoke in their applications to sanitize graphQL queries
const sanitizeQuery = async (req, res, next) => {
  try {
    // init paramsArr, an array that will store all args to be passed into the sanitize helper function, with single element input query
    const paramsArr = [req.body.query];
    // check if result (the .env file) contains any params for strict, maxLength, and maxDepth
    paramsArr.push(
      process.env.strictShieldQL ? process.env.strictShieldQL : false
    );
    paramsArr.push(
      process.env.maxDepthShieldQL ? process.env.maxDepthShieldQL : 10
    );
    paramsArr.push(
      process.env.maxLengthShieldQL ? process.env.maxLengthShieldQL : 2000
    );
    // reassign query property of req.body to the sanitized query with passed-in config from env file
    req.body.query = sanitize(...paramsArr);
    // move to next link in middleware chain
    return next();
    // if error sanitizing query, invoke global error handler
  } catch (err) {
    return next({
      log: `Error at shieldQL sanitizeQuery while sanitizing query: ${err}`,
      status: 406,
      message: 'There is something wrong with this query',
    });
  }
};

// export sanitizeQuery
module.exports = { sanitizeQuery };
