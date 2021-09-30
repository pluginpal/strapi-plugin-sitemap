'use strict';

const getCoreStore = () => {
  return strapi.store({ type: 'plugin', name: 'sitemap' });
};

// retrieve a local service
const getService = (name) => {
  return strapi.plugin('sitemap').service(name);
};

module.exports = {
  getService,
  getCoreStore,
};
