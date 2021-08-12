'use strict';

/**
 * Pattern service.
 */

const allowedFields = ['id', 'uid'];

/**
 * Get all field names allowed in the URL of a given content type.
 *
 * @param {string} contentType - The content type.
 *
 * @returns {string} The fields.
 */
const getFields = async (contentType) => {
  const fields = [];
  allowedFields.map((fieldType) => {
    Object.entries(contentType.attributes).map(([fieldName, field]) => {
      if (field.type === fieldType) {
        fields.push(fieldName);
      }
    });
  });
  return fields;
};

/**
 * Resolve a pattern string from pattern to path for a single entity.
 *
 * @param {string} pattern - The pattern.
 * @param {object} entity - The entity.
 *
 * @returns {string} The path.
 */
const resolvePattern = async (pattern, entity) => {
  const fields = pattern.match(/[[\w\d]+]/g); // Get all substring between [] as array.

  fields.map((field) => {
    const formattedField = RegExp(/(?<=\[)(.*?)(?=\])/).exec(field)[0]; // Strip [] from string.
    pattern = pattern.replace(field, entity[formattedField]);
  });

  pattern = pattern.replace(/([^:]\/)\/+/g, "$1"); // Remove duplicate slashes.
  return pattern;
};

/**
 * Validate if a pattern is correctly structured.
 *
 * @param {string} pattern - The pattern.
 *
 * @returns {bool} Validated.
 */
const validatePattern = async (pattern) => {
  const preCharCount = pattern.split("[").length - 1;
  const postCharount = pattern.split("]").length - 1;

  return preCharCount === postCharount;
};

module.exports = {
  getFields,
  resolvePattern,
  validatePattern,
};
