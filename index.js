#!/usr/bin/env node
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';

import ora from 'ora';
import { Octokit } from '@octokit/rest';


const octokit = new Octokit();

const OWNER = 'mdhira-ai';
const REPO = 'dcomponents';
const COMPONENTS_PATH = 'src'; // Path in the repo where components are stored

async function getComponents() {
    const spinner = ora('Fetching components list').start();
    try {
        const { data } = await octokit.repos.getContent({
            owner: OWNER,
            repo: REPO,
            path: COMPONENTS_PATH,
        });
        spinner.succeed('Components list fetched');
        return data.filter(file => file.type === 'file' && file.name.endsWith('.tsx'))
            .map(file => file.name.replace('.tsx', ''));
    } catch (error) {
        spinner.fail('Failed to fetch components list');
        console.error('Error:', error.message);
        return [];
    }
}

async function fetchComponent(component) {
    const spinner = ora(`Fetching ${component}`).start();
    try {
        const { data } = await octokit.repos.getContent({
            owner: OWNER,
            repo: REPO,
            path: `${COMPONENTS_PATH}/${component}.tsx`,
        });
        spinner.succeed(`${component} fetched successfully`);
        return Buffer.from(data.content, 'base64').toString('utf-8');
    } catch (error) {
        spinner.fail(`Failed to fetch ${component}`);
        console.error('Error:', error.message);
        return null;
    }
}

async function main() {

    const components = await getComponents();

    if (components.length === 0) {
        console.log('No components available. Please check your GitHub repository.');
        return;
    }

    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What do you want to do?',
            choices: ['add', 'list']
        },
        {
            type: 'list',
            name: 'component',
            message: 'Which component?',
            choices: components,
            when: (answers) => answers.action === 'add'
        }
    ]);

    switch (answers.action) {
        case 'add':
            await addComponent(answers.component);
            break;
        case 'list':
            listComponents(components);
            break;
    }
}

async function addComponent(component) {
    const componentContent = await fetchComponent(component);
    if (componentContent) {
        const componentsDir = path.join(process.cwd(), 'components');

        // Check if the components directory exists, create it if it doesn't
        if (!fs.existsSync(componentsDir)) {
            fs.mkdirSync(componentsDir, { recursive: true });
            console.log('Created components directory.');
        }

        // Write the component file to the components directory
        const componentPath = path.join(componentsDir, `${component}.tsx`);
        fs.writeFileSync(componentPath, componentContent);

        console.log(`${component} has been added successfully to the components folder!`);
    }
}

function listComponents(components) {
    console.log('Available components:');
    components.forEach(component => console.log(`- ${component}`));
}

main().catch(console.error);