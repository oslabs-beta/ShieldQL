
const loginLink = (req, res, next) => {
  //require jwt token
  const jwt = require("jsonwebtoken");

  const secretToken = `ACCESS_TOKEN_${res.locals.role.toUpperCase()}_SECRET`;
  const accessToken = jwt.sign(res.locals.role, process.env[secretToken], {
    expiresIn: "15min",
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
  });
  return next();
};

module.exports = { loginLink };
