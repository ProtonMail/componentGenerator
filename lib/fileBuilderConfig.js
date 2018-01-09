const xtend = require('xtend');
const templates = require('./templates');
const prettify = require('./prettify');
const pathApp = require('./pathApp');
const moduleLink = require('./transformations/moduleLink');
const registerSass = require('./transformations/registerSass');
const registerModule = require('./transformations/registerModule');

const { isFileCreated, identity } = require('./tools');
const MAIN_SRC_TPL = pathApp.loadSrcTemplate('main');
/**
 * Check if a module exists and return its configuration
 * @param  {Object} env
 * @return {Object}     {exist: Boolean, config: Object}
 */
const findModule = (env, type = 'module') => {
    const configModule = xtend({}, env, { type });
    return {
        exist: isFileCreated(configModule),
        config: configModule
    };
};

/**
 * Get the template to load for a custom env
 * @param  {Object} env
 * @param  {Boolean} options.isCSS
 * @param  {Boolean} options.isView
 * @return {String}
 */
const getTemplate = (env, { isCSS, isView } = {}) => {
    if (env.type === 'module') {
        return prettify(templates.module(env).trim());
    }

    if (isView) {
        return templates.view(env);
    }

    if (isCSS) {
        return templates.css(env);
    }

    return prettify(`
        /* @ngInject */
        ${(templates[env.type] || templates.factory)(env).trim()}
        export default ${env.component};
    `);
};

/**
 * Create transformation for the app.js in order to inject the module
 * as a dependency
 * @param  {Object} env
 * @param  {Object} config
 * @return {Object}
 */
const updateApp = (env, config) => {
    const transformApp = registerModule(env);
    const { directory, fileName, full } = pathApp.fileDest(config, { isApp: true });
    return {
        transformations: [transformApp],
        source: full,
        dest: directory,
        fileName
    };
};

/**
 * Find files to build and generate a list of them
 * @param  {Object} env Component's configuration
 * @return {Array}
 */
const list = (env) => {
    const files = [];
    const isModule = env.type === 'module';
    const isDirective = env.type === 'directive';
    const isModal = env.type === 'modal';

    // Always update the module
    if (!isModule) {
        if (env.type === 'modal') {
            env.component += 'Modal';
        }

        const { exist, config } = findModule(env);
        const { directory, fileName, full } = pathApp.fileDest(config);
        const templateFile = pathApp.loadSrcTemplate(config.type);
        const transformInject = moduleLink(env);

        files.push({
            transformations: [transformInject],
            source: full, // Do not override previous module
            dest: directory,
            fileName,
            exist
        });

        // New module let's update the app
        !exist && files.push(updateApp(env, config));
    }

    // Create a module ? Let's update the app
    if (isModule) {
        const { config } = findModule(env);
        files.push(updateApp(env, config));
    }

    const pushFile = (env, opt) => {
        const { directory: dest, fileName, full } = pathApp.fileDest(env, opt);
        return {
            full,
            dest,
            fileName,
            source: MAIN_SRC_TPL,
            transformations: [identity],
            body: getTemplate(env, opt)
        };
    };

    // New file to build
    files.push(pushFile(env, pathApp.fileDest(env)));

    // For a directive we can have several options
    if (isDirective || isModal) {
        env.options.hasView && files.push(pushFile(env, { isView: true }));

        // If we attach a css we nee to create the file and update app.scss
        if (env.options.hasCSS) {
            files.push(pushFile(env, { isCSS: true }));

            const { exist, config } = findModule(env, 'stylesheet');
            const { directory, fileName, full } = pathApp.fileDest(config);
            const templateFile = pathApp.loadSrcTemplate(config.type);
            const transformSass = registerSass(env);

            files.push({
                transformations: [transformSass],
                source: full, // Do not override previous module
                dest: directory,
                fileName
            });
        }
    }

    return files;
};

module.exports = { list };
