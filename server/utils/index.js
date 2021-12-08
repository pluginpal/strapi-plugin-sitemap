'use strict';

const getCoreStore = () => {
  return strapi.store({ type: 'plugin', name: 'sitemap' });
};

const getService = (name) => {
  return strapi.plugin('sitemap').service(name);
};

const logMessage = (msg = '') => `[strapi-plugin-sitemap]: ${msg}`;

const noLimit = async (query, parameters, limit = 100) => {
  let entries = [];
  const amountOfEntries = await query.count(parameters);

  for (let i = 0; i < (amountOfEntries / limit); i++) {
    /* eslint-disable-next-line */
    const chunk = await query.findMany({
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
