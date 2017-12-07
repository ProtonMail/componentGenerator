const pathApp = require('../pathApp');

/**
 * Get the template import for a component
 * @param  {String} component
 * @param  {String} type
 * @return {String}           Template
 */
const getImport = (component, type) => `import ${component} from './${pathApp.getType(type)}/${component}';`;

/**
 * Get the dependency's template for a component
 * @param  {String} component
 * @param  {String} type
 * @return {String}           Template
 */
const getComponent = (component, type) => `.${type}('${component}', ${component})`;

/**
 * Append import template into the module
 * @param  {String} str       Module body
 * @param  {String} importTpl Template for the import
 * @return {String}           Module body updated
 */
const appendImport = (str, importTpl) => {
    // Find last import
    const list = str.match(/import \w+ from '\.\/\w+\/\w+';/g) || [];
    const lastImport = list.length ? list[list.length - 1] : '';

    if (lastImport) {
        return str.replace(lastImport, (match) => `${match}\n${importTpl}`);
    }

    // If no import, append it at the begining of the module
    return `${importTpl}\n\n${str}`;
};

/**
 * Append dependency template into the module
 * @param  {String} str       Module body
 * @param  {String} componentTpl Template for the dependency
 * @return {String}           Module body updated
 */
const appendComponent = (str, componentTpl) => {
    // Find the last dependency injected
    const list = str.match(/\.\w+\('\w+', \w+\)?;/g) || [];
    const lastDep = list.length ? list[list.length - 1] : '';

    if (lastDep) {
        return str.replace(lastDep, (match) => `${match.replace(';', '')}\n    ${componentTpl};\n`);
    }

    // If there is no dependency, append it after the module declaration
    return str.replace(']);', `])\n    ${componentTpl};\n`);
};

/**
 * Filter the body of a module and inject the dependency and import
 * for the new component
 * @param  {String} str          Module's body
 * @param  {String} importTpl    Template of import
 * @param  {String} componentTpl Template of the dependency
 * @return {String}              Updated body
 */
const filterContent = (str, importTpl, componentTpl) => {
    return appendComponent(appendImport(str, importTpl), componentTpl);
};

/**
 * inject a dependency into the module's body
 * @param  {Object} env Component config
 * @return {void}
 */
function factory(env) {
    // Compile templates
    const importTpl = getImport(env.component, env.type);
    const componentTpl = getComponent(env.component, env.type);

    return (content) => {
        return filterContent(content, importTpl, componentTpl);
    };
}

module.exports = factory;
