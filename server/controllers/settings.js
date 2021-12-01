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
    const config = await getService('settings').getConfig();
    const newContentTypes = Object.keys(ctx.request.body.contentTypes).filter((x) => !Object.keys(config.contentTypes).includes(x));

    await strapi
      .store({
        environment: '',
        type: 'plugin',
        name: 'sitemap',
      })
      .set({ key: 'settings', value: ctx.request.body });

    // Load lifecycle methods for auto generation of sitemap.
    await newContentTypes.map(async (contentType) => {
      await getService('lifecycle').loadLifecycleMethod(contentType);
    });

    ctx.send({ ok: true });
  },
};
