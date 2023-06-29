const path = require('path');

module.exports = {
  sitemap: {
    enabled: true,
    resolve: path.resolve(__dirname, '../../../src/plugins/sitemap'),
  },
};
