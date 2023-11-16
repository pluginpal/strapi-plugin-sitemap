/* eslint-disable camelcase */

'use strict';

const { get } = require('lodash');
const xml2js = require('xml2js');

const parser = new xml2js.Parser({ attrkey: 'ATTR' });

const { noLimit, getService, logMessage } = require('../utils');

/**
 * Query service.
 */

/**
 * Get an array of fields extracted from all the patterns across
 * the different languages.
 *
 * @param {obj} contentType - The content type
 * @param {bool} topLevel - Should include only top level fields
 * @param {bool} isLocalized - Should include the locale field
 * @param {string} relation - Specify a relation. If you do; the function will only return fields of that relation.
 *
 * @returns {array} The fields.
 */
const getFieldsFromConfig = (contentType, topLevel = false, isLocalized = false, relation = null) => {
  let fields = [];

  if (contentType) {
    Object.entries(contentType['languages']).map(([langcode, { pattern }]) => {
      fields.push(...getService('pattern').getFieldsFromPattern(pattern, topLevel, relation));
    });
  }

  if (topLevel) {
    if (isLocalized) {
      fields.push('locale');
    }

    fields.push('updatedAt');
  }

  // Remove duplicates
  fields = [...new Set(fields)];

  return fields;
};

/**
 * Get an object of relations extracted from all the patterns across
 * the different languages.
 *
 * @param {obj} contentType - The content type
 *
 * @returns {object} The relations.
 */
const getRelationsFromConfig = (contentType) => {
  const relationsObject = {};

  if (contentType) {
    Object.entries(contentType['languages']).map(([langcode, { pattern }]) => {
      const relations = getService('pattern').getRelationsFromPattern(pattern);
      relations.map((relation) => {
        relationsObject[relation] = {
          fields: getFieldsFromConfig(contentType, false, false, relation),
        };
      });
    });
  }

  return relationsObject;
};

/**
 * Query the nessecary pages from Strapi to build the sitemap with.
 *
 * @param {obj} config - The config object
 * @param {string} contentType - Query only entities of this type.
 * @param {array} ids - Query only these ids.
 *@param {string} contentTypeLocale
 *
 * @returns {object} The pages.
 */
const getPages = async (config, contentType, ids,contentTypeLocale) => {
  const excludeDrafts = config.excludeDrafts && strapi.contentTypes[contentType].options.draftAndPublish;
  const isLocalized = strapi.contentTypes[contentType].pluginOptions?.i18n?.localized;

  const relations = getRelationsFromConfig(config.contentTypes[contentType]);
  const fields = getFieldsFromConfig(config.contentTypes[contentType], true, isLocalized);

  const pages = await noLimit(strapi, contentType, {
    locale: contentTypeLocale,
    orderBy: 'id',
    publicationState: excludeDrafts ? 'live' : 'preview',
  });

  return pages;
};

/**
 * Query the IDs of the corresponding localization entities.
 *
 * @param {obj} contentType - The content type
 * @param {array} ids - Page ids
 *
 * @returns {object} The pages.
 */
const getLocalizationIds = async (contentType, ids) => {
  const isLocalized = strapi.contentTypes[contentType].pluginOptions?.i18n?.localized;
  const localizationIds = [];

  if (isLocalized) {
    const response = await strapi.entityService.findMany(contentType, {
      filters: { localizations: ids },
      locale: 'all',
      fields: ['id'],
    });

    response.map((localization) => localizationIds.push(localization.id));
  }

  return localizationIds;
};

/**
 * Compose the object used to invalide a part of the cache.
 *
 * @param {obj} config - The config
 * @param {string} type - The content type
 * @param {object} queryFilters - The query filters
 * @param {object} ids - Skip the query, just pass the ids
 *
 * @returns {object} The invalidation object.
 */
const composeInvalidationObject = async (config, type, queryFilters, ids = []) => {
  const mainIds = [...ids];

  if (ids.length === 0) {
    const updatedIds = await strapi.entityService.findMany(type, {
      filters: queryFilters,
      fields: ['id'],
    });
    updatedIds.map((page) => mainIds.push(page.id));
  }

  const mainLocaleIds = await getLocalizationIds(type, mainIds);

  // Add the updated entity.
  const invalidationObject = {
    [type]: {
      ids: [
        ...mainLocaleIds,
        ...mainIds,
      ],
    },
  };

  // Add all pages that have a relation to the updated entity.
  await Promise.all(Object.keys(config.contentTypes).map(async (contentType) => {
    const relations = Object.keys(getRelationsFromConfig(config.contentTypes[contentType]));

    await Promise.all(relations.map(async (relation) => {
      if (strapi.contentTypes[contentType].attributes[relation].target === type) {

        const pagesToUpdate = await strapi.entityService.findMany(contentType, {
          filters: { [relation]: mainIds },
          fields: ['id'],
        });

        if (pagesToUpdate.length > 0 && !invalidationObject[contentType]) {
          invalidationObject[contentType] = {};
        }

        const relatedIds = [];
        pagesToUpdate.map((page) => relatedIds.push(page.id));
        const relatedLocaleIds = await getLocalizationIds(contentType, relatedIds);

        invalidationObject[contentType] = {
          ids: [
            ...relatedLocaleIds,
            ...relatedIds,
          ],
        };
      }
    }));
  }));

  return invalidationObject;
};

