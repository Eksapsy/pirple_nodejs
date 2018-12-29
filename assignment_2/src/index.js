/**
 * Primary file for the API
 * 
 */

// Dependencies
const server  = require('./lib/server');
const workers = require('./lib/workers');

// Declare the app
let app = {};

/**
 * Starts the API HTTP & HTTPS Server and Worker schedules
 * 
 */
app.init = function() {
  // Start the HTTP and HTTPS server
  server.init();

  // Start the workers
  workers.init();
}

app.init();