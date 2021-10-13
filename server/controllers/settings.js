'use strict';

const { getService } = require('../utils');

/**
 * Sitemap.js controller
 *
 * @description: A set of functions called "actions" of the `sitemap` plugin.
 */

module.exports = {
  getSettings: async (ctx) => {
    const config = await getService('settings').getConfig();

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

  excludeEntry: async (ctx) => {
    const { model, id } = ctx.request.body;
    const config = await getService('settings').getConfig();

    if (!config.contentTypes[model].excluded) {
      config.contentTypes[model].excluded = [];
    }

    if (config.contentTypes[model].excluded.includes(id)) {
      const index = config.contentTypes[model].excluded.indexOf(id);
      if (index !== -1) {
        config.contentTypes[model].excluded.splice(index, 1);
      }
    } else {
      config.contentTypes[model].excluded.push(id);
    }

    await strapi
      .store({
        environment: '',
        type: 'plugin',
        name: 'sitemap',
      })
      .set({ key: 'settings', value: config });

    ctx.send({ ok: true });
  },
};