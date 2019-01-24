const sources = require('../lib/readSrc');
const modules = sources.getModules();
const files = sources.getFiles();

const questions = [
    // {
    //   name: 'type',
    //   message: 'What would you want to create ?',
    //   type: 'list',
    //   choices: [
    //     {name: 'A component', value: 'component'},
    //     {name: 'An E2E test', value: 'e2e'},
    //   ]
    // },
    {
        name: 'name',
        type: 'text',
        message: 'Name of the component ?',
        validate(input) {
            if (input) {
                if (/^\d|\s|[^\w]|_/.test(input)) {
                    return [
                        'The component must start with [a-z] and only contains digit/letters',
                        'ex:',
                        '\t - accountModel',
                        '\t - monitoring',
                    ].join('\n');
                }

                return true;
            }

            return 'You must specify a name';
        }
    }
];

const questionsComponent = [
    {
        name: 'type',
        message: 'Type of component',
        type: 'select',
        choices: [
            { title: 'A directive', value: 'directive' },
            { title: 'A factory', value: 'factory' },
            { title: 'A service', value: 'service' },
            { title: 'A modal', value: 'modal' },
            { title: 'A module', value: 'module' },
            { title: 'A controller', value: 'controller' },
            { title: 'A filter', value: 'filter' }
        ]
    }
];

const filterAutocomplete = (name = '', input = '') => {
    return name.toLowerCase().includes(input.toLowerCase());
};

const formatModuleChoice = (create = false) => (name) => ({ title: name, name, create });

const suggest = async (input, list) => {
    const col = modules.filter((name) => filterAutocomplete(name, input));
    const items = col.length ? col.map(formatModuleChoice()) : [input].map(formatModuleChoice(true));
    return items;
};

const bindModuleQuestions = [
    {
        name: 'module',
        message: 'From module :',
        type: 'autocomplete',
        choices: modules.map((title) => ({ title })),
        suggest
    }
];

const specs = [
    {
        name: 'spec.type',
        message: 'Type of component',
        type: 'choice',
        default: 'component',
        choices: [{ title: 'A component', value: 'app' }, { title: 'A helper', value: 'helpers' }]
    },
    {
        name: 'spec.file',
        message: 'From component :',
        type: 'autocomplete',
        async source(config, input) {
            const col = files[config.spec.type].filter(({ name }) => filterAutocomplete(name, input));
            return col;
        }
    }
];

const questionsDirectives = [
    {
        name: 'hasView',
        message: 'Bind a view (default:true) ?',
        initial: true,
        type: 'confirm'
    },
    {
        name: 'hasCSS',
        message: 'Create a CSS (default: true)',
        initial: true,
        type: 'confirm'
    }
];

const questionsModules = [
    {
        name: 'isLazy',
        message: 'Do you want to lazy load it (default:false) ?',
        initial: false,
        type: 'confirm'
    }
];

module.exports = {
    main: questions,
    component: questionsComponent,
    bindModule: bindModuleQuestions,
    directives: questionsDirectives,
    module: questionsModules,
    specs
};
