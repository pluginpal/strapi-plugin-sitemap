'use strict';

const { getService } = require('../utils');

/**
 * Gets lifecycle service
 *
 * @returns {object} - Lifecycle service
 */
module.exports = () => ({
  async loadLifecycleMethods() {
    const config = await getService('config').getConfig();
    const sitemapService = await getService('sitemap');

    // TODO: Remove test config
    const testConfig = {
      'api::page.page': {},
      'api::article.article': {},
    };

    // Loop over configured contentTypes from store.
    if (testConfig && config.autoGenerate) {
      Object.keys(testConfig).map(async (contentType) => {
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
          strapi.log.error(`Sitemap plugin bootstrap failed. Could not load lifecycles on model '${contentType}'`);
        }
      });
    }
  },
});
