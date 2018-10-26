const path = require('path');

const fileBuilder = require('./fileBuilder');
const prettify = require('./prettify');
const templates = require('../templates/specs');
const log = require('./log');

const MAP_TPL_COMPONENT = {
    directives: 'directive'
};

/**
 * Create filePath for a component
 * @param  {arguments} arg
 * @return {String}
 */
const getOutput = (...arg) => path.join('test', 'specs', ...arg);
const getKeyComponentTpl = (component) => MAP_TPL_COMPONENT[component] || 'factory';

/**
 * Create the template for a helper
 * @param  {String} options.name         Component's name
 * @param  {Boolean} options.isFromModule Detect if the helper is from an Angular's module
 * @param  {String} options.dir          module if isFromModule
 * @return {Object}
 */
const helpers = ({ name, isFromModule, dir }) => {
    const module = isFromModule ? dir : undefined;
    const src = isFromModule ? path.join('app', module, 'helpers') : 'helpers';
    const template = templates.helper({ name, module, src });

    const output = getOutput(src.replace('app/', ''), `${name}.spec.js`);
    return {
        type: 'helpers',
        template: prettify(template.trim()),
        output,
        module
    };
};

/**
 * Create the template for a component
 * @param  {String} options.name      Component's name
 * @param  {String} options.module    Module's name
 * @param  {String} options.component Type of component
 * @return {Object}
 */
const component = ({ name, module, component }) => {
    const src = path.join(module, component);
    const keyTpl = getKeyComponentTpl(component);
    const template = templates[keyTpl]({ name, module, src, component });

    const output = getOutput(src, `${name}.spec.js`);
    return {
        type: 'app',
        template: prettify(template.trim()),
        output,
        module
    };
};

const ACTIONS = {
    app: component,
    helpers
};

async function factory(file, { type }) {
    const config = ACTIONS[type](file);
    const TEST_SRC = 'test/specs/';

    // Write the spec
    await fileBuilder({
        output: config.output,
        tap: () => Buffer.from(config.template)
    });
    log.success(`Spec created for the component → ${config.output}`);

    const tap = (body) => {
        const importFile = config.output.replace(TEST_SRC, './').replace(/\.js$/, '');

        const output = [body.toString().trim(), `import '${importFile}';`].join('\n');
        return Buffer.from(output);
    };

    // Update import
    await fileBuilder({
        input: `${TEST_SRC}/index.js`,
        output: `${TEST_SRC}/index.js`,
        tap
    });
    log.success(`Update main spec module`);
}

module.exports = factory;
