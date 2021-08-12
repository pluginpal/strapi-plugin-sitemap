'use strict';

const fs = require('fs');

/**
 * Sitemap.js controller
 *
 * @description: A set of functions called "actions" of the `sitemap` plugin.
 */

module.exports = {
  buildSitemap: async (ctx) => {
    // Generate the sitemap
    await strapi.plugins.sitemap.services.sitemap.createSitemap();

    ctx.send({
      message: 'The sitemap has been generated.',
    });
  },

  hasSitemap: async (ctx) => {
    const hasSitemap = fs.existsSync('public/sitemap.xml');
    ctx.send({ main: hasSitemap });
  },

  getSettings: async (ctx) => {
    const config = await strapi.plugins.sitemap.services.config.getConfig();

    ctx.send(config);
  },

  populateSettings: async (ctx) => {
    const settings = await strapi.plugins.sitemap.services.config.getPopulatedConfig();

    ctx.send(settings);
  },

  updateSettings: async (ctx) => {
    await strapi
      .store({
        environment: '',
        type: 'plugin',
        name: 'sitemap',
      })
      .set({ key: 'settings', value: ctx.request.body });

    ctx.send({ ok: true });
  },

  allowedFields: async (ctx) => {
    const formattedFields = {};

    Object.values(strapi.contentTypes).map(async (contentType) => {
      const fields = await strapi.plugins.sitemap.services.pattern.getFields(contentType);
      formattedFields[contentType.modelName] = fields;
    });

    ctx.send(formattedFields);
  },

  resolvePattern: async (ctx) => {
    const { pattern } = ctx.request.body;

    const pages = await strapi.query('page').find({ _limit: -1 });

    pages.map(async (page) => {
      const url = await strapi.plugins.sitemap.services.pattern.resolvePattern(pattern, page);
      console.log(url);
    });

    ctx.send(pattern);
  },

  validatePattern: async (ctx) => {
    const { pattern } = ctx.request.body;
    const validated = await strapi.plugins.sitemap.services.pattern.validatePattern(pattern);

    ctx.send(validated);
  },
};
