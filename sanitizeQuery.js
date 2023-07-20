// init sanitizeQuery, a function that accepts 2 params input (a graphQL query) and maxDepth (the maximum query nesting depth permitted, default 10) that users will require and invoke in their applications to sanitize the passed-in query
const sanitizeQuery = (
  input,
  maxDepth = 10,
  maxLength = 2000,
  strict = false
) => {
  // check if input is more deeply nested than maxDepth
  deepLimit(input, maxDepth);
  // check if input is longer than maxLength
  lengthLimit(input, maxLength);
  // if no error, sanitize query:
  // whitelisting and blacklisting are options we are not currently pursuing, but could help further secure our queries
  // if function is being run on strict mode
  if (strict) {
    // init const blackList as arr of common SQL injection attacks (strings)
    const blackList = [
      '1=1',
      'select sqlite_version()',
      'SELECT sql FROM sqlite_schema',
      `SELECT group_concat(tbl_name) FROM sqlite_master WHERE type='table' and tbl_name NOT like 'sqlite_%'`,
    ];
    // iterate through each string in blackList
    for (const str in blackList) {
      // if input (query) contains a potentially malicious fragment, throw new error
      if (input.includes(str))
        throw new Error('potentially malicious string detected:', str);
    }
  }
  // amount limiting (limiting number of times a query can be called)
};

// init helper func deepLimit that accepts two params, input (a JSON string graphQL query) and depth (a number value) and throws an error if the passed-in input has a depth greater than depth, else returns input
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
  // true if the stack is empty, false if otherwise
  return input;
};

// init helper func deepLimit that accepts two params, input (a JSON string graphQL query) and length (a number value) and throws an error if the passed-in input has a length greater than length, else returns input
const lengthLimit = (input, length) => {
  // if input length exceeds passed-in param length, throw new Error
  if (input.length > length)
    throw new Error(
      'Mximum query length exceeded, modify query or maximum permitted query length'
    );
  // if input depth is within the permitted limits, return input
  return input;
};

// console.log(
//   deepLimit(
//     `query maliciousQuery {
//   thread(id: "some-id") {
//     messages(first: 99999) {
//       thread {
//         messages(first: 99999) {
//           thread {
//             messages(first: 99999) {
//               thread {
//                 # ...repeat times 10000...
//               }
//             }
//           }
//         }
//       }
//     }
//   }
// }`
//   )
// );

// export sanitizeQuery
module.exports = sanitizeQuery;
