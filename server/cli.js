#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const strapi = require('@strapi/strapi'); // eslint-disable-line

const packageJSON = require('../package.json');

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
    const app = await strapi().load();

    try {
      app.plugin('sitemap').service('core').createSitemap();
      console.log(`${chalk.green.bold('[success]')} Successfully generated the sitemap XML.`);
    } catch (err) {
      console.log(`${chalk.red.bold('[error]')} Something went wrong when generating the sitemap XML. ${err}`);
    }

    process.exit(0);
  });

program.parseAsync(process.argv);
