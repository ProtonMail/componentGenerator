const modules = require('../lib/listModules')();

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
                if (/^\d/.test(input)) {
                    return 'The component must start with [a-z]';
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
            { name: 'A module', value: 'module' },
            { name: 'A controller', value: 'controller' },
            { name: 'A filter', value: 'filter' }
        ]
    }
];

const formatModuleChoice = (create = false) => (name) => ({ name, create });
const bindModuleQuestions = [
    {
        name: 'module',
        message: 'From module :',
        type: 'autocomplete',
        source: async (list, input) => {
            const col = modules.filter((name) => name.includes(input));
            const items = col.length ? col.map(formatModuleChoice()) : [input].map(formatModuleChoice(true));
            return items;
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

module.exports = {
    main: questions,
    component: questionsComponent,
    bindModule: bindModuleQuestions,
    directives: questionsDirectives
};
