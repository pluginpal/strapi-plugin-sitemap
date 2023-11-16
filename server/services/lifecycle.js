'use strict';

const { getService, logMessage } = require('../utils');

const generateSitemapAfterUpdate = async (modelName, queryFilters, object, ids) => {
  const cachingEnabled = strapi.config.get('plugin.sitemap.caching');

  if (!cachingEnabled) {
    await getService('core').createSitemap();
    return;
  }

  const cache = await getService('query').getSitemapCache('default');

  if (cache) {
    let invalidationObject = {};

    if (!object) {
      const config = await getService('settings').getConfig();
      invalidationObject = await getService('query').composeInvalidationObject(config, modelName, queryFilters, ids);
    } else {
      invalidationObject = object;
    }

    await getService('core').createSitemap(cache.sitemap_json, invalidationObject);
  } else {
    await getService('core').createSitemap();
  }
};

/**
 * Gets lifecycle service
 *
 * @returns {object} - Lifecycle service
 */

const subscribeLifecycleMethods = async (modelName) => {
  const cachingEnabled = strapi.config.get('plugin.sitemap.caching');

  if (strapi.contentTypes[modelName]) {
    await strapi.db.lifecycles.subscribe({
      models: [modelName],

      async afterCreate(event) {
        await generateSitemapAfterUpdate(modelName, event.params.where, null, [event.result.id]);
      },

      async afterCreateMany(event) {
        await generateSitemapAfterUpdate(modelName, event.params.where, null, event.result.ids);
      },

      async afterUpdate(event) {
        await generateSitemapAfterUpdate(modelName, event.params.where, null, [event.result.id]);
      },

      async afterUpdateMany(event) {
        await generateSitemapAfterUpdate(modelName, event.params.where);
      },

      async beforeDelete(event) {
        if (!cachingEnabled) return;

        const config = await getService('settings').getConfig();
        const invalidationObject = await getService('query').composeInvalidationObject(config, modelName, event.params.where);
        event.state.invalidationObject = invalidationObject;
      },

      async afterDelete(event) {
        await generateSitemapAfterUpdate(modelName, null, event.state.invalidationObject);
      },

      async beforeDeleteMany(event) {
        if (!cachingEnabled) return;

        const config = await getService('settings').getConfig();
        const invalidationObject = await getService('query').composeInvalidationObject(config, modelName, event.params.where);
        event.state. invalidationObject = invalidationObject;
      },

      async afterDeleteMany(event) {
        await generateSitemapAfterUpdate(modelName, null, event.state.invalidationObject);
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
        console.log("contentType",contentType)
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
