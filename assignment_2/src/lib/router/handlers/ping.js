// Dependencies


// Handler
const handler = (data, callback) => {
  if(data.method === 'get') {
    callback(200, {respone: 'Pong!'})
  } else {
    callback(404, {error: {httpCode: 404, title: 'Unsupported request', detail: `${data.method.toUpperCase()} is not supported for this request`}});
  }
};

// Exporting the handler
module.exports = handler;