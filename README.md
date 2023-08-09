# ShieldQL

ShieldQL is a lightweight, powerful, easy-to-use JavaScript Library for GraphQL that adds authentication, authorization, and query sanitization to prevent malicious queries and injection attacks.

- Authentication: ShieldQL helps you implement user authentication in your GraphQL APIs, ensuring that only authenticated users can access certain parts of your API.
- Authorization: With ShieldQL, you can define granular access controls for different types and fields in your GraphQL schema. This way, you can control what data each user can access based on their role and permissions.
- Query Sanitization: ShieldQL gives you the tools to sanitize incoming GraphQL queries to prevent potential malicious operations and protect your backend from excessively deep and excessively long queries used in denial-of-service attacks.

# NOTE: ShieldQL is still in development. We will officially launch on Thursday 8/10 :rocket:

## Features

- shieldqlConfig: A Javascript function that allows you to configure sanitizeQuery parameters and creates a secret for each role in the shieldql.json file, storing all of this information in the .env file and the process.env object
  - Where to use: Recommended use is next to importation of shieldQL functionality in main server file (similar to dotenv.config())
  - shieldqlConfig accepts 3 params: strictShieldQL (a boolean), maxDepthShieldQL (a number), and maxLengthShieldQL (a number), which are used to configure sanitizeQuery (see sanitizeQuery for more details)
    - strictShieldQL: (default false) boolean value that determines whether or not sanitizeQuery will be run on strict mode or not
    - maxDepthShieldQL: (default 10) number that establishes the upper bound for the maximum depth of a graphQL query
    - maxLengthShieldQL: (default 2000) number that establishes the upper bound for total characters in a graphQL query
- loginLink: Express middleware function that authenticates the client, creates a jwt access token, and stores it as a cookie on the client's browser to authorize future graphQL queries and mutations aligned with the user's role-based permissions described in the shieldql.json file
  - NOTE: Access token expires after one day
- createSecrets:
- sanitizeQuery:
- validateUser: Express middleware function that verifies that the client making a graphQL query or mutation is authorized to do so through jwt verification

  - Assumes that res.locals.role has already been populated with the user's role (that matches roles defined in the shieldql.json file) by a previous middleware function

- SanitizeQuery works even if shieldqlConfig is never invoked, although if used without shieldqlConfig, default parameters will be used (strictmode set to false, maxDepth set to 10, maxLength set to 2000)

## Setup

- Make sure dotenv has been imported, that it is properly configured, and that a .env file already exists
- Ensure that the .env file is in the root directory

- Create a shieldqlql.json file in root directory. This file will define the roles and permissions

```javascript
{
  "admin": {
    "query": ["."],
    "mutation": ["."]
  },
  "user": {
    "query": ["feed", "news"]
  },
  "job-applicant": {
    "query": ["job-description"]
  }
}
```

  <!-- - User MUST pass in the user graphQL role in the auth route as #res.locals.role# -->

- Ensure that the appropriate graphQL role from the shieldqlConfig.js file is passed into the graphQL route in order for validateToken and loginLink to enforce authentication and authorization

  - This will be passed on to each of shieldQL's middleware functions
  - A common approach to this problem is the following (see below for an example)
    - Insert a middleware function preceding validateToken and loginLink that queries the user database
    - Extracts the graphQL role
    - Stores it in res.locals.role

- NOTE: shieldQL will NOT be able to authenticate and authorize graphQL queries unless roles are passed into loginLink and validateUser through res.locals.role

## Installation

```javascript
npm i shieldql
```

## License

shieldQL is ISC licensed

<!-- # PENDING REVIEW

ShieldQL is a powerful and easy-to-use JavaScript GraphQL middleware library designed to enhance the security of your GraphQL APIs. It provides essential features such as user authentication, authorization, and query sanitization, making it a reliable choice for securing your GraphQL endpoints. With ShieldQL, you can rest assured that your GraphQL API is protected from common security vulnerabilities.

Features
User Authentication: ShieldQL helps you implement user authentication in your GraphQL APIs, ensuring that only authenticated users can access certain parts of your API.

User Authorization: With ShieldQL, you can define granular access controls for different types and fields in your GraphQL schema. This way, you can control what data each user can access based on their role and permissions.

Query Sanitization: ShieldQL automatically sanitizes incoming GraphQL queries to prevent potential malicious operations and protect your backend from harmful attacks like N+1 queries and denial-of-service attacks.

Lightweight and Easy to Use: ShieldQL is designed to be lightweight and straightforward to integrate into your existing GraphQL Express application without introducing unnecessary complexities.

Installation
To install ShieldQL, use npm or yarn:

bash
Copy code
npm install shieldql
or

bash
Copy code
yarn add shieldql
Getting Started
Integrating ShieldQL into your GraphQL Express application is a breeze. Follow these steps to get started:

First, install the ShieldQL package as shown in the installation instructions above.

Import ShieldQL into your Express server file:

javascript
Copy code
const { shieldQL } = require('shieldql');
Initialize ShieldQL middleware with your authentication and authorization functions:
javascript
Copy code
const { isAuthenticated, hasPermission } = require('./auth'); // Replace with your custom auth functions

const shield = shieldQL({
isAuthenticated,
hasPermission,
});
Apply the ShieldQL middleware to your GraphQL endpoint:
javascript
Copy code
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { schema } = require('./schema'); // Replace with your GraphQL schema

const app = express();

app.use('/graphql', shield, graphqlHTTP({
schema,
graphiql: true, // Enable GraphiQL interface for testing (optional)
}));

app.listen(3000, () => {
console.log('Server started on http://localhost:3000');
});
Implement your custom authentication and authorization functions in a separate file (e.g., auth.js) and export them for ShieldQL to use.
Custom Authentication and Authorization Functions
ShieldQL allows you to define your custom authentication and authorization functions to suit your application's specific requirements. These functions should return true or false based on whether the user is authenticated and has the required permissions, respectively.

Here's an example of how your custom auth.js file might look:

javascript
Copy code
// auth.js

// Sample authentication function
const isAuthenticated = (user) => {
return user !== null; // Replace this with your actual authentication logic
};

// Sample authorization function
const hasPermission = (user, requiredPermission) => {
if (!user) {
return false;
}

// Replace this with your actual permission checking logic
return user.permissions.includes(requiredPermission);
};

module.exports = {
isAuthenticated,
hasPermission,
};
Remember to adapt the isAuthenticated and hasPermission functions according to your user authentication and authorization mechanisms.

Security Considerations
While ShieldQL offers essential security features, it's crucial to keep your application and dependencies up to date to stay protected against emerging security threats. Always follow best practices for securing your GraphQL APIs, such as input validation and error handling.

Contribution
We welcome contributions to ShieldQL! If you have any suggestions, bug reports, or feature requests, please open an issue or submit a pull request on our GitHub repository.

License
ShieldQL is licensed under the MIT License. See the LICENSE file for more details.

Thank you for using ShieldQL! We hope this library helps you secure your GraphQL APIs effectively. If you encounter any issues or need further assistance, please don't hesitate to reach out to us.

Happy coding! -->
