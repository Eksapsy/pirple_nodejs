/*
 * Primary file for the API
 * 
*/

// Dependencies
const http          = require('http');
const https         = require('https');
const fs            = require('fs');
const config        = require('./config');
const unifiedServer = require('./unifiedServer');

// Instantiate the HTTP server
var httpServer = http.createServer(function(req, res) {
  unifiedServer(req, res);
});

// Start the HTTP server
httpServer.listen(config.httpPort, function() {
  console.log('The server is listening on port ' + config.httpPort + ' in ' + config.envName + ' mode');
})

// Instantiate the HTTPS server
var httpsServerOptions = {
  'key': fs.readFileSync('./https/key.pem'),
  'cert': fs.readFileSync('./https/cert.pem')
};
var httpsServer = https.createServer(httpsServerOptions, function(req, res) {

  unifiedServer(req, res);
});

// Start the HTTPS server
httpsServer.listen(config.httpsPort, function() {
  console.log('The server is listening on port ' + config.httpsPort + ' in ' + config.envName + ' mode');
});