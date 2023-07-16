
'use strict';

const _ = require('lodash');

/**
 * Adds sitemap_exclude field to all the eligable content types.
 * @param {Strapi} strapi - The Strapi instance.
 *
 * @returns {void}
 */
const extendContentTypesWithExcludeField = async (strapi) => {
  Object.values(strapi.contentTypes).forEach((contentType) => {
    if (strapi.config.get('plugin.sitemap.excludedTypes').includes(contentType.uid)) return;

    const { attributes } = contentType;

    _.set(attributes, 'sitemap_exclude', {
      writable: true,
      private: true,
      configurable: false,
      visible: false,
      default: false,
      type: 'boolean',
    });
  });
};

module.exports = ({ strapi }) => {
  extendContentTypesWithExcludeField(strapi);
};
