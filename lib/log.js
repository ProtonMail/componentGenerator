const colors = require('colors/safe');

const title = (msg) => console.log('~', chalk.bgYellow(chalk.black(msg)), '~');
const success = (msg, { time }) => {
    const txt = chalk.green(` ${chalk.bold('✓')} ${msg} `);
    const message = [txt, time && `(${time})`].filter(Boolean).join('');
    console.log();
    console.log(message);
};

const error = (msg, data) => {
    console.log(colors.red(`⨯ ${msg}`));
    console.log();
    data && console.log(data);
    if (msg instanceof Error) {
        console.log(colors.red(msg.stack));
    }
    process.exit(1);
};

module.exports = { success, error, title };
