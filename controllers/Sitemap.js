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
      const fields = await strapi.plugins.sitemap.services.pattern.getAllowedFields(contentType);
      formattedFields[contentType.modelName] = fields;
    });

    ctx.send(formattedFields);
  },

  validatePattern: async (ctx) => {
    const { pattern, modelName } = ctx.request.body;

    const contentType = Object.values(strapi.contentTypes)
      .find((strapiContentType) => strapiContentType.modelName === modelName);

    const fields = await strapi.plugins.sitemap.services.pattern.getAllowedFields(contentType);
    const validated = await strapi.plugins.sitemap.services.pattern.validatePattern(pattern, fields);

    ctx.send(validated);
  },
};
