'use strict';

/**
 * test router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

export default createCoreRouter('api::test.test');
