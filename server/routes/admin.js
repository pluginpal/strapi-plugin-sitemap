'use strict';

module.exports = {
  type: 'admin',
  routes: [
    {
      method: 'GET',
      path: '/',
      handler: 'core.buildSitemap',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/info',
      handler: 'core.info',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/content-types',
      handler: 'core.getContentTypes',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/languages',
      handler: 'core.getLanguages',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/settings',
      handler: 'settings.getSettings',
      config: {
        policies: [],
      },
    },
    {
      method: 'PUT',
      path: '/settings',
      handler: 'settings.updateSettings',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/pattern/allowed-fields',
      handler: 'pattern.allowedFields',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/pattern/validate-pattern',
      handler: 'pattern.validatePattern',
      config: {
        policies: [],
      },
    },
  ],
};
