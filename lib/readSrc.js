const fs = require('fs');
const path = require('path');
const execa = require('execa');

const MAIN_PATH = 'src/app';
const HELPER_PATH = 'src/helpers';

const CACHE = {};

const listFiles = (type = 'app') => {
    const src = type === 'helpers' ? `{app/*/${type},${type}}` : type;
    const { stdout = '' } = execa.shellSync(`find src/${src} -type f -name '*.js'`, { shell: '/bin/bash' });
    return stdout.split('\n').filter(Boolean);
};

const getPath = (file, fileName) => {
    return file
        .replace(`${MAIN_PATH}/`, '')
        .replace(`/${fileName}.js`, '')
        .split(path.sep);
};

/**
 * List files by type and config
 * @return {Object} { app:Array,helpers:Array }
 */
const getFiles = () => {
    if (CACHE.files) {
        return CACHE.files;
    }

    const appList = listFiles();
    const helperList = listFiles('helpers');

    const helpers = helperList.map((file) => {
        const name = path.basename(file, '.js');
        const isFromModule = file.startsWith(MAIN_PATH);
        return {
            isFromModule,
            dir: isFromModule ? getPath(file, name)[0] : 'helpers',
            name
        };
    });

    const app = appList.reduce((acc, file) => {
        const name = path.basename(file, '.js');

        if (name === 'index') {
            return acc;
        }
        const [module, component] = getPath(file, name);
        acc.push({ module, component, name });
        return acc;
    }, []);

    CACHE.files = { helpers, app };

    return { helpers, app };
};

const getModules = () => {
    return fs
        .readdirSync(path.relative('.', `./${MAIN_PATH}`))
        .filter((file) => fs.statSync(`./${MAIN_PATH}/${file}`).isDirectory());
};

module.exports = {
    getFiles,
    getModules
};
