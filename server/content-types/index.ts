const sitemapSchema = require('./sitemap/schema.json');
const sitemapCacheSchema = require('./sitemap_cache/schema.json');

export default {
  sitemap: {
    schema: sitemapSchema,
  },
  'sitemap-cache': {
    schema: sitemapCacheSchema,
  },
};
