/**
 * Route handlers for HTTP requests
 * 
 * All requests are RFC compliant
 * More info at https://tools.ietf.org/html/rfc7807
 * Missing features : type, instance, invalid-params
 */


// Dependencies
const router_menu     = require('./handlers/menu');
const router_ping     = require('./handlers/ping');
const router_notFound = require('./handlers/notFound');

// Library Container
let lib = {
  helpers: {},
  handlers: {}
};

/**
 * All the application routes
 */
lib.routes = {
  'menu'      : router_menu,
  'ping'      : router_ping,
  'not-found' : router_notFound
};

// Export library
module.exports = lib.routes;