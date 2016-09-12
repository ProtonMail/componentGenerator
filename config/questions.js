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
      {name: 'A module', value: 'module'},
      {name: 'A directive', value: 'directive'},
      {name: 'A factory', value: 'factory'},
      {name: 'A service', value: 'service'},
      {name: 'A controller', value: 'controller'},
      {name: 'A filter', value: 'filter'},
    ]
  }
];

const bindModuleQuestions = [{
    name: 'module',
    message: 'From module :'
}]

const questionsDirectives = [
  {
    name: 'hasCtrl',
    message: 'Bind a controller (default:false) ?',
    default: false,
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