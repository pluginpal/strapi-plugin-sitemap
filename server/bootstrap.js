'use strict';

const { logMessage, getService } = require('./utils');

module.exports = async () => {
  const sitemap = strapi.plugin('sitemap');
  const cron = strapi.config.get('plugin.sitemap.cron');

  try {
    // Give the public role permissions to access the public API endpoints.
    if (strapi.plugin('users-permissions')) {
      const roles = await strapi
        .service('plugin::users-permissions.role')
        .find();

      const publicId = roles.filter((role) => role.type === 'public')[0]?.id;

      if (publicId) {
        const _public = await strapi
          .service('plugin::users-permissions.role')
          .findOne(publicId);

        _public.permissions['plugin::sitemap'] = {
          controllers: {
            core: {
              getSitemap: { enabled: true },
              getSitemapXsl: { enabled: true },
              getSitemapXslCss: { enabled: true },
              getSitemapXslJs: { enabled: true },
              getSitemapXslSortable: { enabled: true },
            },
            settings: {
              getSettings: { enabled: true }
            }
          },
        };

        await strapi
          .service('plugin::users-permissions.role')
          .updateRole(_public.id, _public);
      }
    }

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
    ];
    await strapi.admin.services.permission.actionProvider.registerMany(actions);

    // Schedule cron to generate the sitemap
    if (cron) {
      strapi.cron.add({
        generateSitemap: {
          task: async ({ strapi }) => {
            await getService('core').createSitemap();
          },
          options: {
            rule: cron,
          },
        },
      });
    }
  } catch (error) {
    strapi.log.error(logMessage(`Bootstrap failed with error "${error.message}".`));
  }
};
