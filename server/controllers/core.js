'use strict';

const fs = require('fs');
const _ = require('lodash');
const xml2js = require('xml2js');
const { getAbsoluteServerUrl } = require('@strapi/utils');

const { getService, logMessage } = require('../utils');

const parser = new xml2js.Parser({ attrkey: "ATTR" });

/**
 * Sitemap.js controller
 *
 * @description: A set of functions called "actions" of the `sitemap` plugin.
 */

module.exports = {
  buildSitemap: async (ctx) => {
    try {
      await getService('core').createSitemap();

      ctx.send({
        message: 'The sitemap has been generated.',
      });
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = err.message;
      ctx.app.emit('error', err, ctx);
    }
  },

  getContentTypes: async (ctx) => {
    const contentTypes = {};

    await Promise.all(Object.values(strapi.contentTypes).reverse().map(async (contentType) => {
      if (strapi.config.get('plugin.sitemap.excludedTypes').includes(contentType.uid)) return;
      contentTypes[contentType.uid] = {
        displayName: contentType.globalId,
      };

      if (strapi.plugin('i18n') && _.get(contentType, 'pluginOptions.i18n.localized')) {
        const locales = await strapi.query('plugin::i18n.locale').findMany();
        contentTypes[contentType.uid].locales = {};

        await locales.map((locale) => {
          contentTypes[contentType.uid].locales[locale.code] = locale.name;
        });
      }
    }));

    ctx.send(contentTypes);
  },

  getLanguages: async (ctx) => {
    if (strapi.plugin('i18n')) {
      const locales = await strapi.query('plugin::i18n.locale').findMany();
      ctx.send(locales);
    } else {
      ctx.send([]);
    }
  },

  info: async (ctx) => {
    const sitemapInfo = {};
    const hasSitemap = fs.existsSync('public/sitemap/index.xml');

    if (hasSitemap) {
      const xmlString = fs.readFileSync("public/sitemap/index.xml", "utf8");
      const fileStats = fs.statSync("public/sitemap/index.xml");

      parser.parseString(xmlString, (error, result) => {
        if (error) {
          strapi.log.error(logMessage(`An error occurred while trying to parse the sitemap XML to json. ${error}`));
          throw new Error();
        } else {
          sitemapInfo.urls = _.get(result, 'urlset.url.length') || 0;
        }
      });

      sitemapInfo.updateTime = fileStats.mtime;
      sitemapInfo.location = `${getAbsoluteServerUrl(strapi.config)}/sitemap/index.xml`;
    }

    ctx.send(sitemapInfo);
  },
};
