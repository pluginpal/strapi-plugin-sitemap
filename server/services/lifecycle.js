'use strict';

const { getService, logMessage } = require('../utils');

/**
 * Gets lifecycle service
 *
 * @returns {object} - Lifecycle service
 */
module.exports = () => ({
  async loadLifecycleMethods() {
    const settings = await getService('settings').getConfig();
    const sitemapService = await getService('core');

    // Loop over configured contentTypes from store.
    if (settings.contentTypes && strapi.config.get('plugin.sitemap.autoGenerate')) {
      Object.keys(settings.contentTypes).map(async (contentType) => {
        if (strapi.contentTypes[contentType]) {
          await strapi.db.lifecycles.subscribe({
            models: [contentType],

            async afterCreate(event) {
              await sitemapService.createSitemap();
            },

            async afterCreateMany(event) {
              await sitemapService.createSitemap();
            },

            async afterUpdate(event) {
              await sitemapService.createSitemap();
            },

            async afterUpdateMany(event) {
              await sitemapService.createSitemap();
            },

            async afterDelete(event) {
              await sitemapService.createSitemap();
            },

            async afterDeleteMany(event) {
              await sitemapService.createSitemap();
            },
          });
        } else {
          strapi.log.error(logMessage(`Bootstrap failed. Could not load lifecycles on model '${contentType}'`));
        }
      });
    }
  },
});
