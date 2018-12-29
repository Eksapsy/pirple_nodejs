// Dependencies
const Menu = require('../../models/Menu');

// Handler
const handler = function(data, callback) {
  if(data.method === 'get') {
    handler._get(data, (httpCode, res) => {
      callback(httpCode, res);
    })
  } 
  else if (data.method === 'post') {
    handler._post(data, (httpCode, res) => {
      callback(httpCode, res);
    });
  } else if (data.method === 'put') {
    handler._put(data, (httpCode, res) => {
      callback(httpCode, res);
    });
  }
  else {
    callback(404, {error: {httpCode: 404, title: `${data.method.toUpperCase()} is not supported for this request`}});
  }
};

handler._get = function(data, callback) {
  Menu.readMenu((err, menu) => {
    if(!err) {
      if(menu) {
        callback(200, menu);
      } else {
        callback(200, {menu: 'Empty or menu data file does not exist.'});
      }
    } else {
      callback(500, {error: {httpCode: 500, title: 'A Menu data file probably does not exist', detail: err}});
    }
  });
};

handler._post = function(data, callback) {
  // Type Checking
  const name = typeof(data.payload.name) === 'string' ? data.payload.name : '';
  const description = typeof(data.payload.description) === 'string' ? data.payload.description : '';
  const cost = typeof(data.payload.cost) === 'number' && data.payload.cost > 0 ? data.payload.cost : 0;

  if(name && description && cost) {
    Menu.createItem(name, description, cost, (err, item) => {
      if(!err && item) {
        callback(201, {response: {title: 'New item created', item} });
      } else {
        callback(500, {error: {httpCode: 500, title: 'Couldnt create item', detail: err}});
      }
    });
  } else {
    callback(400, {error: {httpCode: 400, title: 'Invalid parameters', detail: 'Some parameters were either invalid or were not included'}});
  }
};

handler._put = function(data, callback) {
  // Type Checking
  const id = typeof(data.payload.id) === 'number' || typeof(data.payload.id) === 'string' ? data.payload.id : '';
  const name = typeof(data.payload.name) === 'string' ? data.payload.name : '';
  const description = typeof(data.payload.description) === 'string' ? data.payload.description : '';
  const cost = typeof(data.payload.cost) === 'number' && data.payload.cost > 0 ? data.payload.cost : 0; 

  if(id) {
    Menu.readMenu((err, menu) => {
      if(!err) {
        if(menu[id]) {
          Menu.updateItem(
            id, 
            {name, description, cost}, 
            (err, item) => {
              if(!err) {
                callback(200, {response: {title: 'Item has been updated', item}});
              } else {
                callback(500, {error: {httpCode: 500, title: 'Internal Server Error', detail: err}}); 
              }
            }
           );
        } else {
          callback(400, {error: {httpCode: 400, title: 'Item doesn\'t exist', detail: 'The item to be updated doesn\'t exist in the database'}});
        }
      } else {
        callback(500, {error: {httpCode: 500, title: 'Internal Server Error', detail: err}});
      }
    });
  } else {
    callback(400, {error: {httpCode: 400, title: 'Invalid Parameter', detail: '`id` is not of type number or string'}});
  }
};

// Exporting the handler
module.exports = handler;