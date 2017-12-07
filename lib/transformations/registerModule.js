const pathApp = require('../pathApp');
const prettify = require('../prettify');
const LIMIT_COMPONENT = 'templates-app';

/**
 * Get the template import for a component
 * @param  {String} component
 * @param  {String} type
 * @return {String}           Template
 */
const getImport = ({ module }) => `import ${module} from './${module}/index';`;

/**
 * Append import template into the module
 * @param  {String} str       Module body
 * @param  {String} importTpl Template for the import
 * @return {String}           Module body updated
 */
const appendImport = (str, importTpl) => `${importTpl}\n${str}`;
const loadModule = (str, { module }) => {
    return prettify(
        str.replace(new RegExp(`'${LIMIT_COMPONENT}',`), (match) => {
            return `${match}\n${module},`;
        })
    );
};

/**
 * inject a dependency into the module's body
 * @param  {Object} env Component config
 * @return {void}
 */
function factory(env) {
    // Compile templates
    const importTpl = getImport(env);

    return (content) => {
        return loadModule(appendImport(content, importTpl), env);
    };
}

module.exports = factory;
