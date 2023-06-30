
'use strict';

const patternService = require('../pattern');

global.strapi = {
  contentTypes: {
    'another-test-relation:target:api': {
      attributes: {
        slugField: {
          type: 'uid',
        },
        textField: {
          type: 'text',
        },
      },
    },
  },
  components: {
    'core.link': {
      attributes: {
        slugField: {
          type: 'uid',
        },
        textField: {
          type: 'text',
        },
      },
    },
  },
};

describe('Pattern service', () => {
  describe('Get allowed fields for a content type', () => {
    test('Should return the right fields', () => {
      const allowedFields = ['id', 'uid', 'slugField'];
      const contentType = {
        attributes: {
          urlField: {
            type: 'uid',
          },
          slugField: {
            type: 'unknown',
          },
          textField: {
            type: 'text',
          },
          localizations: {
            type: 'relation',
            target: 'test:target:api',
            relation: 'oneToOne',
          },
          relation: {
            type: 'relation',
            target: 'another-test:target:api',
            relation: 'oneToMany',
          },
          anotherRelation: {
            type: 'relation',
            target: 'another-test-relation:target:api',
            relation: 'oneToOne',
          },
          component: {
            type: 'component',
            component: 'core.link',
            repeatable: false,
          },
          otherComponent: {
            type: 'component',
            component: 'core.link',
            repeatable: true,
          },
        },
      };

      const result = patternService().getAllowedFields(contentType, allowedFields);

      expect(result).toContain('id');
      expect(result).toContain('urlField');
      expect(result).toContain('slugField');
      expect(result).not.toContain('textField');
      expect(result).not.toContain('relation');
      expect(result).toContain('anotherRelation.id');
      expect(result).toContain('anotherRelation.slugField');
      expect(result).not.toContain('anotherRelation.textField');
      expect(result).not.toContain('components');
      expect(result).toContain('component.id');
      expect(result).toContain('component.slugField');
      expect(result).not.toContain('component.textField');
    });
  });
  describe('Get fields from pattern', () => {
    test('Should return an array of fieldnames extracted from a pattern', () => {
      const pattern = '/en/[id]/[slug]/[category.id]';

      const result = patternService().getFieldsFromPattern(pattern);

      expect(result).toEqual(['id', 'slug', 'category.id']);
    });
  });
  describe('Get only top level fields from pattern', () => {
    test('Should return an array of fieldnames extracted from a pattern', () => {
      const pattern = '/en/[id]/[slug]/[category.id]';

      const result = patternService().getFieldsFromPattern(pattern, true);

      expect(result).toEqual(['id', 'slug']);
    });
  });
  describe('Get only specific relation fields from pattern', () => {
    test('Should return an array of fieldnames extracted from a pattern', () => {
      const pattern = '/en/[id]/[slug]/[category.path]';

      const result = patternService().getFieldsFromPattern(pattern, false, 'category');

      expect(result).toEqual(['path']);
    });
  });
  describe('Get relations from pattern', () => {
    test('Should return an array of relations extracted from a pattern', () => {
      const pattern = '/en/[category]/[slug]/[relation.id]/[another_relation.fieldName]';

      const result = patternService().getRelationsFromPattern(pattern);

      expect(result).toEqual(['relation', 'another_relation']);
    });
  });
  describe('Resolve pattern', () => {
    test('Resolve valid pattern', async () => {
      const pattern = '/en/[category]/[slug]/[relation.url]';
      const entity = {
        category: 'category-a',
        slug: 'my-page-slug',
        relation: {
          url: 'relation-url',
        },
      };

      const result = await patternService().resolvePattern(pattern, entity);

      expect(result).toMatch('/en/category-a/my-page-slug/relation-url');
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
