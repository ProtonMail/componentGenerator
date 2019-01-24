#!/usr/bin/env node

const path = require('path');

const prompts = require('prompts');
const QUESTIONS = require('./config/questions');
const component = require('./lib/factory');
const log = require('./lib/log');

const componentConfig = ({ name, component, isLazy }) => {
    return { component: name, isLazy, ...component };
};

const getName = async () => {
    if (process.argv[2]) {
        return { name: process.argv[2].trim() };
    }
    return prompts(QUESTIONS.main);
};

const isTest = () => Array.from(process.argv).includes('--test');

(async () => {
    try {
        if (isTest()) {
            const data = await prompts(QUESTIONS.specs);

            const specFactory = require('./lib/specFactory');
            const files = require('./lib/readSrc').getFiles();
            const { spec } = data;
            const file = files[spec.type].find(({ name }) => name === spec.file);

            return specFactory(file, spec);
        }

        const answers = await getName();
        const data = await prompts(QUESTIONS.component);
        answers.component = data;

        if (answers.component.type !== 'module') {
            const { module } = await prompts(QUESTIONS.bindModule);
            answers.component.module = module;

            if (!module) {
                throw new Error('You must select a module');
            }

            if ('directive' === answers.component.type || 'modal' === answers.component.type) {
                const data = await prompts(QUESTIONS.directives);
                answers.component.options = data;
            }
        }

        if (answers.component.type === 'module') {
            const { isLazy } = await prompts(QUESTIONS.module);
            answers.isLazy = isLazy;
        }
        await component.create(componentConfig(answers));
    } catch (e) {
        log.error(e);
    }
})();
