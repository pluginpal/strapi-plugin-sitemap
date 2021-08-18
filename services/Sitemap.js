'use strict';

const { SitemapStream, streamToPromise } = require('sitemap');
const { isEmpty } = require('lodash');
const fs = require('fs');

/**
 * Sitemap service.
 */

const getLanguageLinks = async (page, contentType, pattern, defaultURL) => {
  if (!page.localizations) return null;

  const links = [];
  links.push({ lang: page.locale, url: defaultURL });

  await Promise.all(page.localizations.map(async (translation) => {
    const translationEntity = await strapi.query(contentType).findOne({ id: translation.id });
    const translationUrl = await strapi.plugins.sitemap.services.pattern.resolvePattern(pattern, translationEntity);

    links.push({
      lang: translationEntity.locale,
      url: translationUrl,
    });
  }));

  return links;
};

module.exports = {
  getSitemapPageData: async (contentType, pages, config) => {
    const pageData = {};

    await Promise.all(pages.map(async (page) => {
      const { id } = page;
      pageData[id] = {};
      pageData[id].lastmod = page.updated_at;

      const { pattern } = config.contentTypes[contentType];
      const url = await strapi.plugins.sitemap.services.pattern.resolvePattern(pattern, page);
      pageData[id].url = url;
      pageData[id].links = await getLanguageLinks(page, contentType, pattern, url);
    }));

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

      Object.values(pageData).map(({ url, lastmod, links }) => {
        console.log(links);
        sitemapEntries.push({
          url,
          lastmod,
          links,
          changefreq: config.contentTypes[contentType].changefreq,
          priority: parseFloat(config.contentTypes[contentType].priority),
        });
      });
    }));

    if (config.customEntries) {
      await Promise.all(Object.keys(config.customEntries).map(async (customEntry) => {
        sitemapEntries.push({
          url: customEntry,
          changefreq: config.customEntries[customEntry].changefreq,
          priority: parseFloat(config.customEntries[customEntry].priority),
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
