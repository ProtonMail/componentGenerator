const chalk = require('chalk');

const success = (msg) => console.log(chalk.green(`✓ ${msg}`));
const error = (msg, data) => {
    console.log(chalk.red(`⨯ ${msg}`));
    console.log();
    data && console.log(data);
    if (msg instanceof Error) {
        console.log(chalk.red(msg.stack));
    }
    process.exit(1);
};

const json = (data) => {
    console.log(JSON.stringify(data, null, 2));
};

module.exports = { success, error, json };
