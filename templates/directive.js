/* @ngInject */
function {{component}}() {

    return {
        replace: true,
        scope: {},
        templateUrl: 'xxx',
        link(scope, el, attr) {
            console.log('{{component}} is running');

            scope.$on('$destroy', () => {
            });
        }
    }
}

export default {{component}};