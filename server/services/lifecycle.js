'use strict';

const { getService, logMessage } = require('../utils');

/**
 * Gets lifecycle service
 *
 * @returns {object} - Lifecycle service
 */

const subscribeLifecycleMethods = async (modelName) => {
  const cachingEnabled = strapi.config.get('plugin.sitemap.caching');
  const sitemapService = await getService('core');

  if (strapi.contentTypes[modelName]) {
    await strapi.db.lifecycles.subscribe({
      models: [modelName],

      async afterCreate(event) {
        if (!cachingEnabled) {
          await sitemapService.createSitemap();
          return;
        }
        const cache = await getService('query').getSitemapCache('default');
        const { id } = event.result;
        const ids = await getService('query').getLocalizationIds(modelName, id);
        ids.push(id);

        if (cache) {
          await sitemapService.createSitemap(cache.sitemap_json, modelName, ids);
        } else {
          await sitemapService.createSitemap();
        }
      },

      async afterCreateMany(event) {
        if (!cachingEnabled) {
          await sitemapService.createSitemap();
          return;
        }
        const cache = await getService('query').getSitemapCache('default');

        if (cache) {
          await sitemapService.createSitemap(cache.sitemap_json, modelName);
        } else {
          await sitemapService.createSitemap();
        }
      },

      async afterUpdate(event) {
        if (!cachingEnabled) {
          await sitemapService.createSitemap();
          return;
        }
        const cache = await getService('query').getSitemapCache('default');
        const { id } = event.result;
        const ids = await getService('query').getLocalizationIds(modelName, id);
        ids.push(id);
        console.log(ids);

        if (cache) {
          await sitemapService.createSitemap(cache.sitemap_json, modelName, ids);
        } else {
          await sitemapService.createSitemap();
        }
      },

      async afterUpdateMany(event) {
        if (!cachingEnabled) {
          await sitemapService.createSitemap();
          return;
        }
        const cache = await getService('query').getSitemapCache('default');

        if (cache) {
          await sitemapService.createSitemap(cache.sitemap_json, modelName);
        } else {
          await sitemapService.createSitemap();
        }
      },

      async beforeDelete(event) {
        if (!cachingEnabled) return;

        const { id } = event.params.where;
        const ids = await getService('query').getLocalizationIds(modelName, id);
        ids.push(id);
        event.state.idsToInvalidate = ids;
      },

      async afterDelete(event) {
        if (!cachingEnabled) {
          await sitemapService.createSitemap();
          return;
        }
        const cache = await getService('query').getSitemapCache('default');
        const { idsToInvalidate } = event.state;

        if (cache) {
          await sitemapService.createSitemap(cache.sitemap_json, modelName, idsToInvalidate);
        } else {
          await sitemapService.createSitemap();
        }
      },

      async afterDeleteMany(event) {
        if (!cachingEnabled) {
          await sitemapService.createSitemap();
          return;
        }
        const cache = await getService('query').getSitemapCache('default');

        if (cache) {
          await sitemapService.createSitemap(cache.sitemap_json, modelName);
        } else {
          await sitemapService.createSitemap();
        }
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
