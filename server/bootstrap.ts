import { StrapiContext } from 'strapi-typed';

import { SitemapConfig } from '../types/config';
import { logMessage, getService } from './utils';

export default async ({ strapi }: StrapiContext) => {
  const sitemap = strapi.plugin('sitemap');
  const { cron } = strapi.config.get('plugin.sitemap') as SitemapConfig;

  try {
    // Give the public role permissions to access the public API endpoints.
    if (strapi.plugin('users-permissions')) {
      const roles = await strapi
        .service('plugin::users-permissions.role')
        .find();

      const publicId = roles.filter((role) => role.type === 'public')[0]?.id as number;

      if (publicId) {
        const publicRole = await strapi
          .service('plugin::users-permissions.role')
          .findOne(publicId);

        publicRole.permissions['plugin::sitemap'] = {
          controllers: {
            core: {
              getSitemap: { enabled: true },
              getSitemapXsl: { enabled: true },
              getSitemapXslCss: { enabled: true },
              getSitemapXslJs: { enabled: true },
              getSitemapXslSortable: { enabled: true },
            },
          },
        };

        await strapi
          .service('plugin::users-permissions.role')
          .updateRole(publicRole.id, publicRole);
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
          task: async () => {
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
