const pathApp = require('../pathApp');
const LIMIT_COMPONENT = '//== Modals';

/**
 * Get the template import for a component
 * @param  {String} options.component
 * @param  {String} options.module
 * @return {String}           Template
 */
const getImport = ({ component, module }) => `@import "components/${module}/${component}";`;

/**
 * Append import template into the module
 * @param  {String} str       Module body
 * @param  {String} importTpl Template for the import
 * @return {String}           Module body updated
 */
const appendImport = ({ component, module }, str, importTpl) => {
    // Find last import
    const list = str.match(new RegExp(`@import "components\/${module}\/\\w+";`)) || [];
    const lastImport = list.length ? list[list.length - 1] : '';

    if (lastImport) {
        return str.replace(lastImport, (match) => `${match}\n${importTpl}`);
    }

    const scope = `//== ${module.charAt(0).toUpperCase() + module.substr(1)}`;
    // If no import, append it right before the limit
    return str.replace(/\/\/== Modals/, `${scope}\n${importTpl}\n\n${LIMIT_COMPONENT}`);
};

/**
 * inject a dependency into the module's body
 * @param  {Object} env Component config
 * @return {void}
 */
function factory(env) {
    const importTpl = getImport(env);
    return (content) => {
        return appendImport(env, content, importTpl);
    };
}

module.exports = factory;
