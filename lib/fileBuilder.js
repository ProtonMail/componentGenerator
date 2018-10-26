const util = require('util');
const path = require('path');
const fs = require('fs-extra');

/**
 * Read input source.
 * If read fails, it means it's a new module
 * if you create a component with a new module
 * @param  {String} input
 * @return {Buffer}
 */
const read = (input) => {
    return util
        .promisify(fs.readFile)(input)
        .catch(() => Buffer.from(''));
};

const write = util.promisify(fs.writeFile);
const mkdirP = fs.ensureDir;

/**
 * Update a source from a file or an empty buffer and write
 * the transformed buffer to a destination.
 * -> same as what gulp does.
 * @param  {String} options.input  undefined if no source to read
 * @param  {String} options.output dest file
 * @param  {Function} options.tap    tap function, taking a buffer as arg
 * @return {Promise}
 */
async function main({ input, output, tap }) {
    const content = await (input ? read(input) : Buffer.from(''));
    const body = tap(content);
    await mkdirP(path.dirname(output));
    await write(output, body);
}

module.exports = main;
