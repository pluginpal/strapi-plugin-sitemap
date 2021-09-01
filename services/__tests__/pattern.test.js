
'use strict';

const patternService = require('../pattern');

describe('Pattern service', () => {
  describe('Resolve pattern', () => {
    test('Should return an array of fieldnames extracted from a pattern.', () => {
      const pattern = '/en/[category]/[slug]';

      const result = patternService.getFieldsFromPattern(pattern);

      expect(result).toEqual(['category', 'slug']);
    });
  });
});
