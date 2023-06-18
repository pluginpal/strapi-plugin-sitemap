'use strict';

/**
 * Sitemap service.
 */

const { getConfigUrls } = require('@strapi/utils/lib');
const { SitemapStream, streamToPromise, SitemapAndIndexStream } = require('sitemap');
const { isEmpty } = require('lodash');
const { logMessage, getService, formatCache } = require('../utils');

/**
 * Get a formatted array of different language URLs of a single page.
 *
 * @param {object} page - The entity.
 * @param {string} contentType - The model of the entity.
 * @param {string} defaultURL - The default URL of the different languages.
 *
 * @returns {array} The language links.
 */
const getLanguageLinks = async (page, contentType, defaultURL) => {
  const config = await getService('settings').getConfig();
  if (!page.localizations) return null;

  const links = [];
  links.push({ lang: page.locale, url: defaultURL });

  await Promise.all(page.localizations.map(async (translation) => {
    let { locale } = translation;

    // Return when there is no pattern for the page.
    if (
      !config.contentTypes[contentType]['languages'][locale]
      && config.contentTypes[contentType]['languages']['und']
    ) {
      locale = 'und';
    } else if (
      !config.contentTypes[contentType]['languages'][locale]
      && !config.contentTypes[contentType]['languages']['und']
    ) {
      return null;
    }

    const { pattern } = config.contentTypes[contentType]['languages'][locale];
    const translationUrl = await strapi.plugins.sitemap.services.pattern.resolvePattern(pattern, translation);
    let hostnameOverride = config.hostname_overrides[translation.locale] || '';
    hostnameOverride = hostnameOverride.replace(/\/+$/, "");
    links.push({
      lang: translation.locale,
      url: `${hostnameOverride}${translationUrl}`,
    });
  }));

  return links;
};

/**
 * Get a formatted sitemap entry object for a single page.
 *
 * @param {object} page - The entity.
 * @param {string} contentType - The model of the entity.
 * @param {bool} excludeDrafts - Whether to exclude drafts.
 *
 * @returns {object} The sitemap entry data.
 */
const getSitemapPageData = async (page, contentType) => {
  let locale = page.locale || 'und';
  const config = await getService('settings').getConfig();

  // Return when there is no pattern for the page.
  if (
    !config.contentTypes[contentType]['languages'][locale]
    && config.contentTypes[contentType]['languages']['und']
  ) {
    locale = 'und';
  } else if (
    !config.contentTypes[contentType]['languages'][locale]
    && !config.contentTypes[contentType]['languages']['und']
  ) {
    return null;
  }

  const { pattern } = config.contentTypes[contentType]['languages'][locale];
  const path = await strapi.plugins.sitemap.services.pattern.resolvePattern(pattern, page);
  let hostnameOverride = config.hostname_overrides[page.locale] || '';
  hostnameOverride = hostnameOverride.replace(/\/+$/, "");
  const url = `${hostnameOverride}${path}`;

  const pageData = {
    lastmod: page.updatedAt,
    url: url,
    links: await getLanguageLinks(page, contentType, url),
    changefreq: config.contentTypes[contentType]['languages'][locale].changefreq || 'monthly',
    priority: parseFloat(config.contentTypes[contentType]['languages'][locale].priority) || 0.5,
  };

  if (config.contentTypes[contentType]['languages'][locale].includeLastmod === false) {
    delete pageData.lastmod;
  }

  return pageData;
};

/**
 * Get array of sitemap entries based on the plugins configurations.
 *
 * @returns {object} The cache and regular entries.
 */
