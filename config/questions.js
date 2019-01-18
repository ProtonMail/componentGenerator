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
        type: 'list',
        choices: [
            { name: 'A directive', value: 'directive' },
            { name: 'A factory', value: 'factory' },
            { name: 'A service', value: 'service' },
            { name: 'A modal', value: 'modal' },
            { name: 'A module', value: 'module' },
            { name: 'A controller', value: 'controller' },
            { name: 'A filter', value: 'filter' }
        ]
    }
];

const filterAutocomplete = (name = '', input = '') => {
    return name.toLowerCase().includes(input.toLowerCase());
};

const formatModuleChoice = (create = false) => (name) => ({ name, create });
const bindModuleQuestions = [
    {
        name: 'module',
        message: 'From module :',
        type: 'autocomplete',
        source: async (list, input) => {
            const col = modules.filter((name) => filterAutocomplete(name, input));
            const items = col.length ? col.map(formatModuleChoice()) : [input].map(formatModuleChoice(true));
            return items;
        }
    }
];

const specs = [
    {
        name: 'spec.type',
        message: 'Type of component',
        type: 'list',
        default: 'component',
        choices: [{ name: 'A component', value: 'app' }, { name: 'A helper', value: 'helpers' }]
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
        default: true,
        type: 'confirm'
    },
    {
        name: 'hasCSS',
        message: 'Create a CSS (default: true)',
        default: true,
        type: 'confirm'
    }
];

const questionsModules = [
    {
        name: 'isLazy',
        message: 'Do you want to lazy load it (default:false) ?',
        default: false,
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
