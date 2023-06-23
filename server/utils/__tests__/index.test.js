
'use strict';

const {
  formatCache,
  mergeCache,
  logMessage,
} = require('..');

describe('Caching utilities', () => {
  describe('Format cache', () => {
    const cache = {
      "api::page.page": {
        1: { url: "/test/page/1" },
        2: { url: "/test/page/2" },
        3: { url: "/test/page/3" },
      },
      "api::category.category": {
        1: { url: "/test/category/1" },
      },
    };

    test('Should format and invalidate the cache for specific ids of content type', () => {
      const formattedCache = formatCache(cache, {
        'api::page.page': {
          ids: [2, 3],
        },
      });
      expect(formattedCache).toEqual([
        { url: "/test/page/1" },
        { url: "/test/category/1" },
      ]);
    });

    test('Should format and invalidate the cache for an entire content type', () => {
      const formattedCache = formatCache(cache, {
        'api::page.page': {},
      });
      expect(formattedCache).toEqual([
        { url: "/test/category/1" },
      ]);
    });
  });

  describe('Merge cache', () => {
    const cache = {
      "api::page.page": {
        1: { url: "/test/page/1" },
        2: { url: "/test/page/2" },
        3: { url: "/test/page/3" },
      },
      "api::category.category": {
        1: { url: "/test/category/1" },
      },
    };

    test('Should merge the cache correctly to add a page', () => {
      const newCache = {
        "api::page.page": {
          4: { url: "/test/page/4" },
        },
      };

      const mergedCache = mergeCache(cache, newCache);

      expect(mergedCache).toEqual({
        "api::page.page": {
          1: { url: "/test/page/1" },
          2: { url: "/test/page/2" },
          3: { url: "/test/page/3" },
          4: { url: "/test/page/4" },
        },
        "api::category.category": {
          1: { url: "/test/category/1" },
        },
      });
    });

    test('Should merge the cache correctly to remove a page', () => {
      const newCache = {
        "api::page.page": {},
      };

      const mergedCache = mergeCache(cache, newCache);

      expect(mergedCache).toEqual({
        "api::category.category": {
          1: { url: "/test/category/1" },
        },
        "api::page.page": {
          1: { url: "/test/page/1" },
          2: { url: "/test/page/2" },
          3: { url: "/test/page/3" },
        },
      });
    });
  });
});

describe('Generic utilities', () => {
  describe('Log message formatting', () => {
    const message = logMessage('An error occurred');

    expect(message).toEqual('[strapi-plugin-sitemap]: An error occurred');

  });
});
