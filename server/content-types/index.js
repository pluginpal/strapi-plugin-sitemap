const sitemapSchema = require('./sitemap/schema.json');
const sitemapCacheSchema = require('./sitemap_cache/schema.json');

module.exports = {
  sitemap: {
    schema: sitemapSchema,
  },
  'sitemap-cache': {
    schema: sitemapCacheSchema,
  },
};
