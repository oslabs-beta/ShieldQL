const { sanitize } = require('./sanitize.js');

// sanitizeQuery is an Express middleware function users will require and invoke in their applications to sanitize graphQL queries
const sanitizeQuery = async (req, res, next) => {
  try {
    // Enforce string type for req.body.query
    if (typeof req.body.query !== 'string') {
      return next({
        log: `Error at shieldQL sanitizeQuery, req.body.query must be a string`,
        status: 500,
        message: 'Internal server error',
      });
    }
    // build graphqlQuery for sanitization
    let graphqlQuery = req.body.query;
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
