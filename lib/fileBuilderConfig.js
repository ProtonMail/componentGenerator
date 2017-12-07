const xtend = require('xtend');
const prettier = require('prettier');
const pathApp = require('./pathApp');
const moduleLink = require('./transformations/moduleLink');
const bindKeyTemplate = require('./transformations/bindKeysTemplate');
const { isFileCreated } = require('./tools');
const templates = require('./templates');

/**
 * Check if a module exists and return its configuration
 * @param  {Object} env
 * @return {Object}     {exist: Boolean, config: Object}
 */
const findModule = (env) => {
    const configModule = xtend({}, env, { type: 'module' });
    return {
        exist: isFileCreated(configModule),
        config: configModule
    };
};

const prettify = (input) => {
    return prettier.format(input, {
        printWidth: 150,
        tabWidth: 4,
        singleQuote: true,
        proseWrap: 'never',
        arrowParens: 'always'
    });
};

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
        ${templates[env.type || 'factory'](env).trim()}
        export default ${env.component};
    `);
};

/**i
 * Find files to build and generate a list of them
 * @param  {Object} env Component's configuration
 * @return {Array}
 */
const list = (env) => {
    const files = [];
    const isModule = env.type === 'module';
    const isDirective = env.type === 'directive';
    console.log(JSON.stringify(env, null, 2));
    console.log({ isModule });
    console.log();

    // Always update the module
    if (!isModule) {
        const { exist, config } = findModule(env);
        const { directory, fileName, full } = pathApp.fileDest(config);
        const templateFile = pathApp.loadSrcTemplate(config.type);
        const transformInject = moduleLink(env);

        files.push({
            transformations: [transformInject],
            source: full, // Do not override previous module
            dest: directory,
            fileName
        });
    }

    const pushFile = (env, opt) => {
        const { directory: dest, fileName, full } = pathApp.fileDest(env, opt);
        return {
            full,
            dest,
            fileName,
            body: getTemplate(env, opt)
        };
    };

    // New file to build
    files.push(pushFile(env, pathApp.fileDest(env)));

    if (isDirective) {
        env.options.hasView && files.push(pushFile(env, { isView: true }));
        env.options.hasCSS && files.push(pushFile(env, { isCSS: true }));
    }

    console.log(JSON.stringify(files, null, 2));
    console.log();
    return files;
};

module.exports = { list };
