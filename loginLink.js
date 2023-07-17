/*
When a user logs in to your application, you will need to set res.locals.username and res.locals.role to pass the username and role to the loginLink middleware. This middleware will 

generate access and refresh tokens that will be stored in cookies and used for user authorization.
*/


//require dotenv.config?
//require jwt token
const jwt = require("jsonwebtoken");

//safeQL had users save username in res.locals before this step, why?
    //to assign a role
    //let module-user eg 'rodrigo' determine the logic for deciding if a user is assigned whichever role,
    //would they determine this based off of just username in req body? surely not- then anyone can claim to be admin rodrigo
    //so these people have accounts and, in the prev step of middleware you would check the pw i assume

//do you need to create different jwts depending on the role?
//is the payload of each jwt a password? or is it a username? or is it the role?
//are there difft secrets depending on the role? or just one secret for any kind of accesstoken (whether its read-only/read-and-write);


//Note: ask rodrigo what the token would be named and if there is just one for access tokens nd just one for refresh tokens
//also ask the team when these should expire
//uncertain if the syntax for the 15min is correct

//the below code would generate access tokens, with the payload being role? but would it create a different token every time it is run? otherwise multiple read-only may have the same token. that may or may not be an issue tho 

const accessToken = jwt.sign(res.locals.role, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15min"})


//normally you want to store refresh tokens in rediscache or db
    //later will you check if that refresh token still exists in the db/cache 
        //if not -send error?
    //verify the token 


//dont forget to save in cookies
