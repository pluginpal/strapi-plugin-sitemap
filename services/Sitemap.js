'use strict';

const { Map } = require('immutable');
const { SitemapStream, streamToPromise } = require('sitemap');
const { isEmpty, trim } = require('lodash');
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
    includeHomepage: true,
    contentTypes: Map({}),
    customEntries: Map({}),
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

    if (!config.customEntries) {
      config.customEntries = {};
    }

    return config;
  },

  getPopulatedConfig: async () => {
    const config = await module.exports.getConfig();
    let contentTypes = {};

    Object.values(strapi.contentTypes).map(contentType => {
      let uidFieldName = false;

      Object.entries(contentType.__schema__.attributes).map(([i, e]) => {
        if (e.type === "uid") {
          uidFieldName = i;
        }
      })

      if (uidFieldName) {
        contentTypes[contentType.modelName] = {
          uidField: uidFieldName,
          priority: 0.5,
          changefreq: 'monthly',
          area: ''
        };
      }
    })

    return {
      hostname: '',
      customEntries: config.customEntries,
      contentTypes,
    };
  },

  getSitemapPageData: (contentType, pages, config) => {
    let pageData = {};

    pages.map((e) => {
      const id = e.id;
      pageData[id] = {};
      pageData[id].lastmod = e.updated_at;

      Object.entries(e).map(([i, e]) => {
        if (i === config.contentTypes[contentType].uidField) {
          const area = trim(config.contentTypes[contentType].area, '/');
          const url = [area, e].filter(Boolean).join('/')
          pageData[id].url = url;
        }
      })
    })

    return pageData;
  },

  createSitemapEntries: async () => {
    const config = await module.exports.getConfig();
    const sitemapEntries = [];

    await Promise.all(Object.keys(config.contentTypes).map(async (contentType) => {
      let modelName;
      const contentTypeByName = Object.values(strapi.contentTypes)
        .find(strapiContentType => strapiContentType.info.name === contentType);

      // Backward compatibility for issue https://github.com/boazpoolman/strapi-plugin-sitemap/issues/4
      if (contentTypeByName) {
        modelName = contentTypeByName.modelName;
      } else {
        modelName = contentType;
      }

      const pages = await strapi.query(modelName).find({_limit: -1});
      const pageData = await module.exports.getSitemapPageData(contentType, pages, config);

      Object.values(pageData).map(({ url, lastmod }) => {
        sitemapEntries.push({
          url,
          lastmod,
          changefreq: config.contentTypes[contentType].changefreq,
          priority: config.contentTypes[contentType].priority,
        })
      })
    }));

    if (config.customEntries) {
      await Promise.all(Object.keys(config.customEntries).map(async (customEntry) => {
        sitemapEntries.push({
          url: customEntry,
          changefreq: config.customEntries[customEntry].changefreq,
          priority: config.customEntries[customEntry].priority,
        })
      }));
    }

    // Add a homepage when none is present
    if (config.includeHomepage) {
      const hasHomePage = !isEmpty(sitemapEntries.filter(entry => entry.url === ''));

      if (!hasHomePage) {
        sitemapEntries.push({
          url: '/',
          changefreq: 'monthly',
          priority: '1',
        })
      }
    }

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
