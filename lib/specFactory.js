const path = require('path');

const gulp = require('gulp');
const tap = require('gulp-tap');

const prettify = require('./prettify');
const templates = require('../templates/specs');
const getOutput = (...arg) => path.join('test', 'specs', ...arg);

const helpers = ({ name, isFromModule, dir }) => {
    const module = isFromModule ? dir : undefined;
    const src = isFromModule ? path.join('app', module, 'helpers') : 'helpers';
    const template = templates.helper({ name, module, src });

    const output = getOutput(src.replace('app/', ''), `${name}.js`);
    return {
        type: 'helpers',
        template: prettify(template.trim()),
        output,
        module
    };
};

const component = ({ name, module, component }) => {
    const src = path.join(module, component);
    const template = templates.factory({ name, module, src, component });

    const output = getOutput(src, `${name}.js`);
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

function factory(file, { type }) {
    const config = ACTIONS[type](file);
    const TEST_SRC = 'test/specs/';

    gulp.src(`${TEST_SRC}/index.js`)
        .pipe(
            tap((file) => {
                const [main] = file.path.split(TEST_SRC);
                file.path = path.join(main, config.output);
                file.contents = Buffer.from(config.template);
                return file;
            })
        )
        .pipe(gulp.dest(TEST_SRC));
}

module.exports = factory;
