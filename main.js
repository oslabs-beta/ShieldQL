const jwt = require('jsonwebtoken');
const path = require('path');
const { loginLink } = require('./loginLink');
const { createSecrets } = require('./createSecrets');
const { sanitizeQuery } = require('./sanitizeQuery');
const permissions = require(path.resolve(__dirname, '../../shieldql.json'));

const validateUser = (req, res, next) => {
  // console.log('-----in validateUser-----');
  // pull out access token from cookies
  const accessToken = req.cookies.accessToken;
  // console.log('req cookies: ', req.cookies);
  // console.log('accessToken before verification: ', accessToken);

  const secret =
    process.env[`ACCESS_TOKEN_${res.locals.role.toUpperCase()}_SECRET`];

  // verify token using role.
  // result payload comes back as an object with roles and username as keys
  jwt.verify(accessToken, secret, (err, decoded) => {
    // console.log('---in jwt.verify---');
    // if verification fails, send error
    if (err) {
      // console.log('secret: ', secret);
      // console.log('accessToken: ', accessToken);
      return next({
        log: `Express error during validateUser: ${err}`,
        status: 400,
        message: { err: 'INVALID USER' },
      });
    }

    // console.log("decoded value: ", decoded);
    // console.log("permissions: ", permissions);

    // verification valid, meaning that jwt is a valid jwt we created
    // now check if client's query is appropriate based on their role
    const query = req.body.query;

    // parsing query to get operation word: query or mutation
    let operation = query.split('{\n')[0].trim().split(' ')[0];
    // or, if query notation excludes the word "query"
    if (!operation) operation = 'query';

    const fieldString = query.split('{\n')[1].trim();
    let field = '';
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

    // console.log('field: ', field);
    // console.log('-----checking permissions-----');

    if (!permissions[decoded.role]) {
      return next({
        log: 'Express error: user role does not exist on the shieldql.json file',
        status: 500,
        message: { err: 'INVALID AUTHORIZATION' },
      });
    }

    const fieldArray = permissions[decoded.role][operation];
    // error message is triggered if the client request includes an unauthorized operation or unauthorized field
    if (!fieldArray || !fieldArray.includes(".") && !fieldArray.includes(field)) {
      return next({
        log: 'Express error: USER DOES NOT HAVE VALID PERMISSIONS',
        status: 401,
        message: { err: 'INVALID AUTHORIZATION' },
      });
    }

    return next();
  });
};


// stretch feature: multiple queries
// if we do have multiple root-level queries in an operation, the operation would be named
// EDGE CASE: if request contains both queries and mutations
// IDEA: scan the entire query for the word mutation?

// test cases
let query = `
query Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    userId
    token
    tokenExpiration
    role
  }
}
`;

let query1 = `
{
  events {
    _id
    title
    description
    date
    price
    creator {
      _id
      email
    }
  }
}
`;

let query2 = `
mutation CreateUser($email: String!, $password: String!, $role: String!) {
  createUser(userInput: {email: $email, password: $password, role: $role}) {
    _id
    email
    role
  }
}
`;

module.exports = { validateUser, loginLink, sanitizeQuery, createSecrets };