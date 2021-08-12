'use strict';

const { prop } = require('lodash/fp');

const getCoreStore = () => {
  strapi.store({
    environment: '',
    type: 'plugin',
    name: 'sitemap',
  });
};

const getService = (name) => {
  return prop(`sitemap.services.${name}`, strapi.plugins);
};

module.exports = {
  getService,
  getCoreStore,
};
