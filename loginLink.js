const jwt = require('jsonwebtoken');

// loginLink is an express middleware function that verifies that the client making a graphQL query or mutation is authorized to do so through jwt verification
const loginLink = (req, res, next) => {
  //create access token based on role passed via res.locals
  const secretToken = `ACCESS_TOKEN_${res.locals.role.toUpperCase()}_SECRET`;
  try {
    const accessToken = jwt.sign(
      { role: res.locals.role },
      process.env[secretToken],
      { expiresIn: '1d' }
    );
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
    });
    return next();
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
