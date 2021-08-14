'use strict';

const { SitemapStream, streamToPromise } = require('sitemap');
const { isEmpty } = require('lodash');
const fs = require('fs');

/**
 * Sitemap.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

module.exports = {
  getSitemapPageData: (contentType, pages, config) => {
    const pageData = {};

    pages.map(async (page) => {
      const { id } = page;
      pageData[id] = {};
      pageData[id].lastmod = page.updated_at;

      const { pattern } = config.contentTypes[contentType];
      const url = await strapi.plugins.sitemap.services.pattern.resolvePattern(pattern, page);
      pageData[id].url = url;
    });

    return pageData;
  },

  createSitemapEntries: async () => {
    const config = await strapi.plugins.sitemap.services.config.getConfig();
    const sitemapEntries = [];

    await Promise.all(Object.keys(config.contentTypes).map(async (contentType) => {
      let modelName;
      const contentTypeByName = Object.values(strapi.contentTypes)
        .find((strapiContentType) => strapiContentType.info.name === contentType);

      // Backward compatibility for issue https://github.com/boazpoolman/strapi-plugin-sitemap/issues/4
      if (contentTypeByName) {
        modelName = contentTypeByName.modelName;
      } else {
        modelName = contentType;
      }

      const hasDraftAndPublish = strapi.query(modelName).model.__schema__.options.draftAndPublish;
      let pages = await strapi.query(modelName).find({ _limit: -1 });

      if (config.excludeDrafts && hasDraftAndPublish) {
        pages = pages.filter((page) => page.published_at);
      }

      const pageData = await module.exports.getSitemapPageData(contentType, pages, config);

      Object.values(pageData).map(({ url, lastmod }) => {
        sitemapEntries.push({
          url,
          lastmod,
          changefreq: config.contentTypes[contentType].changefreq,
          priority: parseInt(config.contentTypes[contentType].priority),
        });
      });
    }));

    if (config.customEntries) {
      await Promise.all(Object.keys(config.customEntries).map(async (customEntry) => {
        sitemapEntries.push({
          url: customEntry,
          changefreq: config.customEntries[customEntry].changefreq,
          priority: parseInt(config.customEntries[customEntry].priority),
        });
      }));
    }

    // Add a homepage when none is present
    if (config.includeHomepage) {
      const hasHomePage = !isEmpty(sitemapEntries.filter((entry) => entry.url === ''));

      if (!hasHomePage) {
        sitemapEntries.push({
          url: '/',
          changefreq: 'monthly',
          priority: 1,
        });
      }
    }

    return sitemapEntries;
  },

  writeSitemapFile: (filename, sitemap) => {
    streamToPromise(sitemap)
      .then((sm) => {
        fs.writeFile(`public/${filename}`, sm.toString(), (err) => {
          if (err) throw err;
        });
      })
      .catch(() => console.error);
  },

  createSitemap: async (sitemapEntries) => {
    const config = await strapi.plugins.sitemap.services.config.getConfig();
    const sitemap = new SitemapStream({
      hostname: config.hostname,
      xslUrl: "/sitemap.xsl",
    });

    const allSitemapEntries = sitemapEntries || await module.exports.createSitemapEntries();

    allSitemapEntries.map((sitemapEntry) => {
      sitemap.write(sitemapEntry);
    });

    sitemap.end();

    await module.exports.writeSitemapFile('sitemap.xml', sitemap);
  },
};
