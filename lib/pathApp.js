const path = require('path');

const APP_SRC = path.join('.', 'src', 'app');
const APP_ROOT_SRC = path.join('.', 'src');
const TEMPLATES_SRC = path.join(path.resolve(__dirname, '..'), 'templates');

const loadSrcTemplate = (type) => path.join(TEMPLATES_SRC, `${type}.js`);

/**
 * Get the valid key for a component
 * @param  {String} type
 * @return {String}
 */
const getType = (type) => ('factory' !== type ? type + 's' : 'factories');

const getFileName = ({ component, type }, { isView, isCSS, isApp }) => {
    if (isView) {
        return `${component}.tpl.html`;
    }

    if (isCSS) {
        return `${component}.scss`;
    }

    if (isApp) {
        return 'app.js';
    }

    if (type === 'stylesheet') {
        return `app.scss`;
    }

    return 'module' === type ? 'index.js' : `${component}.js`;
};

const getSource = ({ component = '', type, module = '' }, { isView, isCSS, isApp }) => {
    if (isView) {
        return [APP_ROOT_SRC].concat('templates', module);
    }
    if (isCSS) {
        return [APP_ROOT_SRC].concat('sass', 'components', module);
    }

    if (isApp) {
        return [APP_SRC];
    }

    if (type === 'stylesheet') {
        return [APP_ROOT_SRC].concat('sass');
    }

    return [APP_SRC].concat(module || component).concat('module' === type ? [] : [getType(type)]);
};
/**
 * Generate the dest file from a custom env
 * @param  {String} options.component Name of the component
 * @param  {String} options.type      Type of it
 * @param  {String} options.module    Module's name
 * @return {Object}                   {full: path to the file, directory: directory of file, filename}
 */
const fileDest = (env = {}, options = {}) => {
    const fileName = getFileName(env, options);
    const src = getSource(env, options);

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
