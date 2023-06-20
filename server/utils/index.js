'use strict';

const getCoreStore = () => {
  return strapi.store({ type: 'plugin', name: 'sitemap' });
};

const getService = (name) => {
  return strapi.plugin('sitemap').service(name);
};

const logMessage = (msg = '') => `[strapi-plugin-sitemap]: ${msg}`;

const noLimit = async (strapi, queryString, parameters, limit = 100) => {
  let entries = [];
  const amountOfEntries = await strapi.entityService.count(queryString, parameters);

  for (let i = 0; i < (amountOfEntries / limit); i++) {
    /* eslint-disable-next-line */
    const chunk = await strapi.entityService.findMany(queryString, {
      ...parameters,
      limit: limit,
      start: (i * limit),
    });
    entries = [...chunk, ...entries];
  }

  return entries;
};

const formatCache = (cache, contentType, ids) => {
  let formattedCache = [];

  if (cache) {
    // Remove the items from the cache that will be refreshed.
    if (contentType && ids) {
      ids.map((id) => delete cache[contentType]?.[id]);
    } else if (contentType) {
      delete cache[contentType];
    }

    Object.values(cache).map((values) => {
      if (values) {
        formattedCache = [
          ...formattedCache,
          ...Object.values(values),
        ];
      }
    });
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

module.exports = {
  getService,
  getCoreStore,
  logMessage,
  noLimit,
  formatCache,
  mergeCache,
};
