import { Request, Response, NextFunction } from 'express';
//Purpose: generate access tokens

/*Questions: 
- Does it matter if the CRUD app uses tokens
- i want to take time to think about what the tokens/authorization process is doing for us
- should the token payload be the username? or the role?
- how will this be verified? jwt.verify seems to check if an access token is real, but can that tell what type of access token they have? Do we need to knwo what type of access token they have, or will the verification process use something else (e.g.: res.locals) to determine what role the user has 
- if we use role, will every USER have the same token? And would that be an issue?
- how long do we want the access tokens to last (i.e.: what should the expiry be)
- should we also use refresh tokens?
*/
const loginLink = (req: Request, res: Response, next: NextFunction) => {
  //require jwt token
  const jwt = require('jsonwebtoken');

  //res.locals.role will contain the role
  //the below code would generate access tokens, with the payload being role
  // but would it create a different token every time it is run?
  //otherwise multiple Users may have the same token. that may or may not be an issue tho
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
