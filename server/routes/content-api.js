'use strict';

module.exports = {
  type: 'content-api',
  routes: [
    {
      method: 'GET',
      path: '/:locale/index.xml',
      handler: 'core.getSitemap',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/xsl/sitemap.xsl',
      handler: 'core.getSitemapXsl',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/xsl/sortable.min.js',
      handler: 'core.getSitemapXslSortable',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/xsl/sitemap.xsl.js',
      handler: 'core.getSitemapXslJs',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/xsl/sitemap.xsl.css',
      handler: 'core.getSitemapXslCss',
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
    }
  ],
};
