'use strict';

module.exports = {
  type: 'admin',
  routes: [
    {
      method: "GET",
      path: "/",
      handler: "sitemap.buildSitemap",
      config: {
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/presence",
      handler: "sitemap.hasSitemap",
      config: {
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/settings",
      handler: "sitemap.getSettings",
      config: {
        policies: [],
      },
    },
    {
      method: "PUT",
      path: "/settings",
      handler: "sitemap.updateSettings",
      config: {
        policies: [],
      },
    },
    {
      method: "PUT",
      path: "/settings/exclude",
      handler: "sitemap.excludeEntry",
      config: {
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/pattern/allowed-fields",
      handler: "sitemap.allowedFields",
      config: {
        policies: [],
      },
    },
    {
      method: "POST",
      path: "/pattern/validate-pattern",
      handler: "sitemap.validatePattern",
      config: {
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/content-types",
      handler: "sitemap.getContentTypes",
      config: {
        policies: [],
      },
    },
  ],
};
