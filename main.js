const { loginLink } = require('./loginLink');
const { sanitizeQuery } = require('./sanitizeQuery');
const { shieldqlConfig } = require('./shieldqlConfig');
const { validateUser } = require('./validateUser');

// our main.js file imports all of our library's functionality for export
module.exports = {
  validateUser,
  loginLink,
  sanitizeQuery,
  shieldqlConfig,
};
