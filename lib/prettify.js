const prettier = require('prettier');

const prettify = (input) => {
    return prettier.format(input, {
        printWidth: 150,
        tabWidth: 4,
        singleQuote: true,
        proseWrap: 'never',
        arrowParens: 'always'
    });
};

module.exports = prettify;
