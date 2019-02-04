/**
 * Set of functions for User data manipulation and ease of access to user data
 * 
 */

// Dependencies
const fs   = require('fs');
const path = require('path');
const helpers = require('../helpers');

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
 * @param {function} callback Callback function `func(err, newUser)`
 */
lib.createUser = function(name, email, streetAddress, callback) {
  // Typechecking
  name = typeof(name) === 'string' ? name : '';
  email = typeof(email) === 'string' ? email : '';
  streetAddress = typeof(streetAddress) === 'string' ? streetAddress : '';

  if(name && email && streetAddress) {
    lib.userExists(email, (userExists) => {
      if(!userExists) {
        const hashedEmail = helpers.hash(email);
        const userDir = path.join(lib.userDist, hashedEmail+'.json');
        fs.open(userDir, 'w+', (err, fd) => {
          if(!err) {
            const user = {name, email, streetAddress};
            const userStringObject = JSON.stringify(user, '\t', 2);
            fs.writeFile(fd, userStringObject, (err) => {
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
 * @param {string} email User's email
 * @param {object} updatedFields Fields that have to be updated
 * @param {function} callback Callback function `func(err, updatedUser)`
 * TODO: only one field is written while other is null if not provided
 */
lib.updateUser = function(email, updatedFields, callback) {
  email = typeof(email) === 'string' ? email : '';
  if(email) {
    lib.userExists(email, (exists) => {
      if(exists) {
        // Getting fields to update
        const name          = typeof(updatedFields.name)          === 'string' ? updatedFields.name : '';
        const newEmail      = typeof(updatedFields.email)         === 'string' ? updatedFields.email : '';
        const streetAddress = typeof(updatedFields.streetAddress) === 'string' ? updatedFields.streetAddress : '';

        if (name || streetAddress || newEmail) {
          const userDir = path.join(lib.userDist, email+'.json');          
          // Get current user data, and update its fields
          fs.readFile(userDir, 'utf8', (err, userData) => {
            if(!err && userData) {
              const newUserObject = JSON.parse(userData);
              // Open user data file
              fs.open(userDir, 'w+', (err, fd) => {
                if(!err && fd) {
                  // Update fields that are specifically given without setting the rest to empty strings
                  if(name) newUserObject.name = name;
                  if(streetAddress) newUserObject.streetAddress = streetAddress;
                  if(email) newUserObject.email = newEmail;
                  // Stringifying JSON updated user object
                  const newUserObjectToString = JSON.stringify(newUserObject, '\t', ' ');
                  // Write the string object to the user data file
                  fs.writeFile(fd, newUserObjectToString, (err) => {
                    if(!err) {
                      callback(false, newUserObject);
                    } else {
                      callback('Couldn\'t write the new updates to user\'s file');
                    }
                  });
                } else {
                  callback('Couldn\'t open user\'s file');
                }
              });
            } else {
              callback(err);
            }
          });
        }
      } 
      // If email is to be updated, change the user's file name
      if(newEmail) {
        lib.userExists(newEmail, (exists) => {
          if(!exists) {
            const hashedOldEmail = helpers.hash(email);
            const hashedNewEmail = helpers.hash(newEmail);
            const oldEmailDir = path.join(lib.userDist, hashedOldEmail+'.json');
            const newEmailDir = path.join(lib.userDist, hashedNewEmail+'.json');
            fs.rename(oldEmailDir, newEmailDir, (err) => {
              if(!err) {
                // Update the user's attributes now that the file's name is updated with the new email
                lib.updateUser(newEmail, {name, streetAddress, email}, (err, updatedUser) => {
                  if(!err && updatedUser) {
                    callback(false, updatedUser);
                  } else {
                    callback(err);
                  }
                });
              } else {
                callback(err);
              }
            });
          } else {
            callback('Couldn\'t update user\'s email, another user with the same email exists');
          }
        });
      } else {
        callback('User to be updated doesn\'t exist');
      }
    });
  }
};

/**
 * Removes a stored user from the database
 * @param {string} email User's email
 * @param {function} function Callback function `func(err)`
 */
lib.removeUser = function(email, callback) {
  email = typeof(email) === 'string' ? email : '';

  if(email) {
    lib.userExists(email, exists => {
      if(exists) {
        const hashedEmail = helpers.hash(email);
        const userDir = path.join(lib.userDist, hashedEmail+'.json');
        fs.unlink(userDir, err => {
          if(!err) {
            callback(false);
          } else {
            callback('Couldn\'t delete user file');
          }
        });
      } else {
        callback('User doesn\'t exists');
      }
    });
  }
};

/**
 * Returns the stored user's data
 * @param {string} email User's email 
 * @param {function} callback Callback function `func(err, user)`
 */
lib.getUser = function(email, callback) {
  if(email) {
    console.log('email', email, helpers.hash(email));
    lib.userExists(email, exists => {
      if(exists) {
        const hashedEmail = helpers.hash(email);
        const userDir = path.join(lib.userDist, hashedEmail+'.json');
        fs.readFile(userDir, 'utf8', (err, data) => {
          if(!err && data) {
            callback(false, JSON.parse(data));
          } else {
            callback(err);
          }
        });
      } else {
        callback('User doesn\'t exists');
      }
    });
  }
};

/**
 * Returns the stored user's data
 * @param {function} callback Callback function `func(err, users)`
 * TODO: continue function
 */
lib.getUsers = function(callback) {
    fs.readdir(lib.userDist, (err, files) => {
      if(!err) {
        if(files.length > 0) {
          let users = [];
          const errors = [];

          files.forEach((file, index) => {
            const userDir = path.join(lib.userDist, file);
            fs.readFile(userDir, 'utf8', (err, data) => {
              if(!err && data) {
                users.push(JSON.parse(data));
              } else {
                errors.push(err);
              }

              // Return result if final file
              if(index == files.length-1) {
                if(errors.length === 0 && users.length > 0) {
                  callback(false, users);
                } else {
                  callback(errors);
                }
              }
            });
          });
        } else {
          callback(false, []);
        }
      } else {
        callback(err);
      }
    });
};

/**
 * @param {string} email The email the user identifies with
 * @param {function} callback Callback function `func(exists)`
 */
lib.userExists = function(email, callback) {
  const hashedEmail = helpers.hash(email);
  const userDir = path.join(lib.userDist, hashedEmail+'.json');

  fs.exists(userDir, (exists) => {
    callback(exists);
  });
};

//Export Library
module.exports = lib;