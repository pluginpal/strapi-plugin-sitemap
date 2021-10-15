'use strict';

const fs = require('fs');
const { logMessage } = require('./utils');
const copyPublicFolder = require('./utils/copyPublicFolder');

module.exports = async () => {
  const sitemap = strapi.plugin('sitemap');

  try {
    // Load lifecycle methods for auto generation of sitemap.
    await sitemap.service('lifecycle').loadAllLifecycleMethods();

    // Copy the plugins /public folder to the /public/sitemap/ folder in the root of your project.
    if (!fs.existsSync('public/sitemap/')) {
      if (fs.existsSync('./src/extensions/sitemap/public/')) {
        await copyPublicFolder('./src/extensions/sitemap/public/', 'public/sitemap/');
      } else if (fs.existsSync('./src/plugins/sitemap/public/')) {
        await copyPublicFolder('./src/plugins/sitemap/public/', 'public/sitemap/');
      } else if (fs.existsSync('./node_modules/strapi-plugin-sitemap/public/')) {
        await copyPublicFolder('./node_modules/strapi-plugin-sitemap/public/', 'public/sitemap/');
      }
    }
  } catch (error) {
    strapi.log.error(logMessage(`Bootstrap failed with error "${error.message}".`));
  }
};
