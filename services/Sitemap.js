'use strict';

const { Map } = require('immutable');
const { SitemapStream, streamToPromise } = require('sitemap');
const fs = require('fs');

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
    contentTypes: Map({}),
  }

  await pluginStore.set({ key: 'settings', value });

  return await strapi
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
  
    return config;
  },

  getUrls: (contentType, pages, config) => {
    let urls = [];
      
    pages.map((e) => {
      Object.entries(e).map(([i, e]) => {
        if (i === config.contentTypes[contentType].uidField) {
          urls.push(e);
        }
      })
    })

    return urls;
  },

  createSitemapEntries: async () => {
    const config = await module.exports.getConfig();
    const sitemapEntries = [];

    await Promise.all(Object.keys(config.contentTypes).map(async (contentType) => {
      const pages = await strapi.query(contentType).find();
      const urls = await module.exports.getUrls(contentType, pages, config);

      urls.map((url) => {
        sitemapEntries.push({
          url: url,
          changefreq: config.contentTypes[contentType].changefreq,
          priority: config.contentTypes[contentType].priority,
        })
      })
    }));

    return sitemapEntries;
  },

  writeSitemapFile: (filename, sitemap) => {
    streamToPromise(sitemap)
      .then((sm) => {
        fs.writeFile(`public/${filename}`, sm.toString(), function (err) {
          if (err) throw err;
        });
      })
      .catch(() => console.error );
  },

  createSitemap: async (sitemapEntries) => {
    const config = await module.exports.getConfig();
    const sitemap = new SitemapStream({ hostname: config.hostname });

    const allSitemapEntries = sitemapEntries || await module.exports.createSitemapEntries();

    allSitemapEntries.map((sitemapEntry) => {
      sitemap.write(sitemapEntry)
    })

    sitemap.end();

    await module.exports.writeSitemapFile('sitemap.xml', sitemap);
  },
};
