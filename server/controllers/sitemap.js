'use strict';

const fs = require('fs');

const { getService } = require('../utils');

/**
 * Sitemap.js controller
 *
 * @description: A set of functions called "actions" of the `sitemap` plugin.
 */


module.exports = {
  buildSitemap: async (ctx) => {
    const sitemapService = getService('sitemap');

    // Generate the sitemap
    await sitemapService.createSitemap();

    ctx.send({
      message: 'The sitemap has been generated.',
    });
  },

  hasSitemap: async (ctx) => {
    const hasSitemap = fs.existsSync('public/sitemap.xml');
    ctx.send({ main: hasSitemap });
  },

  getSettings: async (ctx) => {
    const configService = getService('config');
    const config = await configService.getConfig();

    ctx.send(config);
  },

  getContentTypes: async (ctx) => {
    const contentTypes = {};

    Object.values(strapi.contentTypes).map(async (contentType) => {
      contentTypes[contentType.uid] = {
        displayName: contentType.globalId,
      };
    });

    ctx.send(contentTypes);
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
    const patternService = getService('pattern');
    const formattedFields = {};

    Object.values(strapi.contentTypes).map(async (contentType) => {
      const fields = await patternService.getAllowedFields(contentType);
      formattedFields[contentType.uid] = fields;
    });

    ctx.send(formattedFields);
  },

  validatePattern: async (ctx) => {
    const patternService = getService('pattern');
    const { pattern, modelName } = ctx.request.body;

    const contentType = strapi.contentTypes[modelName];

    const fields = await patternService.getAllowedFields(contentType);
    const validated = await patternService.validatePattern(pattern, fields);

    ctx.send(validated);
  },
};
