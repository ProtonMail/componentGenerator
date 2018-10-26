const path = require('path');

const log = require('./log');
const { isFileCreated } = require('./tools');
const fileBuilderConfig = require('./fileBuilderConfig');
const fileBuilder = require('./fileBuilder');

/**
 * Build a component based on a configuration
 * The config comes from the service fileBuilderConfig
 * @param  {Array} options.transformations Transformations for the body of the component
 * @param  {String} options.source          Input file
 * @param  {String} options.dest            Output file
 * @param  {String} options.fileName        FileName
 * @return {void}
 */
const buildComponent = async ({ transformations, source, dest, fileName, body, full, exist }) => {
    const tap = (fileBody) => {
        // Bind informations into the body of the template
        const content = fileBody.toString();
        const str = !body ? transformations.reduce((acc, pipe) => pipe(acc), content) : body;
        return Buffer.from(str);
    };

    await fileBuilder({
        output: full || path.join(dest, fileName),
        input: source,
        tap
    });

    const action = /^app\.(js|scss)$/.test(fileName) || exist ? 'updated' : 'created';
    log.success(`Component ${fileName} ${action} → ${dest}`);
};

/**
 * Create components
 *  - If no module for the component, creates a new one
 *  - Inject into the module the dependency
 * Ex env:
 *   {
 *      "component": "dew",
 *      "type": "directive",
 *      "module": "test",
 *      "options": {
 *        "hasCtrl": false,
 *        "hasCSS": true
 *      }
 *    }
 * @param  {Object} env Configuration for a module
 * @return {void}
 */
const create = async (env) => {
    if (isFileCreated(env)) {
        log.error('This component already exists.', JSON.stringify(env, null, 2));
    }

    const list = fileBuilderConfig.list(env);
    await Promise.all(list.map(buildComponent));
};

module.exports = { create };
