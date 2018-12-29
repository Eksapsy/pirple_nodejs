/**
 * Helper functions for small tasks
 * 
 */


// Dependencies


// Library Container
let lib = {};

lib.parseJsonToObject = (str) => {
  try {
    return JSON.parse(str);
  } catch(e) {
    return {};
  }
};

// Export library
module.exports = lib;