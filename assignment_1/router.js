// Define the handlers
var handlers = {};

// Ping handler
handlers.ping = function(data, callback) {
  callback(200);
};

// Hello World handler
handlers.hello = function(data, callback) {
  if(data.method === 'post') {
    return callback(
      200, 
      {
        title: 'Hey! Thats my homework assignment', 
        description: 'Hm? Do you like it?',
        youranswerhere: 'Hell yeah I like it (yes, you said this)',
        youactuallysaid: data.payload
      }
    );
  }
  return handlers.notFound(data, callback);
};

// Not found handler
handlers.notFound = function(data, callback) {
  callback(404);
};

// Define a request router
var routedHandlers = {
  'ping': handlers.ping,
  'hello': handlers.hello
};

var router = {
  routedHandlers,
  handlers
};

module.exports = router;