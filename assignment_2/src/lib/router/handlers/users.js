// Dependencies
const handler = require('../handler');
const User    = require('../../models/User');

// Handler Methods
handler._get = function(data, callback) {
  console.log('loli');
  // Type checking
  const email = typeof(data.queries.email) === 'string' ? data.queries.email : '';
  if(email) {
    User.getUser(email, (err, user) => {
      if(!err && user) {
        callback(200, {data: {user}});
      } else {
        callback(400, {error: {httpCode: 400, title: 'Couldn\'t get user', detail: err}});
      }
    });
  } else {
    User.getUsers((err, users) => {
      if(!err && users) {
        callback(200, {data: {users}});
      } else {
        callback(400, {error: {httpCode: 400, title: 'Couldn\'t get users', detail: err}});
      }
    });
  }
};

handler._post = function(data, callback) {
  const name = typeof(data.payload.name) === 'string' ? data.payload.name : '';
  const email = typeof(data.payload.email) === 'string' 
                  && data.payload.email.length > 6
                    ? data.payload.email : '';
  const street = typeof(data.payload.streetAddress) === 'string' ? data.payload.streetAddress : '';

  if(name && email && street) {
    User.createUser(name, email, street, (err, user) => {
      if(!err) {
        callback(201, {response: {title: 'New user created', user}});
      } else {
        callback(400, {error: {httpCode: 400, title: 'Couldn\'t create user', detail: err}});    
      }
    });
  } else {
    callback(400, {error: {httpCode: 400, title: 'Invalid parameters', detail: 'Some parameters were either invalid or were not included'}});
  }
};

handler._put = function(data, callback) {
  const name = typeof(data.payload.name) === 'string' ? data.payload.name : '';
  const email = typeof(data.payload.email) === 'string' 
                  && data.payload.email.length > 5
                    ? data.payload.email : '';
  const newEmail = typeof(data.payload.newEmail) === 'string' 
                  && data.payload.newEmail.length > 6
                    ? data.payload.newEmail : '';
  const streetAddress = typeof(data.payload.streetAddress) === 'string' ? data.payload.streetAddress : '';

  if(name || newEmail || streetAddress) {
    User.updateUser(email, {name, streetAddress, email: newEmail}, (err, updatedUser) => {
      if(!err && updatedUser) {
        callback(200, {response: {title: 'User has been updated', updatedUser}});
      } else {
        callback(400, {error: {httpCode: 400, title: 'Couldn\'t update user', detail: err}});
      }
    });
  } else {
    callback(400, {error: {httpCode: 400, title: 'Invalid or empty parameter(s)', detail: 'Parameter(s) is either invalid, empty or not at least one required parameter was given'}});
  }
};

handler._delete = function(data, callback) {
  const email = typeof(data.payload.email) === 'string' 
  && data.payload.email.length > 5
    ? data.payload.email : '';

    if(email) {
      User.removeUser(email, (err) => {
        if(!err) {
          callback(200, {response: {title: 'User deleted'}});
        } else {
          callback(400, {error: {title: 'Couldn\'t remove user', detail: err}});
        }
      });
    } else {
      callback(400, {error: {httpCode: 400, title: 'Invalid parameter', detail: 'The emaill was either not given or less than the minimum required characters (6)'}});
    }
};

// Export Handler
module.exports = handler;