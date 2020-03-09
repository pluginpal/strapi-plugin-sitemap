'use strict';

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

  getSettings: async ctx => {
    let config = await strapi.plugins.sitemap.services.sitemap.getConfig();

    ctx.send(config);
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
