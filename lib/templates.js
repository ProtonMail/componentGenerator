const factory = ({ component }) => {
    return `
    function ${component}() {
        const init = () => ({});
        return { init };
    }
  `;
};

const filter = ({ component }) => {
    return `
    function ${component}() {
        return (input = '') => input;
    }
  `;
};

const directive = ({ component, module, options = {} }) => {
    const restrict = options.hasView ? 'E' : 'A';

    let template = `
    function ${component}() {
        return {
            scope: {},
            replace: true,
            restrict: '${restrict}',
  `;

    if (options.hasView) {
        template += `templateUrl: require('../../../templates/${module}/${component}.tpl.html'),`;
    }

    template += `
            link(scope, el, attr) {
                console.log('${component} is running');

                scope.$on('$destroy', () => { });
            }
        };
    }
  `;
    return template;
};

const appModule = ({ module, component }) => {
    return `
    angular.module('proton.${module || component}', []);

    export default angular.module('proton.${module || component}').name;
  `;
};

const view = ({ component }) => {
    return `<div class="${component}-container"></div>`;
};

const css = ({ component }) => {
    return `.${component}-container, .${component}-container * { box-sizing: border-box }`;
};

module.exports = { factory, filter, directive, module: appModule, view, css };
