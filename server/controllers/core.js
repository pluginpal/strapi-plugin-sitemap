'use strict';

const fs = require('fs');
const _ = require('lodash');
const path = require('path');

const { getService, parseLocale,getConfigLocales } = require('../utils');

/**
 * Sitemap.js controller
 *
 * @description: A set of functions called "actions" of the `sitemap` plugin.
 */

module.exports = {
  buildSitemap: async (ctx) => {
    try {
      const response = await getService('core').createSitemap();
      ctx.send({
        message: response ? response : 'The sitemap has been generated.',
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
    const config = await getService('settings').getConfig()

    const configLocaleKeys = getConfigLocales(config)

    let sitemap = {}
    let sitemapLinkCount = 0
    const sitemapInfo = {};

    if(configLocaleKeys.length > 0) {
      for (const configLocaleKey of configLocaleKeys) {
        sitemap = await getService('query').getSitemap(`default - ${configLocaleKey}`, 0, ['link_count', 'updated_at', 'type']);
        sitemapLinkCount += sitemap.link_count
      }
      sitemap.link_count = sitemapLinkCount

      if (sitemap) {
        if (sitemap.type === 'index') {
          sitemapInfo.sitemaps = sitemap.link_count;
          sitemapInfo.urls = 0;
        } else {
          sitemapInfo.urls = sitemap.link_count;
          sitemapInfo.sitemaps = 0;
        }

        sitemapInfo.updateTime = sitemap.updatedAt;
        sitemapInfo.location = '/api/sitemap/index.xml';
      }

      sitemapInfo.hasPro = !!strapi.plugin('sitemap-pro');
    }
    ctx.send(sitemapInfo);
  },

  getSitemap: async (ctx) => {
    const { page = 0 } = ctx.query;
    const locale = parseLocale(ctx.url)
    const sitemap = await getService('query').getSitemap(`default - ${locale}`, page);

    if (!sitemap) {
      ctx.notFound('Not found');
      return;
    }

    ctx.response.set('content-type', 'application/xml');
    ctx.body = sitemap.sitemap_string;
  },

  getSitemapXsl: async (ctx) => {
    const xsl = fs.readFileSync(path.resolve(__dirname, '../../xsl/sitemap.xsl'), 'utf8');
    ctx.response.set('content-type', 'application/xml');
    ctx.body = xsl;
  },

  getSitemapXslJs: async (ctx) => {
    const xsl = fs.readFileSync(path.resolve(__dirname, '../../xsl/sitemap.xsl.js'), 'utf8');
    ctx.response.set('content-type', 'text/javascript');
    ctx.body = xsl;
  },

  getSitemapXslSortable: async (ctx) => {
    const xsl = fs.readFileSync(path.resolve(__dirname, '../../xsl/sortable.min.js'), 'utf8');
    ctx.response.set('content-type', 'text/javascript');
    ctx.body = xsl;
  },

  getSitemapXslCss: async (ctx) => {
    const xsl = fs.readFileSync(path.resolve(__dirname, '../../xsl/sitemap.xsl.css'), 'utf8');
    ctx.response.set('content-type', 'text/css');
    ctx.body = xsl;
  },
};
