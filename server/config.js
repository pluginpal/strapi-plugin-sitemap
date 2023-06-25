'use strict';

module.exports = {
  default: {
    autoGenerate: false,
    caching: true,
    xsl: true,
    cron: '0 0 0 * * *',
    limit: 45000,
    allowedFields: ['id', 'uid'],
    excludedTypes: [
      'admin::permission',
      'admin::role',
      'admin::user',
      'admin::api-token',
      'admin::transfer-token-permission',
      'admin::transfer-token',
      'admin::api-token-permission',
      'plugin::i18n.locale',
      'plugin::users-permissions.permission',
      'plugin::users-permissions.role',
      'plugin::sitemap.sitemap',
      'plugin::sitemap.sitemap-cache',
      'plugin::upload.folder',
    ],
  },
  validator() {},
};
