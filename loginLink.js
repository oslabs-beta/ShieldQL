
const loginLink = (req, res, next) => {
  const jwt = require('jsonwebtoken');

  //create jwt based on role passed via res.locals
  //rn jwt expires 15 s
  const secretToken = `ACCESS_TOKEN_${res.locals.role.toUpperCase()}_SECRET`;
  try{
    const accessToken = jwt.sign({role: res.locals.role}, process.env[secretToken], { expiresIn: '15000' });
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
    });
    return next();
  }
  catch(err){
    return next({
        log: `Express error ${err}. ROLE NOT FOUND`,
        status: 404,
        message: { err: 'INVALID USER' }
    })
  }
};

// export loginLink
module.exports = { loginLink };
