#!/usr/bin/env node

const path = require('path');
const xtend = require('xtend');
const gutil = require('gulp-util');

const inquirer = require('inquirer');
const QUESTIONS = require('./config/questions');
const component = require('./lib/factory');
const log = require('./lib/log');

const componentConfig = ({ name, component }) => {
    return xtend({ component: name }, component);
};

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

(async () => {

  try {
    const answers = await inquirer.prompt(QUESTIONS.main);

    if (/^\d/.test(answers.name)) {
      throw new Error('The component must start with [a-z]');
    }

    const data = await inquirer.prompt(QUESTIONS.component);
    answers.component = data;

    if (answers.component.type !== 'module') {
      const { module } = await inquirer.prompt(QUESTIONS.bindModule);
      answers.component.module = module;

      if ('directive' === answers.component.type) {
        const data = await inquirer.prompt(QUESTIONS.directives);
        answers.component.options = data;
      }
    }

    component.create(componentConfig(answers));
  } catch (e) {
    log.error(e);
  }

})();