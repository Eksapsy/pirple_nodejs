/**
 * Helper functions for small tasks
 * 
 */


// Dependencies
const crypto = require('crypto');
const config = require('./config');

// Library Container
let lib = {};

lib.parseJsonToObject = (str) => {
  try {
    return JSON.parse(str);
  } catch(e) {
    return {};
  }
};

/**
 * @param {string} str The string to be hashed
 */
lib.hash = (str) => {
  if(typeof(str) === 'string' && str.length > 0) {
    const hash = crypto.createHmac('sha256', config.hashingSecret)
      .update(str)
      .digest('hex');

      return hash;
  } else {
    return false;
  }
}

// Export library
module.exports = lib;