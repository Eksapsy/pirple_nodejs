/**
 * Cart Model to shop items
 * 
 */

// Dependencies
const fs = require('fs');
const path = require('path');

// Library Container
let lib = {};

/**
 * The path of the menu data object
 */
lib.menuDest = path.join(__dirname, '../../../.data/menu.json');

/**
 * Creates a new menu item and stores it
 * @param {string} name The name of the new item
 * @param {number} cost The cost of the item
 * @param {function} callback Callback function `func(err, newItem)`
 */
lib.createItem = function(name, description, cost, callback) {
  lib.readMenu((err, menu) => {
    if(!err && menu) {
      // Typechecking
      name = typeof(name) === 'string' ? name : '';
      description = typeof(description) === 'string' ? description : '';
      cost = typeof(cost) === 'number' && cost > 0 ? cost : 0;

      if(name && description && cost) {
        // Constructing the new item
        const newItem = {name, description, cost};
        
        // Finding the maximum id number, new item will have maxId+1
        const intIdArray = Object.keys(menu).map((value) => parseInt(value));
        const maxId = Math.max(...intIdArray);
        
        const newItemId = typeof(maxId) === 'number' ? maxId + 1 : '1';
        
        // Add the new item on the copied menu
        menu[newItemId] = newItem;

        // Overwritte the old menu with the new modified one
        lib.rewriteMenu(menu, (err) => {
          if(!err) {
            callback(false, { id: newItemId, ...newItem });
          } else {
            callback(err);
          }
        });
      } else {
        callback('Error: wrong parameter(s), expected name to be string and cost to be a positive number');
      }
    } else {
      callback(err);
    }
  });
};

/**
 * Updates an item from the menu with the specified new values, if any
 * @param {string} id The id of the item
 * @param {{name: string, description: string, cost: number}} updatedFields Contains the fields to update
 * @param {function} callback Callback function `func(err, updatedItem)`
 */
lib.updateItem = function(id, updatedFields, callback) {
  if(typeof(id) === 'number') {
    lib.readMenu((err, menu) => {
      if(!err && menu) {
        if(menu[id]) {
          updatedFields.name = typeof(updatedFields.name) === 'string' ? updatedFields.name : '';
          updatedFields.description = typeof(updatedFields.description) === 'string' ? updatedFields.description : '';
          updatedFields.cost = typeof(updatedFields.cost) === 'number' ? updatedFields.cost : 0;
    
          if(updatedFields.name) {
            menu[id].name = updatedFields.name;
          }
          if(updatedFields.description) {
            menu[id].description = updatedFields.description;
          }
          if(updatedFields.cost) {
            menu[id].cost = updatedFields.cost;
          }
    
          lib.rewriteMenu(menu, (err) => {
            if(!err) {
              callback(false, menu[id]);
            } else {
              callback(err);
            }
          })
        } else {
          callback('Error: Item with this ID does not exist');
        }
      } else {
        callback(err);
      }
    });
  } else {
    callback('Error: ID was not type of number');
  }
};

/**
 * Removes an item from the menu
 * @param {string} id The id of the item to remove
 * @param {function} callback Callback function `func(err)`
 */
lib.removeItem = function(id, callback) {
  lib.readMenu((err, menu) => {
    if(!err && menu) {
      if(menu[id]) {
        delete menu[id];
  
        lib.rewriteMenu(menu, (err) => {
          if(!err) {
            callback(false);
          } else {
            callback(err);
          }
        })
      } else {
        callback('Error: Item with this ID does not exist');
      }
    } else {
      callback(err);
    }
  });
};

/**
 * Returns the information about a menu item
 * @param {string} id The id of the menu item
 * @param {function} callback Callback function `func(err, item)`
 */
lib.getItem = function(id, callback) {
  lib.readMenu((err, menu) => {
    if(!err && menu) {
      if(menu[id]) {
        callback(false, menu[id]);
      } else {
        callback('Error: Item with this ID does not exist');
      }
    } else {
      callback(err);
    }
  });
};


/**
 * Returns at the callback the current menu
 * @param {function} callback Callback function `func(err, menu)`
 */
lib.readMenu = function(callback) {
  const menu = require(lib.menuDest);
  if(menu) {
    callback(false, menu);
  } else {
    callback('Error: Menu is empty or file does not exist');
  }
};

/**
 * Overwrittes the old menu with a new one
 * @param {object} newMenu The new menu to write
 * @param {function} callback Callback function `func(err)`
 */
lib.rewriteMenu = function(newMenu, callback) {
  fs.open(lib.menuDest, 'w+', (err, fd) => {
    if(!err && fd) {
      const newMenuObjectToString = JSON.stringify(newMenu, '\t', '');
      fs.writeFile(fd, newMenuObjectToString, (err) => {
        if(!err) {
          callback(false);
        } else {
          callback(err);
        }
      });
    } else {
      callback(err);
    }
  });
};

//Export Library
module.exports = lib;