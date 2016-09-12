const fs = require('fs');
const pathApp = require('./pathApp');

/**
 * Check if a file aleady exist
 * @param  {String} module Module name
 * @return {Boolean}
 */
const isFileCreated = (env) => {
  try {
    fs.statSync(pathApp.fileDest(env).full);
  } catch (e) {
    return false;
  }
  return true;
}

module.exports = { isFileCreated };