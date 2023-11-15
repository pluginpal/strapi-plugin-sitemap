'use strict';

const adminRoutes = require('./admin');
const contentApi = require('./content-api');

module.exports = {
  'admin': adminRoutes,
  'content-api': contentApi,
};
