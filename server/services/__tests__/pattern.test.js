
'use strict';

const patternService = require('../pattern');

describe('Pattern service', () => {
  describe('Get fields from pattern', () => {
    test('Should return an array of fieldnames extracted from a pattern', () => {
      const pattern = '/en/[category]/[slug]';

      const result = patternService().getFieldsFromPattern(pattern);

      expect(result).toEqual(['category', 'slug']);
    });
  });
  describe('Resolve pattern', () => {
    test('Resolve valid pattern', async () => {
      const pattern = '/en/[category]/[slug]';
      const entity = {
        category: 'category-a',
        slug: 'my-page-slug',
      };

      const result = await patternService().resolvePattern(pattern, entity);

      expect(result).toMatch('/en/category-a/my-page-slug');
    });

    test('Resolve pattern with missing field', async () => {
      const pattern = '/en/[category]/[slug]';
      const entity = {
        slug: 'my-page-slug',
      };

      const result = await patternService().resolvePattern(pattern, entity);

      expect(result).toMatch('/en/my-page-slug');
    });
  });
  describe('Validate pattern', () => {
    test('Should return { valid: true } for a valid pattern', async () => {
      const pattern = '/en/[category]/[slug]';
      const allowedFieldNames = ['category', 'slug', 'id'];

      const result = await patternService().validatePattern(pattern, allowedFieldNames);

      expect(result).toMatchObject({ valid: true });
    });

    test('Should return { valid: false } for a pattern with illegal fields', async () => {
      const pattern = '/en/[category]/[slug]';
      const allowedFieldNames = ['category', 'id'];

      const result = await patternService().validatePattern(pattern, allowedFieldNames);

      expect(result).toMatchObject({ valid: false });
    });

    test('Should return { valid: false } for a pattern with incorrectly escaped fields', async () => {
      const pattern = '/en/[category]/[slug';
      const allowedFieldNames = ['category', 'slug', 'id'];

      const result = await patternService().validatePattern(pattern, allowedFieldNames);

      expect(result).toMatchObject({ valid: false });
    });

    test('Should return { valid: false } for an empty pattern', async () => {
      const pattern = '';
      const allowedFieldNames = ['category', 'slug', 'id'];

      const result = await patternService().validatePattern(pattern, allowedFieldNames);

      expect(result).toMatchObject({ valid: false });
    });

    test('Should return { valid: false } for a pattern withouth dynamic fields', async () => {
      const pattern = '/en/pages';
      const allowedFieldNames = ['category', 'slug', 'id'];

      const result = await patternService().validatePattern(pattern, allowedFieldNames);

      expect(result).toMatchObject({ valid: false });
    });
  });
});
