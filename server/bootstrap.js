'use strict';

const { logMessage } = require('./utils');

module.exports = async () => {
  const sitemap = strapi.plugin('sitemap');

  try {
    // Load lifecycle methods for auto generation of sitemap.
    await sitemap.service('lifecycle').loadAllLifecycleMethods();

    // Register permission actions.
    const actions = [
      {
        section: 'plugins',
        displayName: 'Access the plugin settings',
        uid: 'settings.read',
        pluginName: 'sitemap',
      },
      {
        section: 'plugins',
        displayName: 'Menu link to plugin settings',
        uid: 'menu-link',
        pluginName: 'sitemap',
      },
    ];
    await strapi.admin.services.permission.actionProvider.registerMany(actions);

  } catch (error) {
    strapi.log.error(logMessage(`Bootstrap failed with error "${error.message}".`));
  }
};
