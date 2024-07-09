#!/usr/bin/env node

const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');

const components = ['button', 'input', 'card', 'navbar'];

const prompt =inquirer.createPromptModule()

async function main() {
    const answers = await prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What do you want to do?',
            choices: ['add', 'remove', 'list']
        },
        {
            type: 'list',
            name: 'component',
            message: 'Which component?',
            choices: components,
            when: (answers) => answers.action !== 'list'
        }
    ]);

    switch (answers.action) {
        case 'add':
            addComponent(answers.component);
            break;
        case 'remove':
            removeComponent(answers.component);
            break;
        case 'list':
            listComponents();
            break;
    }
}

function addComponent(component) {
    console.log(`Adding ${component} to your project...`);

    const componentContent = `
// ${component}.js
export default function ${component}() {
  return <div>${component}</div>;
}
`;

    fs.writeFileSync(path.join(process.cwd(), `${component}.js`), componentContent);

    console.log(`${component} has been added successfully!`);
}

function removeComponent(component) {
    console.log(`Removing ${component} from your project...`);

    const filePath = path.join(process.cwd(), `${component}.js`);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`${component} has been removed successfully!`);
    } else {
        console.log(`${component} does not exist in your project.`);
    }
}

function listComponents() {
    console.log('Available components:');
    components.forEach(component => console.log(`- ${component}`));
}

main().catch(console.error);