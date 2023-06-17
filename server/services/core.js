'use strict';

/**
 * Sitemap service.
 */

const { getConfigUrls } = require('@strapi/utils/lib');
const { SitemapStream, streamToPromise, SitemapAndIndexStream } = require('sitemap');
const { isEmpty } = require('lodash');
const { resolve } = require('path');
const fs = require('fs');
const { logMessage, getService } = require('../utils');

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
 * @returns {array} The entries.
 */
const createSitemapEntries = async () => {
  const config = await getService('settings').getConfig();
  const sitemapEntries = [];

  // Collection entries.
  await Promise.all(Object.keys(config.contentTypes).map(async (contentType) => {
    const pages = await getService('query').getPages(config, contentType);

    // Add formatted sitemap page data to the array.
    await Promise.all(pages.map(async (page) => {
      const pageData = await getSitemapPageData(page, contentType);
      if (pageData) sitemapEntries.push(pageData);
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

  return sitemapEntries;
};

/**
 * Write the sitemap xml file in the public folder.
 *
 * @param {string} filename - The file name.
 * @param {SitemapStream} sitemap - The SitemapStream instance.
 *
 * @returns {void}
 */
const saveSitemap = (filename, sitemap) => {
  streamToPromise(sitemap)
    .then(async (sm) => {
      const sitemapExists = await strapi.entityService.findMany('plugin::sitemap.sitemap', {
        filters: {
          name: 'default',
        },
      });

      if (sitemapExists[0]) {
        await strapi.entityService.update('plugin::sitemap.sitemap', sitemapExists[0].id, {
          data: {
            sitemap_string: sm.toString(),
          },
        });
      } else {
        await strapi.entityService.create('plugin::sitemap.sitemap', {
          data: {
            sitemap_string: sm.toString(),
          },
        });
      }
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
        const path = `sitemap/sitemap-${i}.xml`;
        const ws = sitemapStream.pipe(fs.createWriteStream(resolve(`public/${path}`)));

        return [new URL(path, serverUrl || 'http://localhost:1337').toString(), sitemapStream, ws];
      },
    });
  }
};

/**
 * The main sitemap generation service.
 *
 * @returns {void}
 */
const createSitemap = async () => {
  try {
    const sitemapEntries = await createSitemapEntries();

    if (isEmpty(sitemapEntries)) {
      strapi.log.info(logMessage(`No sitemap XML was generated because there were 0 URLs configured.`));
      return;
    }

    const sitemap = await getSitemapStream(sitemapEntries.length);

    sitemapEntries.map((sitemapEntry) => sitemap.write(sitemapEntry));
    sitemap.end();

    saveSitemap('default', sitemap);

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
