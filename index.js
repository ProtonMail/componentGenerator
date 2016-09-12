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

inquirer
  .prompt(QUESTIONS.main)
  .then((answers) => {
    return inquirer
      .prompt(QUESTIONS.component)
      .then((data) => (answers.component = data, answers))
      .then((answers) => {

        if (answers.component.type === 'module') {
          return answers;
        }

        return inquirer
          .prompt(QUESTIONS.bindModule)
          .then(({module}) => {
            answers.component.module = module;

            if ('directive' === answers.component.type) {
              return inquirer
                .prompt(QUESTIONS.directives)
                .then(data => (answers.component.options = data, answers));
            }
            return answers;
          });
      });
  })
  .then(componentConfig)
  .then(component.create)
  .catch(log.error);
