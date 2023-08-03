const jwt = require('jsonwebtoken');
const path = require('path');
const { loginLink } = require('./loginLink');
const { createSecrets } = require('./createSecrets');
const { sanitizeQuery } = require('./sanitizeQuery');
const permissions = require(path.resolve(__dirname, '../../shieldql.json'));

const validateUser = (req, res, next) => {
  // pull out access token from cookies
  const accessToken = req.cookies.accessToken;

  const secret =
    process.env[`ACCESS_TOKEN_${res.locals.role.toUpperCase()}_SECRET`];

  // verify token using role.
  // result payload comes back as an object with roles and username as keys
  jwt.verify(accessToken, secret, (err, decoded) => {
    // if verification fails, send error
    if (err) {
      return next({
        log: `Express error ${err} during validate user `,
        status: 400,
        message: { err: 'INVALID USER' },
      });
    }

    // console.log("decoded value: ", decoded);

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

    // PERMISSIONS VALIDATION
    // query at all
    // if can query, which things can they query
    // mutate at all
    // if can mutate, which things can they mutate

    // pseudocoding out the reading from the shieldql json file process
    // permissions object
    // QUESTION: ERROR HANDLING: if permissions[role] doesn't exist, return error --> should be in loginLink
  
    // QUESTION: is decoded === role??

    if (!permissions[decoded]) {
      return next({
        log: 'Express error: user role does not exist on the shieldql.json file',
        status: 500,
        message: { err: 'INVALID AUTHORIZATION' },
      });
    }

    const fieldArray = permissions[decoded][operation];
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

// logic to parse the query
// 1. firstWord = { --> query. nextWord = field
// 2. firstWord = query --> check secondWord
// 2A. if secondWord = { --> nextWord = field
// 2B. if secondWord = GetBooks --> named query
// // 2B. iterate through the function declaration
// // 2B. wait until the word is a {
// // 2B. nextWord = field
// 3. firstWord = mutation --> we need to check the second word

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

// console.log(query);
// query = query.replace(/\n/g, ' ').trim();
// console.log(query);

// const operation = query.split('{\n');
// const operation2 = query.split('{\n')[0].trim();
// const operation3 = query.split('{\n')[0].trim().split(' ');
// const operation4 = query.split('{\n')[0].trim().split(' ')[0]; // correct operation method
// console.log(operation);
// console.log(operation2);
// console.log(operation3);
// console.log(operation4);
// const fieldWrong = query.split('{\n')[1].trim().split(' ')[0]; // incorrect field method
// console.log(fieldWrong);
// GraphQLock string manipulation for the 'field' is inaccurate
// assumes that there's a space between the end of the field and ( or {
// "login(email:" is a valid start to the field but inaccurate manip

module.exports = { validateUser, loginLink, sanitizeQuery, createSecrets };
