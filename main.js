const jwt = require('jsonwebtoken');
const { loginLink } = require('./sanitize');

// init the middleware function validateUser that throws validates users before allowing them to
const validateUser = (req, res, next) => {
  //check cookies in request
  //pull out access token from cookies
  const accessToken = req.cookies.accessToken;

  //decode the cookie to determine what the payload role is
  const obj = jwt.decode(accessToken);

  //NOTE: double check that obj.role accesses the role. consider logging the obj

  const secret = process.env[`ACCESS_TOKEN_${obj.role.toUpperCase()}_SECRET`];

  //verify token using decoded role. if verification fails, send error
  // result payload comes back as an object with roles and username as keys
  jwt.verify(accessToken, secret, (err, decoded) => {
    if (err) {
      throw new Error('Error during role verification in validate user');
    } else {
      //work with verified decoded payload
      let query = req.body.query;
      query = query.split(' ');

      //if the query was a mutation, throw an error
      if (decoded.role !== 'Admin' && query[0] === 'mutation') {
        throw Error('DO NOT HAVE PERMISSIONS TO MUTATE');
      } else return next();
    }
  });
};

//Note- the following is hardcoded for our Admin with read/write access.
//we're also only checking for read/write access rather than anything specific
//not checking the actual customizable shieldql.json file
//also - we are not triggering global error handler

module.exports = { validateUser, loginLink, sanitizeQuery };
