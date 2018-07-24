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

module.exports = {
    factory,
    helper
};
