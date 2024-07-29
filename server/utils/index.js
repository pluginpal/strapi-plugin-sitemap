'use strict';

const getCoreStore = () => {
  return strapi.store({ type: 'plugin', name: 'sitemap' });
};

const getService = (name) => {
  return strapi.plugin('sitemap').service(name);
};

const logMessage = (msg = '') => `[strapi-plugin-sitemap]: ${msg}`;

const noLimit = async (strapi, queryString, parameters, limit = 5000) => {
  let entries = [];
  const amountOfEntries = await strapi.entityService.count(queryString, parameters);

  for (let i = 0; i < (amountOfEntries / limit); i++) {
    /* eslint-disable-next-line */
    const chunk = await strapi.entityService.findMany(queryString, {
      ...parameters,
      limit: limit,
      start: (i * limit),
    });
    if (chunk.id) {
      entries = [chunk, ...entries];
    } else {
      entries = [...chunk, ...entries];
    }
  }

  return entries;
};

const formatCache = (cache, invalidationObject) => {
  let formattedCache = [];

  if (cache) {
    if (invalidationObject) {
      Object.keys(invalidationObject).map((contentType) => {
        // Remove the items from the cache that will be refreshed.
        if (contentType && invalidationObject[contentType].ids) {
          invalidationObject[contentType].ids.map((id) => delete cache[contentType]?.[id]);
        } else if (contentType) {
          delete cache[contentType];
        }
      });

      Object.values(cache).map((values) => {
        if (values) {
          formattedCache = [
            ...formattedCache,
            ...Object.values(values),
          ];
        }
      });
    }
  }

  return formattedCache;
};

const mergeCache = (oldCache, newCache) => {
  const mergedCache = [oldCache, newCache].reduce((merged, current) => {
    Object.entries(current).forEach(([key, value]) => {
      if (!merged[key]) merged[key] = {};
      merged[key] = { ...merged[key], ...value };
    });
    return merged;
  }, {});

  return mergedCache;
};


const isValidUrl = (url) => {
  try {
    // eslint-disable-next-line no-new
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
};

module.exports = {
  getService,
  getCoreStore,
  logMessage,
  noLimit,
  formatCache,
  mergeCache,
  isValidUrl,
};
