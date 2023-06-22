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

        const config = await getService('settings').getConfig();
        const cache = await getService('query').getSitemapCache('default');
        const invalidationObject = await getService('query').composeInvalidationObject(config, modelName, event.result.id);

        if (cache) {
          await sitemapService.createSitemap(cache.sitemap_json, invalidationObject);
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

        const invalidationObject = {
          [modelName]: {},
        };

        if (cache) {
          await sitemapService.createSitemap(cache.sitemap_json, invalidationObject);
        } else {
          await sitemapService.createSitemap();
        }
      },

      async afterUpdate(event) {
        if (!cachingEnabled) {
          await sitemapService.createSitemap();
          return;
        }

        const config = await getService('settings').getConfig();
        const cache = await getService('query').getSitemapCache('default');
        const invalidationObject = await getService('query').composeInvalidationObject(config, modelName, event.result.id);

        if (cache) {
          await sitemapService.createSitemap(cache.sitemap_json, invalidationObject);
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
        console.log(event);

        const invalidationObject = {
          [modelName]: {},
        };

        if (cache) {
          await sitemapService.createSitemap(cache.sitemap_json, invalidationObject);
        } else {
          await sitemapService.createSitemap();
        }
      },

      async beforeDelete(event) {
        if (!cachingEnabled) return;
        const { id } = event.params.where;
        event.state.id = id;
      },

      async afterDelete(event) {
        if (!cachingEnabled) {
          await sitemapService.createSitemap();
          return;
        }

        const config = await getService('settings').getConfig();
        const cache = await getService('query').getSitemapCache('default');
        const invalidationObject = await getService('query').composeInvalidationObject(config, modelName, event.state.id);

        if (cache) {
          await sitemapService.createSitemap(cache.sitemap_json, invalidationObject);
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

        const invalidationObject = {
          [modelName]: {},
        };

        if (cache) {
          await sitemapService.createSitemap(cache.sitemap_json, invalidationObject);
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
