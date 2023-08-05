const { sanitize } = require('./sanitize.js');

// sanitizeQuery is an Express middleware function users will require and invoke in their applications to sanitize graphQL queries
const sanitizeQuery = async (req, res, next) => {
  try {
    // handle edge case of req.body.query being undefined or null
    if (!req.body.query) {
      return next({
        log: `Error at shieldQL sanitizeQuery, req.body.query is null or undefined`,
        status: 400,
        message: 'There is something wrong with this query',
      });
    }
    // build graphqlQuery for sanitization
    const graphqlQuery = JSON.stringify(req.body.query);
    if (req.body.variables) graphqlQuery += JSON.stringify(req.body.variables);
    // init paramsArr, an array that will store all args to be passed into the sanitize helper function, with single element input query

    const paramsArr = [graphqlQuery];
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
    graphqlQuery = sanitize(...paramsArr);
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