const createSitemapEntries = async (type, id) => {
  const config = await getService('settings').getConfig();
  const sitemapEntries = [];
  const cacheEntries = {};

  // Collection entries.
  await Promise.all(Object.keys(config.contentTypes).map(async (contentType) => {
    if (type && type !== contentType) {
      return;
    }

    cacheEntries[contentType] = {};

    // Query all the pages
    const pages = await getService('query').getPages(config, contentType, id);

    // Add formatted sitemap page data to the array.
    await Promise.all(pages.map(async (page) => {
      const pageData = await getSitemapPageData(page, contentType);
      if (pageData) {
        sitemapEntries.push(pageData);

        // Add page to the cache.
        cacheEntries[contentType][page.id] = pageData;
      }
    }));
  }));


  // Custom entries.
  await Promise.all(Object.keys(config.customEntries).map(async (customEntry) => {
    sitemapEntries.push({
      url: customEntry,
      changefreq: config.customEntries[customEntry].changefreq,
      priority: parseFloat(config.customEntries[customEntry].priority),
    });
  }));

  // Custom homepage entry.
  if (config.includeHomepage) {
    const hasHomePage = !isEmpty(sitemapEntries.filter((entry) => entry.url === ''));

    // Only add it when no other '/' entry is present.
    if (!hasHomePage) {
      sitemapEntries.push({
        url: '/',
        changefreq: 'monthly',
        priority: 1,
      });
    }
  }

  return { cacheEntries, sitemapEntries };
};

/**
 * Write the sitemap xml file in the public folder.
 *
 * @param {string} filename - The file name.
 * @param {SitemapStream} sitemap - The SitemapStream instance.
 *
 * @returns {void}
 */
const saveSitemap = async (filename, sitemap) => {
  await streamToPromise(sitemap)
    .then(async (sm) => {
      await getService('query').createSitemap(sm.toString(), 'default', 0);
    })
    .catch((err) => {
      strapi.log.error(logMessage(`Something went wrong while trying to build the sitemap with streamToPromise. ${err}`));
      throw new Error();
    });
};

/**
 * Get the SitemapStream instance.
 *
 * @param {number} urlCount - The amount of URLs.
 *
 * @returns {SitemapStream} - The sitemap stream.
 */
 const getSitemapStream = async (urlCount) => {
  const config = await getService('settings').getConfig();
  const LIMIT = strapi.config.get('plugin.sitemap.limit');
  const { serverUrl } = getConfigUrls(strapi.config);

  if (urlCount <= LIMIT) {
    return new SitemapStream({
      hostname: config.hostname,
      xslUrl: "xsl/sitemap.xsl",
    });
  } else {

    return new SitemapAndIndexStream({
      limit: LIMIT,
      xslUrl: "xsl/sitemap.xsl",
      lastmodDateOnly: false,
      getSitemapStream: (i) => {
        const sitemapStream = new SitemapStream({
          hostname: config.hostname,
          xslUrl: "xsl/sitemap.xsl",
        });
        const delta = i + 1;
        const path = `api/sitemap/index.xml?page=${delta}`;

        streamToPromise(sitemapStream)
          .then((sm) => {
            getService('query').createSitemap(sm.toString(), 'default', delta);
          });

        return [new URL(path, serverUrl || 'http://localhost:1337').toString(), sitemapStream];
      },
    });
  }
};

/**
 * The main sitemap generation service.
 *
 * @param {array} cache - The cached JSON
 * @param {array} contentType - Content type to refresh
 * @param {array} id - ID to refresh
 *
 * @returns {void}
 */
const createSitemap = async (cache, contentType, id) => {
  try {
    const {
      sitemapEntries,
      cacheEntries,
    } = await createSitemapEntries(contentType, id);

    // Format cache to regular entries
    const formattedCache = formatCache(cache, contentType, id);

    const allEntries = [
      ...sitemapEntries,
      ...formattedCache,
    ];

    if (isEmpty(allEntries)) {
      strapi.log.info(logMessage(`No sitemap XML was generated because there were 0 URLs configured.`));
      return;
    }

    await getService('query').deleteSitemap('default');

    const sitemap = await getSitemapStream(allEntries.length);

    allEntries.map((sitemapEntry) => sitemap.write(sitemapEntry));
    sitemap.end();

    if (!cache) {
      await getService('query').createSitemapCache(cacheEntries, 'default');
    } else {
      // TODO: Better object merging.
      const newCache = Object.assign(cache, cacheEntries);
      await getService('query').updateSitemapCache(newCache, 'default');
    }

    await saveSitemap('default', sitemap);

  } catch (err) {
    strapi.log.error(logMessage(`Something went wrong while trying to build the SitemapStream. ${err}`));
    throw new Error();
  }
};

module.exports = () => ({
  getLanguageLinks,
  getSitemapPageData,
  createSitemapEntries,
  saveSitemap,
  createSitemap,
});
