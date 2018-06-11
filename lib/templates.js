const dedent = require('dedent');

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

const modal = ({ component, module }) => {
    return `
    function ${component}(pmModal) {
        return pmModal({
            controllerAs: 'ctrl',
            templateUrl: require('../../../templates/${module}/${component}.tpl.html'),
            /* @ngInject */
            controller: function(params) {
                console.log('params', params);
                this.$onDestroy = () => {
                    console.log('Destroy -/');
                };
            }
        });
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

const view = ({ component, type }) => {
    if (type === 'modal') {
        return dedent`
            <div class="pm_modal {{ctrl.class}} ${component}-container" role="dialog" style="display: block;">
                <div class="modal-dialog">
                    <button type="button" ng-click="ctrl.cancel()" aria-hidden="true" title-translate="Close" title-translate-context="Action" class="fa fa-times close"></button>
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title">Modal: ${component}</h4>
                        </div>
                        <div class="modal-body">

                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores sint illo nam eaque harum optio ipsum, impedit commodi dolorem, laborum quis tenetur ratione mollitia corporis libero, assumenda eum cum deleniti.

                        </div>
                    </div>
                    <div class="modal-footer text-right">
                        <button
                            class="pm_button pull-left"
                            ng-click="ctrl.cancel()"
                            ng-disabled="ctrl.networkActivity"
                            translate-context="Action"
                            translate>Cancel</button>

                        <button
                            class="pm_button primary"
                            tabindex="1"
                            ng-click="ctrl.submit()"
                            ng-disabled="ctrl.networkActivity"
                            translate-context="Action"
                            translate>Save</button>
                    </div>
                </div>
                <div class="modal-overlay"></div>
            </div>

        `;
    }

    return `<div class="${component}-container"></div>`;
};

const css = ({ component }) => {
    return `.${component}-container, .${component}-container * { box-sizing: border-box }`;
};

module.exports = { factory, filter, directive, module: appModule, view, css, modal };
