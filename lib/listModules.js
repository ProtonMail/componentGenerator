const fs = require('fs');
const path = require('path');

const listModules = () => {
  console.log(path.relative('.', './src'))
    return fs.readdirSync(path.relative('.', './src/app'))
        .filter((file) => fs.statSync(`./src/app/${file}`).isDirectory());
};

module.exports = listModules;
