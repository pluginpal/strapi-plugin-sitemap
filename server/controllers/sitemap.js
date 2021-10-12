'use strict';

const fs = require('fs');
const _ = require('lodash');

const { getService } = require('../utils');

/**
 * Sitemap.js controller
 *
 * @description: A set of functions called "actions" of the `sitemap` plugin.
 */

const typesToExclude = [
  'admin::permission',
  'admin::role',
  'admin::api-token',
  'plugin::i18n.locale',
  'plugin::users-permissions.permission',
  'plugin::users-permissions.role',
];

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
    const hasSitemap = fs.existsSync('public/sitemap/index.xml');
    ctx.send({ main: hasSitemap });
  },

  getSettings: async (ctx) => {
    const configService = getService('config');
    const config = await configService.getConfig();

    ctx.send(config);
  },

  getContentTypes: async (ctx) => {
    const contentTypes = {};

    await Promise.all(Object.values(strapi.contentTypes).reverse().map(async (contentType) => {
      if (strapi.config.get('plugin.sitemap.excludedTypes').includes(contentType.uid)) return;
      contentTypes[contentType.uid] = {
        displayName: contentType.globalId,
      };

      if (_.get(contentType, 'pluginOptions.i18n.localized')) {
        const locales = await strapi.query('plugin::i18n.locale').findMany();
        contentTypes[contentType.uid].locales = {};

        await locales.map((locale) => {
          contentTypes[contentType.uid].locales[locale.code] = locale.name;
        });
      }
    }));

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

  excludeEntry: async (ctx) => {
    const { model, id } = ctx.request.body;

    const configService = getService('config');
    const config = await configService.getConfig();

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
