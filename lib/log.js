const colors = require('colors/safe');

const success = (msg) => console.log(colors.green(`✓ ${msg}`));
const error = (msg, data) => {
    console.log(colors.red(`⨯ ${msg}`));
    console.log()
    data && console.log(data);
    if (msg instanceof Error) {
        console.log(colors.red(msg.stack));
    }
    process.exit(1);
};

module.exports = { success, error };
