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
      offset: (i * limit),
    });
    entries = [...chunk, ...entries];
  }

  return entries;
};

module.exports = {
  getService,
  getCoreStore,
  logMessage,
  noLimit,
};
