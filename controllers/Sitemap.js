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
      message: 'The sitemap has been generated.'
    });
  },

  hasSitemap: async (ctx) => {
    const hasSitemap = fs.existsSync('public/sitemap.xml');
    ctx.send({ main: hasSitemap });
  },

  getSettings: async ctx => {
    let config = await strapi.plugins.sitemap.services.sitemap.getConfig();

    ctx.send(config);
  },

  populateSettings: async (ctx) => {
    const settings = await strapi.plugins.sitemap.services.sitemap.getPopulatedConfig();
  
    ctx.send(settings);
  },

  updateSettings: async ctx => {
    await strapi
      .store({
        environment: '',
        type: 'plugin',
        name: 'sitemap',
      })
      .set({ key: 'settings', value: ctx.request.body });

    ctx.send({ ok: true });
  },
};
