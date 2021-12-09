'use strict';

const { getService, logMessage } = require('../utils');

/**
 * Gets lifecycle service
 *
 * @returns {object} - Lifecycle service
 */

const subscribeLifecycleMethods = async (modelName) => {
  const sitemapService = await getService('core');

  if (strapi.contentTypes[modelName]) {
    await strapi.db.lifecycles.subscribe({
      models: [modelName],

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
    strapi.log.error(logMessage(`Could not load lifecycles on model '${modelName}'`));
  }
};

module.exports = () => ({
  async loadAllLifecycleMethods() {
    const settings = await getService('settings').getConfig();

    // Loop over configured contentTypes from store.
    if (settings.contentTypes && strapi.config.get('plugin.sitemap.autoGenerate')) {
      Object.keys(settings.contentTypes).map(async (contentType) => {
        await subscribeLifecycleMethods(contentType);
      });
    }
  },

  async loadLifecycleMethod(modelName) {
    if (strapi.config.get('plugin.sitemap.autoGenerate')) {
      await subscribeLifecycleMethods(modelName);
    }
  },
});
