const path = require('path');

module.exports = {
  sitemap: {
    enabled: true,
    resolve: path.resolve(__dirname, '../../../node_modules/strapi-plugin-sitemap'),
  },
};
