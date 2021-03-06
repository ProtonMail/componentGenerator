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
                console.log('${component} params:', params);

                /************************************************
                *                                               *
                *  By default cancel() and close()              *
                *  already exist. No need to set them again     *
                *  Idem no need to set them inside params if    *
                *  it is only to bind deactivate (ღ˘⌣˘ღ)       *
                *  Don't forget you can toggle the modal via    *
                *  params.hide/show                             *
                *                                               *
                *************************************************/

                this.submit = () => {
                    console.log('Submit ( ^-^)_旦', this);
                };

                this.$onDestroy = () => {
                    console.log('Destroy 且_(・_・ )');
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
            <div class="pm_modal {{ctrl.class}} ${component}-container" role="dialog">
                <div class="modal-dialog">
                    <button
                        type="button"
                        ng-click="ctrl.cancel()"
                        aria-hidden="true"
                        title-translate="Close"
                        title-translate-context="Action"
                        class="fa fa-times close"></button>

                    <div class="modal-content">
                        <header class="modal-header">
                            <h4 class="modal-title">Modal: ${component}</h4>
                        </header>

                        <div class="modal-body">

                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores sint illo nam eaque harum optio ipsum, impedit commodi dolorem, laborum quis tenetur ratione mollitia corporis libero, assumenda eum cum deleniti.

                        </div>
                    </div>

                    <footer class="modal-footer text-right">
                        <button
                            class="pm_button pull-left"
                            ng-click="ctrl.cancel()"
                            ng-disabled="ctrl.networkActivity"
                            translate-context="Action"
                            translate>Cancel</button>

                        <button
                            class="pm_button primary"
                            ng-click="ctrl.submit()"
                            ng-disabled="ctrl.networkActivity"
                            translate-context="Action"
                            translate>Save</button>
                    </footer>
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
