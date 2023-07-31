const jwt = require('jsonwebtoken');
const { loginLink } = require('./loginLink');
const { createSecrets } = require('./createSecrets');
const { sanitizeQuery } = require('./sanitizeQuery');
const { shieldqlConfig } = require('./shieldqlConfig');

const validateUser = (req, res, next) => {
  //check cookies in request
  //pull out access token from cookies
  const accessToken = req.cookies.accessToken;

  //decode the cookie to determine what the payload role is
  // const obj = jwt.decode(accessToken);

  //NOTE: double check that obj.role accesses the role. consider logging the obj

  const secret =
    process.env[`ACCESS_TOKEN_${res.locals.role.toUpperCase()}_SECRET`];

  //verify token using decoded role. if verification fails, send error
  // result payload comes back as an object with roles and username as keys
  jwt.verify(accessToken, secret, (err, decoded) => {
    if (err) {
      return next({
        log: `Express error ${err} during validate user `,
        status: 400,
        message: { err: 'INVALID USER' },
      });
    } else {
      let query = req.body.query;
      query = query.replace(/\n/g, ' ').trim();
      let word = '';
      for (let i = 0; i < query.length; i++) {
        if (query[i] === ' ') {
          break;
        } else {
          word += query[i];
        }
      }
      //if the query was a mutation, throw an error
      if (decoded !== 'Admin' && word === 'mutation') {
        return next({
          log: `Express error ${err} USER DOES NOT HAVE VALID PERMISSIONS`,
          status: 401,
          message: { err: 'INVALID USER' },
        });
      } else return next();
    }
  });
};

//Note- the following is hardcoded for our Admin with read/write access.
//we're also only checking for read/write access rather than anything specific
//not checking the actual customizable shieldql.json file
//also - we are not triggering global error handler

module.exports = {
  validateUser,
  loginLink,
  sanitizeQuery,
  createSecrets,
  shieldqlConfig,
};
