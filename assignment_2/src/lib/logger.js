/**
 * Library for logging, storing and rotating logs
 * 
 * Error-policy of this certain parts of this library is strict.
 * When no callback is included in the function, you should suppose the errors are thrown internally.
 * 
 */

// Dependencies 
const fs       = require('fs');
const path     = require('path');
const zlib     = require('zlib');
const debuglog = require('util').debuglog;

/* 
 * Container for the module
 */
let lib = function(debugName) {
  if(debugName) {
    this.debugName = debugName;
  } else {
    throw new Error('Debug Name has not given for the specific logger instance');
  }
};

/**
 * Saving the date as static, to be used by all logger instances and to be updated globally
 */
lib.date = Date.now();

lib.baseDir = path.join(__dirname + '../../../.logs/');

/**
 * Prints a message to the nodejs util debugger and logs it to a log file
 * @param {string} msg The message to print to the logger
 * @param {string} level The level of importance of the message
 */
lib.prototype.logLevel = function(msg, level) {

  const msgArgs = Array.prototype.slice.call(arguments, 3);
  const logFilePath = lib.baseDir + lib.date + '.log';

  // Output the log to the NodeJS utility debug logger
  debuglog(this.debugName)(msg, ...msgArgs);


  // Store the log in log file
  fs.open(
    logFilePath, 
    'a+', 
    (err, fd) => {
      if(!err && fd) {
        // If no level is defined, default it to `info`
        if(!level) level = 'info';

        // Color UNICODE Regex
        const colorByteRegex = /\\u\d+b\[\d+m(%s)*/g;
        // Quotes Regex
        const quotesRegex = /"/g;
        // Replace Color and Quotes by JSON Stringifier with empty string
        const fileMsg = (JSON.stringify(msg + msgArgs.join(''))).replace(colorByteRegex, '').replace(quotesRegex, '');
        // All the necessary log information to print to the file
        const fileLogMsg = '\n' + JSON.stringify({date: Date.now(), msg: fileMsg, level});

        // Append the fileMsg to the log file
        fs.write(
          fd,
          fileLogMsg, 
          (err, written, str) => {
          if(err && !written) {
            throw new Error('Coulnt\'t write to the log file, error: ', err);
          }
        });
      } else {
        throw new Error('Couldn\'t create a log file, error: ', err);
      }
  });
}

/**
 * Log the message to the appropriate files and the utitity debug logger of NodeJS library
 * 
 * If an error occures, the program immediately throws an error, since it's an important issue for info to be logged
 * @param {object} msg
 */
lib.prototype.log = function(msg) {
  this.logLevel(msg, 'info', ...arguments);
};

/**
 * Log a message with level being equal to 'error'
 * Same as using `logger.log('error', 'message')`
 * @param {*} msg The error message to log
 */
lib.prototype.error = function(msg) {
  this.logLevel(msg, 'error');
};


/**
 * Rotate (compress) the uncompressed log files
 * @param {function} callback
 */
lib.rotateLogs = function(callback) {
  const logPath = path.join(__dirname + '../../../.logs/');

  lib.getLogs(false, (err, filenames) => {
    if(!err && filenames.length > 0) {
      filenames.forEach(filename => {

        // Make sure the filename doesn't contain filetype extension
        const logId = filename.replace('.log', '');
        // Compressed logfile contains compression date information on its name
        const newLogId = filename + '-' + Date.now();
        // Compress the log to a different file
        lib.compress(logId, newLogId, (err) => {
          if(!err) {
            lib.unlink(logId, (err) => {
              if(!err) {
                lib.date = Date.now();
                callback(false);
              } else {
                callback(err);
              }
            });
          } else {
            callback(err);
          }
        });
      });
    } else {
      callback(err);
    }
  });
};


/**
 * Compresses a log file
 * @param {string|number} logId The log id of the log file
 * @param {string|number} newLogId The new log id of the compressed log file
 * @param {function} callback Callback function 
 */
lib.compress = function(logId, newLogId, callback) {
  const sourceLogFile      = logId + '.log';
  const destinationLogFile = newLogId + '.gz.b64';

  // Read the source file
  fs.readFile(lib.baseDir + sourceLogFile, (err, inputString) => {
    if(!err && inputString) {
      // Compress the data using gzip
      zlib.gzip(inputString, (err, buffer) => {
        if(!err && buffer) {
          // Send the data to the destination file
          fs.open(lib.baseDir + destinationLogFile, 'wx', (err, fd) => {
            if(!err && fd) {
              fs.writeFile(fd, buffer.toString('base64'), (err) => {
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
        } else {
          callback(err);
        }
      });
    } else {
      callback(err);
    }
  })
};

/**
 * Decompresses any compressed log file that includes the specified logid
 * @param {string|number} logid The log id of the log file
 * @param {function} callback Callback function
 */
lib.decompress = function(logid, callback) {
  lib.getLogs(true, (err, filenames) => {
    if(!err) {
      filenames.forEach(filename => {
        if(filename.indexOf(logid) && filename.indexOf('.gz.b64')) {
          fs.readFile(filename + '.gz.b64', (err, str) => {
            if(!err && str) {
              // Decompress the data
              const inputBuffer = Buffer.from(str, 'base64');

              zlib.unzip(inputBuffer, (err, outputBuffer) => {
                if(!err && outputBuffer) {
                  const str = outputBuffer.toString();
                  callback(false, str);
                } else {
                  callback(err);
                }
              });
            } else {
              callback(err);
            }
          });
        }
      });
    } else {
      callback(err);
    }
  });
}

/**
 * Lists all the log files with a conditional parameter to include the compressed ones as well
 * @param {boolean} includeCompressedLogs Includes compressed logs
 * @param {function} callback Callback function
 */
lib.getLogs = function(includeCompressedLogs, callback) {
  const logPath = path.join(__dirname + '../../../.logs/');

  fs.readdir(logPath, {encoding: 'utf8'}, (err, files) => {
    if(!err) {
      let trimmedFilenames = [];
      files.forEach(filename => {
        // Add .log file
        if(filename.indexOf('.log') > -1) {
          trimmedFilenames.push(filename.replace('.log', ''));
        }

        // Add .gz.b64 file
        if(filename.indexOf('.gz.b64') > -1 && includeCompressedLogs) {
          trimmedFilenames.push(filename.replace('.gz.b64', ''));
        }
      });
      callback(false, trimmedFilenames);
    } else {
      callback(err);
    }
  });
};

/**
 * Deletes (unlinks) the log file with the specified log id
 * @param {string|number} logId The log id
 * @param {function} callback Callback function
 */
lib.unlink = function(logId, callback) {
  fs.unlink(lib.baseDir + logId + '.log', function(err) {
    if(!err) {
      callback(false);
    } else {
      callback(err);
    }
  });
};


// Export Module
module.exports = lib;