const path = require('path');

const APP_SRC = path.join('.', 'src', 'app');
const TEMPLATES_SRC = path.join(path.resolve(__dirname, '..'), 'templates');

const loadSrcTemplate = (type) => path.join(TEMPLATES_SRC, `${type}.js`);

/**
 * Get the valid key for a component
 * @param  {String} type
 * @return {String}
 */
const getType = (type) => ('factory' !== type ? type + 's' : 'factories');

/**
 * Generate the dest file from a custom env
 * @param  {String} options.component Name of the component
 * @param  {String} options.type      Type of it
 * @param  {String} options.module    Module's name
 * @return {Object}                   {full: path to the file, directory: directory of file, filename}
 */
const fileDest = ({ component = '', type, module = '' }) => {
    const fileName = 'module' === type ? 'index.js' : `${component}.js`;
    const src = [APP_SRC].concat(module || component).concat('module' === type ? [] : [getType(type)]);

    return {
        full: path.join(...src.concat(fileName)),
        directory: path.join(...src),
        fileName
    };
};

module.exports = {
    APP_SRC,
    TEMPLATES_SRC,
    loadSrcTemplate,
    fileDest,
    getType
};
