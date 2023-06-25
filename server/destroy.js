
'use strict';

module.exports = ({ strapi }) => {
  strapi.cron.remove("generateSitemap");
};
