
const loginLink = (req, res, next) => {
  //require jwt token
  const jwt = require('jsonwebtoken');

  const secretToken = `ACCESS_TOKEN_${res.locals.role.toUpperCase()}_SECRET`;
  const accessToken = jwt.sign(res.locals.role, process.env[secretToken]);
  /*
  , (err, success) => {
    if (err) {
      return next({
        log: `Express error ${err} ROLE NOT FOUND`,
        status: 404,
        message: { err: 'INVALID USER' }
      })
    }
  })
  */

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: true,
  });
  return next();
};

// export loginLink
module.exports = { loginLink };
