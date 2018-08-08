const url           = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const router        = require('./router');

// All the server logic for both the http and https server
var unifiedServer = function(req, res) {
  // Get the URL and parse it
  var parsedUrl = url.parse(req.url, true);

  // Get the query string as an object
  var queryStringObject = parsedUrl.query

  // Get the path
  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get the HTTP Method
  var method = req.method.toLowerCase();

  // Get the headers as an object
  var headers = req.headers;

  // Get the payload, if any
  var decoder = new StringDecoder('utf-8');
  var buffer  = '';
  req.on('data', function(data) {
    buffer += decoder.write(data);
    console.log('buffer updated: ', buffer);
  });
  req.on('end', function() {
    buffer += decoder.end();
    // Choose the handler this request should go to. If one is not found use the not found handler
    var chosenHandler = typeof(router.routedHandlers[trimmedPath]) !== 'undefined' ? 
      router.routedHandlers[trimmedPath] :
      router.handlers.notFound;

    // Construct the data object to send to the handler
    var data = {
      'trimmedPath': trimmedPath,
      'queryStringObject': queryStringObject,
      'method': method,
      'headers': headers,
      'payload': buffer
    };

    // Route the request to the handler specified in the router
    chosenHandler(data, function(statusCode, payload) {
      // Use the status code called back by the handler, or default to 200
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

      // Use the payload call back by the handler or default to an empty object
      payload = typeof(payload) == 'object' ? payload : {};

      // Convert the payload to a string
      var payloadString = JSON.stringify(payload);

      // Return the response
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);

      // Log the request path
      console.log('Returning the response: ', statusCode, payload);
    });

    });
};

module.exports = unifiedServer;