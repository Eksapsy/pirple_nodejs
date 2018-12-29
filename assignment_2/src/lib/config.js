/**
 * Create and export configuration variables
 * 
 */

// Dependencies


// Container for all the environments
let environments = {};

// Development (default) environment
environments.development = {
  'httpPort'      : 3000,
  'httpsPort'     : 3001,
  'envName'       : 'dev',
  'hashingSecret' : 'darthVader',
  'maxChecks'     : 5,
  'intervals'     : {
    'rotateLogs' : 1000 * 60 * 60
  }
};

// Staging environment
environments.staging = {
  'httpPort'      : 4000,
  'httpsPort'     : 4001,
  'envName'       : 'staging',
  'hashingSecret' : 'sithAnakin',
  'maxChecks'     : 5,
  'intervals'     : {
    'rotateLogs' : 1000 * 60 * 60 * 24
  }
};

// Production environment
environments.production = {
  'httpPort'      : 5000,
  'httpsPort'     : 5001,
  'envName'       : 'production',
  'hashingSecret' : 'yodaForce',
  'maxChecks'     : 5,
  'intervals'     : {
    'rotateLogs' : 1000 * 60 * 60 * 24
  }
};

// Determine which environment was passed as a command-line argument
const currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ?
  process.env.NODE_ENV.toLowerCase() :
  '';

// Check that the current environment is one of the environments above, if not then set it to default (development)
const environmentToExport = typeof(environments[currentEnvironment]) !== 'undefined' ?
  environments[currentEnvironment] :
  environments.development;

// Export library
module.exports = environmentToExport;