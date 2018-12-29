/**
 * Cart Model to shop items
 * 
 */

// Dependencies


// Library Container
let lib = {};

/**
 * Adds an item to the user's cart with the specified amount
 * @param {string} userId The user's id that we want to access the cart from
 * @param {string} itemId The item's id we want to add to the cart
 * @param {number} amount The amount of the item specified we want to add to the cart
 * @param {function} callback Callback function
 */
lib.addItem = function(userId, itemId, amount, callback) {

};

/**
 * Removes a specified amount of the item specified from the specified user's cart
 * @param {string} userId The user's id that we want to access the cart from
 * @param {string} itemId The item's id we want to remove from the cart
 * @param {number} amount The amount of the item specified we want to remove from the cart
 * @param {function} callback Callback function
 */
lib.removeItem = function(userId, itemId, amount, callback) {
  
};


/**
 * Finishes order by emailing a receipt to the user and removing the items from the cart
 * @param {string} userId The user's id to finish the order for
 * @param {function} callback Callback function
 */
lib.commitOrder = function(userId, callback) {

};


//Export Library
module.exports = lib;