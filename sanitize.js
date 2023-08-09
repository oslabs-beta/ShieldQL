// sanitize is a function that accepts 4 params input (required, a graphQL query type string), strict (a bool value, default false, that enables additional query sanitization), maxDepth (the maximum query nesting depth permitted, type integer), and maxLength (maximum permitted query length, type integer) that users will require and invoke in their applications to sanitize the passed-in query.
// Can be used as a standalone function and is also invoked within the body of the sanitizeQuery function
const sanitize = (input, strict = false, maxDepth = 10, maxLength = 2000) => {
  // validate input type is string
  if (typeof input !== 'string') throw new Error('input must be a string');
  // check if input is more deeply nested than maxDepth
  deepLimit(input, maxDepth);
  // check if input is longer than maxLength
  lengthLimit(input, maxLength);
  // if function is being run on strict mode
  if (strict && strict !== 'false') {
    // init const blockList as arr of potentially malicious fragments (strings)
    const blockList = [
      // common SQL injection fragments
      '1=1',
      `' OR`,
      'select sqlite_version()',
      '@skip',
      '@@version',
      'DROP TABLE',
      'UNION SELECT null',
      'SELECT sql FROM sqlite_schema',
      `SELECT group_concat(tbl_name) FROM sqlite_master WHERE type='table' and tbl_name NOT like 'sqlite_%'`,
      // common HTML injection fragments
      '<script',
      'script/>',
      'script ',
      ' script ',
      // dangerous characters
      '<',
      '>',
      '-',
      '/',
      "'",
      `{"`,
      `"{`,
      `}"`,
      `*`,
      `"}`,
      `\\`,
      `{\\`,
      // log spoofing
      `%`,
      // PHP code insertion
      'php',
    ];
    // iterate through each string in blockList
    for (const str of blockList) {
      // if input (query) contains a potentially malicious fragment, throw new error
      if (input.includes(str))
        throw new Error(`potentially malicious string detected:, ${str}`);
    }
  }
  // if no potential threats are detected, return the input query string
  return input;
};

// deepLimit is a function that accepts two params, input (a JSON string graphQL query) and depth (a number value) and throws an error if the passed-in input has a depth greater than depth, else returns input
const deepLimit = (input, depth) => {
  // init const stack as an empty array
  const stack = [];
  // iterate through the input array
  for (let i = 0; i < input.length; i++) {
    if (stack.length > depth)
      throw new Error(
        'Maximum query depth exceeded, modify query or maximum permitted query depth'
      );
    const el = input[i];
    // if the element is '{' push it to the stack
    if (el === '{') stack.push(el);
  }
  return input;
};

// init helper func lengthLimit that accepts two params, input (a JSON string graphQL query) and length (a number value) and throws an error if the passed-in input has a length greater than length, else returns input
const lengthLimit = (input, length) => {
  // if input length exceeds passed-in param length, throw new Error
  if (input.length > length)
    throw new Error(
      'Maximum query length exceeded, modify query or maximum permitted query length'
    );
  // if input depth is within the permitted limits, return input
  return input;
};

module.exports = { sanitize };
