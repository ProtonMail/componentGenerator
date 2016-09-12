const xtend = require('xtend');
const pathApp = require('./pathApp');
const moduleLink = require('./transformations/moduleLink');
const bindKeyTemplate = require('./transformations/bindKeysTemplate');
const { isFileCreated } = require('./tools');

/**
 * Check if a module exists and return its configuration
 * @param  {Object} env
 * @return {Object}     {exist: Boolean, config: Object}
 */
const findModule = (env) => {
  const configModule = xtend({}, env, {type: 'module'});
  return {
    exist: isFileCreated(configModule),
    config: configModule
  };
}

/**
 * Find files to build and generate a list of them
 * @param  {Object} env Component's configuration
 * @return {Array}
 */
const list = (env) => {

  const files = [];
  const transformTemlate = bindKeyTemplate(env);
  const templateFile = pathApp.loadSrcTemplate(env.type);
  const isModule = env.type === 'module';

  // Always update the module
  if (!isModule) {
    const { exist, config } = findModule(env);
    const { directory, fileName, full } = pathApp.fileDest(config);
    const templateFile = pathApp.loadSrcTemplate(config.type);
    const transformInject = moduleLink(env);

    files.push({
      transformations: [transformTemlate, transformInject],
      source: exist ? full : templateFile, // Do not override previous module
      dest: directory,
      fileName
    });
  }

  const { directory, fileName, full } = pathApp.fileDest(env);

  files.push({
    transformations: [transformTemlate],
    source: templateFile,
    dest: directory,
    fileName
  });

  return files;
}

module.exports = { list };