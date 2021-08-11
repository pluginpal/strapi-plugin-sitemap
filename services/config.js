'use strict';

const { Map } = require('immutable');

/**
 * Sitemap.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

const createDefaultConfig = async () => {
  const pluginStore = strapi.store({
    environment: '',
    type: 'plugin',
    name: 'sitemap',
  });

  const value = {
    hostname: '',
    includeHomepage: true,
    excludeDrafts: true,
    contentTypes: Map({}),
    customEntries: Map({}),
  };

  await pluginStore.set({ key: 'settings', value });

  return strapi
    .store({
      environment: '',
      type: 'plugin',
      name: 'sitemap',
    })
    .get({ key: 'settings' });
};

module.exports = {
  getConfig: async () => {
    let config = await strapi
      .store({
        environment: '',
        type: 'plugin',
        name: 'sitemap',
      })
      .get({ key: 'settings' });

    if (!config) {
      config = await createDefaultConfig('');
    }

    if (!config.customEntries) {
      config.customEntries = {};
    }

    return config;
  },

  getPopulatedConfig: async () => {
    const config = await module.exports.getConfig();
    const contentTypes = {};

    Object.values(strapi.contentTypes).map((contentType) => {
      let uidFieldName = false;

      Object.entries(contentType.__schema__.attributes).map(([i, e]) => {
        if (e.type === "uid") {
          uidFieldName = i;
        }
      });

      if (uidFieldName) {
        contentTypes[contentType.modelName] = {
          uidField: uidFieldName,
          priority: 0.5,
          changefreq: 'monthly',
          area: '',
        };
      }
    });

    return {
      hostname: '',
      customEntries: config.customEntries,
      contentTypes,
    };
  },
};
