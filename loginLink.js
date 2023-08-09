const jwt = require('jsonwebtoken');

// loginLink is an Express middleware function that authenticates the client, creates a jwt access token, and stores it as a cookie on the client's browser to authorize future graphQL queries and mutations aligned with the user's role-based permissions described in the shieldql.json file
const loginLink = (req, res, next) => {
  const secretToken = `ACCESS_TOKEN_${res.locals.role.toUpperCase()}_SECRET`;
  try {
    //create access token based on role passed via res.locals
    const accessToken = jwt.sign(
      { role: res.locals.role },
      process.env[secretToken],
      { expiresIn: '1d' }
    );
    // set new cookie with access token
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
    });
    // move on to next step in middleware chain
    return next();
    // if there is an error, invoke the global error handler
  } catch (err) {
    return next({
      log: `Express error ${err}. ROLE NOT FOUND`,
      status: 404,
      message: { err: 'INVALID USER' },
    });
  }
};

// export loginLink
module.exports = { loginLink };
