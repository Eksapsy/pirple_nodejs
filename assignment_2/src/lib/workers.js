/**
 * Workers to run background processes
 * 
 */

 
// Dependencies
const config = require('./config');
const color  = require('./color');
const Logger = require('./logger');
const logger = new Logger('workers');

// Library Container
let lib = {};

/**
 * Background Processes to run on the workers
 * 
 */
lib.backgroundProcesses = [
  {
    'name'     : 'Log Rotation',
    'callback' : Logger.rotateLogs,
    'interval' : config.intervals.rotateLogs
  }
];

/**
 * Loops over the worker operations
 * 
 */
lib.loop = function() {
  lib.backgroundProcesses.forEach((process) => {
    if(process.interval > 0 && process.callback) {
      // Loop through the process for the interval specified in their configuration
      setInterval(
        () => {
          process.callback((err) => {
            if(!err) {
              const processNameColors = color.white + color.str + color.bright + color.cyan + color.str + color.reset;
              logger.log(processNameColors, 'Run ', process.name, `worker. Next loop after ${process.interval/1000} sec`);
            } else {
              logger.error(err);
            }
          });
        }, 
        process.interval
      );
    } else {
      throw new Error('Background Process has not been validly configured');
    }
  });
};

/**
 * Run all processes once
 * 
 */
lib.runAllProcesses = function() {
  lib.backgroundProcesses.forEach((process) => {
    if(process.callback) {
      process.callback((err) => {
        if(!err) {
          const processNameColors = color.white + color.str + color.bright + color.cyan + color.str + color.reset;
          logger.log(processNameColors, 'Initiated ', process.name, ' Worker');
        } else {
          logger.error(err);
        }
      });
    }
  });
};

/**
 * Initializes the Workers and loops over the background processes
 * 
 */
lib.init = function() {
  // Run at least once the background processes on the app startup
  lib.runAllProcesses();

  // Loop over each of the processes by their specified interval
  lib.loop();
}

// Export library
module.exports = lib;