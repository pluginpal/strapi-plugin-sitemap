const { getService } = require('../utils');

/**
 * Sitemap.js controller
 *
 * @description: A set of functions called "actions" of the `sitemap` plugin.
 */

export default {
  allowedFields: (ctx) => {
    const formattedFields = {};

    Object.values(strapi.contentTypes).map(async (contentType: any) => {
      const fields = await getService('pattern').getAllowedFields(contentType);
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
