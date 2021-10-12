'use strict';

module.exports = {
  default: {
    autoGenerate: true,
    allowedFields: ['id', 'uid'],
    excludedTypes: [
      'admin::permission',
      'admin::role',
      'admin::api-token',
      'plugin::i18n.locale',
      'plugin::users-permissions.permission',
      'plugin::users-permissions.role',
    ],
  },
  validator() {},
};
