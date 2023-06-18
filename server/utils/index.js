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
  const amountOfEntries = await strapi.query(queryString).count(parameters);

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

const formatCache = (cache, contentType, id) => {
  let formattedCache = [];

  if (cache) {
    // Remove the items from the cache that will be refreshed.
    if (contentType && id) {
      delete cache[contentType][id];
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

module.exports = {
  getService,
  getCoreStore,
  logMessage,
  noLimit,
  formatCache,
};
