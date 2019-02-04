const handler = function(data, callback) {
  const methodFunction = '_' + data.method;
  if(handler[methodFunction]) {
    handler[methodFunction](data, (httpCode, res) => {
      callback(httpCode, res);
    });
  } else {
    callback(404, {error: {httpCode: 404, title: `${data.method.toUpperCase()} is not supported for this request`}});
  }
};

module.exports = handler;