const helper = ({ name, module, src }) => {
    const title = module ? `Helper [${module}] ${name}` : `Helper ${name}`;
    const back = '../'.repeat(module ? 4 : 3);

    return `
    import ${name} from '${back}src/${src}/${name}';

    describe('${title}', () => {
        it('should return true', () => {
            expect(true).toBe(true);
        });
    });`;
};

const factory = ({ component, name, module, src }) => {
    return `
    import ${name} from '../../../../src/app/${src}/${name}';

    const mockService = {
      test: () => ({})
    };

    describe('[${module}/${component}] ~ ${name}', () => {

        let service;

        beforeEach(() => {
            spyOn(mockService, 'test').and.callThrough();
            service = factory(mockService);
        });
    });`;
};

const directive = ({ component, name, module, src }) => {
    return `
    import _ from 'lodash';
    import service from '../../../../src/app/${src}/${name}';

    import dispatchersService from '../../../../src/app/commons/services/dispatchers';
    import { generateModuleName } from '../../../utils/helpers';

    describe('[${module}/${component}] ~ ${name}', () => {

        const MODULE = generateModuleName();

        let dom, compile, scope, rootScope;
        let iscope, $, $$;


        angular.module(MODULE, ['templates-app'])
            .factory('gettextCatalog', () => gettextCatalog)
            .factory('dispatchers', dispatchersService)
            .directive('${name}', service);

        beforeEach(angular.mock.module(MODULE));

        beforeEach(angular.mock.inject(($injector) => {
            rootScope = $injector.get('$rootScope');
            compile = $injector.get('$compile');
            scope = rootScope.$new();
        }));

        describe('Compilation process', () => {

            beforeEach(() => {
                scope.message = 'message';
                spyOn(rootScope, '$on').and.callThrough();
                spyOn(gettextCatalog, 'getString').and.callThrough();
                dom = compile('<div><div>')(scope);
                scope.$digest();
                iscope = dom.isolateScope();
            });

            it('should replace da nodeName', () => {
                expect(dom[0].nodeName).toBe('DIV');
            });

            it('should create an isolate Scope', () => {
                expect(dom.isolateScope()).toBeDefined();
            });

        });

    });
;`;
};

module.exports = {
    directive,
    factory,
    helper
};
