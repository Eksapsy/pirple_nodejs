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
const router_users    = require('./handlers/users');
// const router_cart     = require('./handlers/cart');
// const router_token    = require('./handlers/token');

// Library Container
let lib = {};

/**
 * All the application routes
 */
lib.routes = {
  'menu'      : router_menu,
  'ping'      : router_ping,
  'users'     : router_users,
  // 'cart'      : router_cart,
  // 'token'     : router_token,
  'not-found' : router_notFound
};

// Export library
module.exports = lib.routes;