/**
 * Set of functions for User data manipulation and ease of access to user data
 * 
 */

// Dependencies
const fs   = require('fs');
const path = require('path');

// Library Container
let lib = {};

/** 
 * Directory of User data 
 */
lib.userDist = path.join(__dirname, '../../../.data/users/');

/**
 * Stores a new user in the database
 * @param {string} name Name of the customer
 * @param {string} email Email of the customer
 * @param {string} streetAddress Street address
 * @param {function} callback Callback function
 */
lib.createUser = function(name, email, streetAddress, callback) {
  // Typechecking
  const name = typeof(name) === 'string' ? name : '';
  const email = typeof(email) === 'string' ? email : '';
  const streetAddress = typeof(streetAddress) === 'string' ? streetAddress : '';

  if(name && email && streetAddress) {
    lib.userExists(email, (userExists) => {
      if(!userExists) {
        fs.open(lib.userDist+email+'.json', 'w+', (err, fd) => {
          if(!err) {
            const user = {name, email, streetAddress};
            fs.writeFile(fd, user, (err) => {
              if(!err) {
                callback(false, user);
              } else {
                callback(err);
              }
            });
          } else {
            callback(err);
          }
        });
      } else {
        callback('User with the same email already exists');
      }
    })
  } else {
    callback('Invalid parameters');
  }
};

/**
 * Updates the fields of the specified stored user in the database
 * @param {string|number} email User's email
 * @param {object} updatedFields Fields that have to be updated
 * @param {function} callback Callback function
 */
lib.updateUser = function(email, updatedFields, callback) {
  const email = typeof(email) === 'string' ? email : '';
  if(email) {
    lib.userExists(email, (exists) => {
      if(exists) {
        // Getting fields to update
        const name          = typeof(updatedFields.name)          === 'string' ? updatedFields.name : '';
        const newEmail      = typeof(updatedFields.email)         === 'string' ? updatedFields.email : '';
        const streetAddress = typeof(updatedFields.streetAddress) === 'string' ? updatedFields.streetAddress : '';

        // If email is to be updated, change the user's file name
        if(newEmail) {
          lib.userExists(newEmail, (exists) => {
            if(!exists) {
              fs.rename(lib.userDist+email+'.json', lib.userDist+newEmail+'.json', (err) => {
                if(!err) {

                } else {

                }
              });
            } else {
              callback('Couldn\'t update user\'s email, another user with the same email exists');
            }
          });
        } else {

        }
      } else {
        callback('User to be updated doesn\'t exist');
      }
    });
  } else {
    callback('Invalid email, should be a string');
  }
};

/**
 * Removes a stored user from the database
 * @param {string|number} email User's email
 * @param {function} function Callback function
 */
lib.removeUser = function(email, callback) {

};

/**
 * Returns the stored user's data
 * @param {string|number} email User's email 
 * @param {function} callback Callback function
 */
lib.getUser = function(email, callback) {

};

lib.userExists = function(email, callback) {
  fs.exists(lib.userDist+email+'.js on', (exists) => {
    callback(exists);
  });
};

//Export Library
module.exports = lib;