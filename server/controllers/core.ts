const fs = require('fs');
const { get } = require('lodash');
const path = require('path');

const { getService } = require('../utils');

/**
 * Sitemap.js controller
 *
 * @description: A set of functions called "actions" of the `sitemap` plugin.
 */

export default {
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

    await Promise.all(Object.values(strapi.contentTypes).reverse().map(async (contentType: any) => {
      if (strapi.config.get('plugin.sitemap.excludedTypes').includes(contentType.uid)) return;
      contentTypes[contentType.uid] = {
        displayName: contentType.globalId,
      };

      if (strapi.plugin('i18n') && get(contentType, 'pluginOptions.i18n.localized')) {
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
    const sitemap = await getService('query').getSitemap('default', 0, ['link_count', 'updated_at', 'type']);
    const sitemapInfo: any = {};

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

    ctx.send(sitemapInfo);
  },

  getSitemap: async (ctx) => {
    const { page = 0 } = ctx.query;
    const sitemap = await getService('query').getSitemap('default', page);

    if (!sitemap) {
      ctx.notFound('Not found');
      return;
    }

    ctx.response.set('content-type', 'application/xml');
    ctx.body = sitemap.sitemap_string;
  },

  getSitemapXsl: (ctx) => {
    const xsl = fs.readFileSync(path.resolve(__dirname, '../../xsl/sitemap.xsl'), 'utf8');
    ctx.response.set('content-type', 'application/xml');
    ctx.body = xsl;
  },

  getSitemapXslJs: (ctx) => {
    const xsl = fs.readFileSync(path.resolve(__dirname, '../../xsl/sitemap.xsl.js'), 'utf8');
    ctx.response.set('content-type', 'text/javascript');
    ctx.body = xsl;
  },

  getSitemapXslSortable: (ctx) => {
    const xsl = fs.readFileSync(path.resolve(__dirname, '../../xsl/sortable.min.js'), 'utf8');
    ctx.response.set('content-type', 'text/javascript');
    ctx.body = xsl;
  },

  getSitemapXslCss: (ctx) => {
    const xsl = fs.readFileSync(path.resolve(__dirname, '../../xsl/sitemap.xsl.css'), 'utf8');
    ctx.response.set('content-type', 'text/css');
    ctx.body = xsl;
  },
};
