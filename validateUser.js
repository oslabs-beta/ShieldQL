const jwt = require('jsonwebtoken');
const path = require('path');
const permissions = require(path.resolve(__dirname, '../../shieldql.json'));

// validateUser is an Express middleware function that verifies that the client making a graphQL query or mutation is authorized to do so through jwt verification
// this function assumes that res.locals.role has already been populated with the user's role (that matches roles defined in the shieldql.json file) by a previous middleware function
const validateUser = (req, res, next) => {
  // pull out access token from cookies
  const accessToken = req.cookies.accessToken;
  const secret =
    process.env[`ACCESS_TOKEN_${res.locals.role.toUpperCase()}_SECRET`];

  // verify token using role
  // result payload comes back as an object with roles and username as keys
  jwt.verify(accessToken, secret, (err, decoded) => {
    // if verification fails, send error
    if (err) {
      return next({
        log: `Express error during validateUser: ${err}`,
        status: 400,
        message: { err: 'INVALID USER' },
      });
    }

    // verification valid, meaning that jwt is a valid jwt we created
    // now check if client's query is appropriate based on their role
    const query = req.body.query;

    // parsing query to get operation word: query or mutation
    let operation = query.split('{\n')[0].trim().split(' ')[0];
    // or, if query notation excludes the word "query"
    if (!operation) operation = 'query';

    const fieldString = query.split('{\n')[1].trim();
    let field = '';
    // traverse fieldString until the first opening bracket or parenthesis to identify the query type
    for (let i = 0; i < fieldString.length; i++) {
      // accumulate to the field
      if (
        fieldString[i] === ' ' ||
        fieldString[i] === '(' ||
        fieldString[i] === '{'
      )
        break;
      field += fieldString[i];
    }
    // if the user role was not included on the shieldql.json file, invoke global error handler
    if (!permissions[decoded.role]) {
      return next({
        log: 'Express error: user role does not exist on the shieldql.json file',
        status: 500,
        message: { err: 'INVALID AUTHORIZATION' },
      });
    }

    const fieldArray = permissions[decoded.role][operation];
    // global error handler is triggered if the client request includes an unauthorized operation or unauthorized field
    if (
      !fieldArray ||
      (!fieldArray.includes('.') && !fieldArray.includes(field))
    ) {
      return next({
        log: 'Express error: USER DOES NOT HAVE VALID PERMISSIONS',
        status: 401,
        message: { err: 'INVALID AUTHORIZATION' },
      });
    }
    // if no errors exist, move on to next link in Express middleware chain
    return next();
  });
};

module.exports = { validateUser };
