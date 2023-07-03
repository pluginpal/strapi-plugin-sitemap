#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import strapi from '@strapi/strapi';
import tsUtils from '@strapi/typescript-utils';

import packageJSON from '../package.json';

const program = new Command();

// Initial program setup
program.storeOptionsAsProperties(false).allowUnknownOption(true);

program.helpOption('-h, --help', 'Display help for command');
program.addHelpCommand('help [command]', 'Display help for command');

// `$ sitemap version` (--version synonym)
program.version(packageJSON.version, '-v, --version', 'Output the version number');
program
  .command('version')
  .description('Output your version of the sitemap plugin')
  .action(() => {
    process.stdout.write(`${packageJSON.version}\n`);
    process.exit(0);
  });

// `$ sitemap generate`
program
  .command('generate')
  .description('Generate the sitemap XML')
  .action(async () => {
    const appDir = process.cwd();
    const isTSProject = await tsUtils.isUsingTypeScript(appDir);
    const outDir = await tsUtils.resolveOutDir(appDir);

    if (isTSProject) {
      await tsUtils.compile(appDir, {
        watch: false,
        configOptions: { options: { incremental: true } },
      });
    }

    const distDir = isTSProject ? outDir : appDir;

    const app = await strapi({ appDir, distDir }).load();

    try {
      app.plugin('sitemap').service('core').createSitemap();
      console.log(`${chalk.green.bold('[success]')} Successfully generated the sitemap XML.`);
    } catch (err) {
      console.log(`${chalk.red.bold('[error]')} Something went wrong when generating the sitemap XML. ${err}`);
    }

    process.exit(0);
  });

// eslint-disable-next-line @typescript-eslint/no-floating-promises
program.parseAsync(process.argv);
