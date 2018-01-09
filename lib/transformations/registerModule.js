const pathApp = require('../pathApp');
const prettify = require('../prettify');

/**
 * Last module's name inside the dependency list of the current
 * module.
 * We will return this name in otder to add our new module next to it.
 * @param  {Boolean} isLazy
 * @return {String}
 */
const getLimitComponent = (isLazy) => (isLazy ? 'ui.indeterminate' : 'templates-app');

/**
 * Create the import module
 * If you create a component type:module, module won't be defined.
 * It's defined when you attach a component to a module
 * @param  {String} options.module
 * @param  {String} options.component
 * @return {String}
 */
const getImport = ({ module, component }) => `import ${module || component} from './${module || component}/index';`;

/**
 * Append import template into the module
 * @param  {String} str       Module body
 * @param  {String} importTpl Template for the import
 * @return {String}           Module body updated
 */
const appendImport = (str, importTpl) => `${importTpl}\n${str}`;
const loadModule = (str, { module, component, isLazy }) => {
    return prettify(
        str.replace(new RegExp(`'${getLimitComponent(isLazy)}',`), (match) => {
            return `${match}\n${module || component},`;
        })
    );
};

/**
 * inject a dependency into the module's body
 * @param  {Object} env Component config
 * @return {void}
 */
function factory(env) {
    const importTpl = getImport(env);
    return (content) => {
        return loadModule(appendImport(content, importTpl), env);
    };
}

module.exports = factory;
