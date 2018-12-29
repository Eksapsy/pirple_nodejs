/**
 * HTTP & HTTPS server Runner
 * 
 */


// Dependencies
const path          = require('path');
const http          = require('http');
const https         = require('https');
const fs            = require('fs');
const url           = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const router        = require('./router');
const helpers       = require('./helpers');
const config        = require('./config');
const logger        = new (require('./logger'))('server');
const colors        = require('./color');

// Instantiate the server container
let server = {};

/**
 * Instantiate the HTTP Server
 * 
 */
server.httpServer = http.createServer((req, res) => {
  server.unifiedServer(req, res);
});

/**
 * HTTPS SSL/TSL credential options
 * 
 */
server.httpsServerOptions = {
  'key'  : fs.readFileSync(path.resolve('./https/key.pem')),
  'cert' : fs.readFileSync(path.resolve('./https/cert.pem'))
};

/**
 * Instantiate the HTTPS Server
 * 
 */
server.httpsServer = https.createServer(server.httpsServerOptions, (req, res) => {
  server.unifiedServer(req, res);
});

/**
 *  Server logic for both HTTP and HTTPS servers
 * 
 */
server.unifiedServer = function(req, res) {
  // Get URL and parse it
  const parsedUrl = new url.parse(req.url, true);

  // Get the query string as an object
  const queryStringObject = parsedUrl.query;

  // Get the path
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get the HTTP method
  const method = req.method.toLowerCase();

  // Get the HTTP headers
  const headers = req.headers;

  // Get the payload if any
  const decoder = new StringDecoder('utf-8');
  let buffer = '';
  req.on('data', (data) => {
    buffer += decoder.write(data);
  });
  req.on('end', () => {
    buffer += decoder.end();
    
    // Choose the handler this request should go. If one is not found then use the `not found` handler
    const chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ?
      router[trimmedPath] :
      router['not-found'];

    // Construct the data object to send to the handler
    const data = {
      'trimmedPath'       : trimmedPath,
      'queryStringObject' : queryStringObject,
      'method'            : method,
      'headers'           : headers,
      'payload'           : helpers.parseJsonToObject(buffer)
    };

    chosenHandler(data, (statusCode, payload) => {
      // Use the status code called back by the handler, or default it to 200
      statusCode = typeof(statusCode) === 'number' ? statusCode : 200;

      // Use the payload called back by the handler, or default it to an empty object
      payload = typeof(payload) === 'object' ? payload : {};

      // Convert payload to a string
      const payloadString = JSON.stringify(payload);

      // Return the response
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);

      // If status is 20X log it green, else log it red
      if(statusCode >= 200 && statusCode < 210) {
        logger.log(colors.green + colors.str + colors.reset, method.toUpperCase() + '/' + trimmedPath + ' ' + statusCode);
      } else {
        logger.log(colors.red + colors.str + colors.reset, method.toUpperCase() + '/' + trimmedPath + ' ' + statusCode);
      }
      
    });
  });
  
  
};

/**
 * Initializes the HTTP & HTTPS server
 * 
 */
server.init = function() {
  console.log(colors.yellow+colors.bright+colors.str+colors.reset, 'Server is running...');
  server.httpServer.listen(config.httpPort, () => {
    console.log(colors.dim + colors.str + colors.reset, 'HTTP server running on ' + config.httpPort);
  });
  server.httpsServer.listen(config.httpsPort, () => {
    console.log(colors.dim + colors.str + colors.reset, 'HTTPS server running on ' + config.httpsPort);
  });
};


// Export library
module.exports = server;