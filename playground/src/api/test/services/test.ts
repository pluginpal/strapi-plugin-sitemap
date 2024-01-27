'use strict';

/**
 * test service
 */

const { createCoreService } = require('@strapi/strapi').factories;

export default createCoreService('api::test.test');
