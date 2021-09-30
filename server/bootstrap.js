'use strict';

const fs = require('fs');
const copyDir = require('./utils/copyDir');

module.exports = async () => {
  // Copy the plugins /public folder to the /public/sitemap/ folder in the root of your project.
  if (!fs.existsSync('public/sitemap/')) {
    if (fs.existsSync('./src/extensions/sitemap/public/')) {
      await copyDir('./src/extensions/sitemap/public/', 'public/sitemap/');
    } else if (fs.existsSync('./src/plugins/sitemap/public/')) {
      await copyDir('./src/plugins/sitemap/public/', 'public/sitemap/');
    } else if (fs.existsSync('./node_modules/strapi-plugin-sitemap/public/')) {
      await copyDir('./node_modules/strapi-plugin-sitemap/public/', 'public/sitemap/');
    }
  }
};