/**
 * Get a sitemap from the database
 *
 * @param {string} name - The name of the sitemap
 * @param {number} delta - The delta of the sitemap
 * @param {array} fields - The fields array
 *
 * @returns {void}
 */
const getSitemap = async (name, delta, fields = ['sitemap_string']) => {
  const sitemap = await strapi.entityService.findMany('plugin::sitemap.sitemap', {
    filters: {
      name,
      delta,
    },
    fields,
  });

  return sitemap[0];
};

/**
 * Delete a sitemap from the database
 *
 * @param {string} name - The name of the sitemap
 *
 * @returns {void}
 */
const deleteSitemap = async (name) => {
  const sitemaps = await strapi.entityService.findMany('plugin::sitemap.sitemap', {
    filters: {
      name,
    },
    fields: ['id'],
  });

  await Promise.all(sitemaps.map(async (sm) => {
    await strapi.entityService.delete('plugin::sitemap.sitemap', sm.id);
  }));
};

/**
 * Create a sitemap in the database
 *
 * @param {obj} data - The sitemap data
 *
 * @returns {void}
 */
const createSitemap = async (data) => {
  // console.log("RESPcreateSitemap",data)
  const {
    name,
    delta,
    type,
    sitemap_string,
  } = data;

  let linkCount = null;

  parser.parseString(sitemap_string, (error, result) => {
    if (error) {
      strapi.log.error(logMessage(`An error occurred while trying to parse the sitemap XML to json. ${error}`));
      throw new Error();
    } else if (type === 'index') {
      linkCount = get(result, 'sitemapindex.sitemap.length') || 0;
    } else {
      linkCount = get(result, 'urlset.url.length') || 0;
    }
  });

  const sitemap = await strapi.entityService.create('plugin::sitemap.sitemap', {
    data: {
      sitemap_string,
      name,
      delta,
      type,
      link_count: linkCount,
    },
  });

  // console.log("strapi.entityService.create",sitemap)

  return sitemap.id;
};

/**
 * Create a sitemap_cache in the database
 *
 * @param {string} sitemapJson - The sitemap JSON
 * @param {string} name - The name of the sitemap
 * @param {number} sitemapId - The id of the sitemap
 *
 * @returns {void}
 */
const createSitemapCache = async (sitemapJson, name, sitemapId) => {
  const sitemap = await strapi.entityService.findMany('plugin::sitemap.sitemap-cache', {
    filters: {
      name,
    },
    fields: ['id'],
  });

  if (sitemap[0]) {
    await strapi.entityService.delete('plugin::sitemap.sitemap-cache', sitemap[0].id);
  }

  await strapi.entityService.create('plugin::sitemap.sitemap-cache', {
    data: {
      sitemap_json: sitemapJson,
      sitemap_id: sitemapId,
      name,
    },
  });
};

/**
 * Update a sitemap_cache in the database
 *
 * @param {string} sitemapJson - The sitemap JSON
 * @param {string} name - The name of the sitemap
 * @param {number} sitemapId - The id of the sitemap
 *
 * @returns {void}
 */
const updateSitemapCache = async (sitemapJson, name, sitemapId) => {
  const sitemap = await strapi.entityService.findMany('plugin::sitemap.sitemap-cache', {
    filters: {
      name,
    },
    fields: ['id'],
  });

  if (sitemap[0]) {
    await strapi.entityService.update('plugin::sitemap.sitemap-cache', sitemap[0].id, {
      data: {
        sitemap_json: sitemapJson,
        sitemap_id: sitemapId,
        name,
      },
    });
  }
};

/**
 * Get a sitemap_cache from the database
 *Ω
 * @param {string} name - The name of the sitemap
 *
 * @returns {void}
 */
const getSitemapCache = async (name) => {
  const sitemap = await strapi.entityService.findMany('plugin::sitemap.sitemap-cache', {
    filters: {
      name,
    },
  });

  return sitemap[0];
};

module.exports = () => ({
  getFieldsFromConfig,
  getRelationsFromConfig,
  getPages,
  getLocalizationIds,
  createSitemap,
  getSitemap,
  deleteSitemap,
  createSitemapCache,
  updateSitemapCache,
  getSitemapCache,
  composeInvalidationObject,
});
