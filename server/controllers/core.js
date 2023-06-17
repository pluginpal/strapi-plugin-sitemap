'use strict';

const fs = require('fs');
const _ = require('lodash');
const path = require("path");
const { errors } = require('@strapi/utils');
const xml2js = require('xml2js');

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
    const sitemap = await strapi.entityService.findMany('plugin::sitemap.sitemap', {
      filters: {
        name: 'default',
      },
    });

    const sitemapInfo = {};

    if (sitemap[0]) {
      const xmlString = sitemap[0].sitemap_string;

      parser.parseString(xmlString, (error, result) => {
        if (error) {
          strapi.log.error(logMessage(`An error occurred while trying to parse the sitemap XML to json. ${error}`));
          throw new Error();
        } else {
          sitemapInfo.urls = _.get(result, 'urlset.url.length') || 0;
          sitemapInfo.sitemaps = _.get(result, 'sitemapindex.sitemap.length') || 0;
        }
      });

      sitemapInfo.updateTime = sitemap[0].updatedAt;
      sitemapInfo.location = '/sitemap/index.xml';
    }

    ctx.send(sitemapInfo);
  },

  getSitemap: async (ctx) => {
    const sitemap = await strapi.entityService.findMany('plugin::sitemap.sitemap', {
      filters: {
        name: 'default',
      },
    });

    if (!sitemap[0]) {
      throw new errors.NotFoundError('Not found');
    }

    ctx.response.set("content-type", 'application/xml');
    ctx.body = sitemap[0].sitemap_string;
  },

  getSitemapXsl: async (ctx) => {
    const xsl = fs.readFileSync(path.resolve(__dirname, "../../public/xsl/sitemap.xsl"), "utf8");
    ctx.response.set("content-type", 'application/xml');
    ctx.body = xsl;
  },

  getSitemapXslJs: async (ctx) => {
    const xsl = fs.readFileSync(path.resolve(__dirname, "../../public/xsl/sitemap.xsl.js"), "utf8");
    ctx.response.set("content-type", 'text/javascript');
    ctx.body = xsl;
  },

  getSitemapXslSortable: async (ctx) => {
    const xsl = fs.readFileSync(path.resolve(__dirname, "../../public/xsl/sortable.min.js"), "utf8");
    ctx.response.set("content-type", 'text/javascript');
    ctx.body = xsl;
  },

  getSitemapXslCss: async (ctx) => {
    const xsl = fs.readFileSync(path.resolve(__dirname, "../../public/xsl/sitemap.xsl.css"), "utf8");
    ctx.response.set("content-type", 'text/css');
    ctx.body = xsl;
  },
};
