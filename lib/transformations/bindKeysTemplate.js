/**
 * Default transformation for a file it replaces keys inside the
 * template based on the env of the component.
 * @param  {String}   options.module module's name
 * @param  {String}   options.component component's name
 * @return {String}    Body updated
 */
function bindKeyTemplate({ module = '', component = '' } = {}) {
    return (input = '') => {
        return input.replace(/{{module}}/g, module || component).replace(/{{component}}/g, component);
    };
}

module.exports = bindKeyTemplate;
