"use strict";

const { logMessage } = require("../utils");

/**
 * Pattern service.
 */

/**
 * Get all field names allowed in the URL of a given content type.
 *
 * @param {string} contentType - The content type.
 * @param {array} allowedFields - Override the allowed fields.
 *
 * @returns {string[]} The fields.
 */
const getAllowedFields = (contentType, allowedFields = []) => {
  const fields = [];
  const fieldTypes =
    allowedFields.length > 0
      ? allowedFields
      : strapi.config.get("plugin.sitemap.allowedFields");
  fieldTypes.map((fieldType) => {
    Object.entries(contentType.attributes).map(([fieldName, field]) => {
      // console.warn("[getAllowedFields] fieldName", fieldName, "field", field);
      if (
        (field.type === fieldType || fieldName === fieldType) &&
        field.type !== "relation"
      ) {
        fields.push(fieldName);
      } else if (
        field.type === "relation" &&
        field.target &&
        field.relation.endsWith("ToOne") &&
        fieldName !== "localizations" &&
        fieldName !== "createdBy" &&
        fieldName !== "updatedBy"
      ) {
        const relation = strapi.contentTypes[field.target];

        if (fieldTypes.includes("id") && !fields.includes(`${fieldName}.id`)) {
          fields.push(`${fieldName}.id`);
        }

        Object.entries(relation.attributes).map(([subFieldName, subField]) => {
          if (subField.type === fieldType || subFieldName === fieldType) {
            fields.push(`${fieldName}.${subFieldName}`);
          }
        });
      } else if (
        field.type === "relation" &&
        field.target &&
        field.mappedBy &&
        field.relation.endsWith("ToMany") &&
        fieldName !== "localizations" &&
        fieldName !== "createdBy" &&
        fieldName !== "updatedBy"
      ) {
        const relation = strapi.contentTypes[field.target];

        Object.entries(relation.attributes).map(([subFieldName, subField]) => {
          if (subField.type === fieldType || subFieldName === fieldType) {
            fields.push(`${fieldName}[0].${subFieldName}`);
          }
        });
      } else if (
        field.type === "component" &&
        field.component &&
        field.repeatable !== true // TODO: implement repeatable components (#78).
      ) {
        const relation = strapi.components[field.component];

        if (fieldTypes.includes("id") && !fields.includes(`${fieldName}.id`)) {
          fields.push(`${fieldName}.id`);
        }

        Object.entries(relation.attributes).map(([subFieldName, subField]) => {
          if (subField.type === fieldType || subFieldName === fieldType) {
            fields.push(`${fieldName}.${subFieldName}`);
          }
        });
      }
    });
  });

  // Add id field manually because it is not on the attributes object of a content type.
  if (fieldTypes.includes("id")) {
    fields.push("id");
  }

  return fields;
};

/**
 * Get all fields from a pattern.
 *
 * @param {string} pattern - The pattern.
 * @param {boolean} topLevel - No relation fields.
 * @param {string} relation - Specify a relation. If you do; the function will only return fields of that relation.
 *
 * @returns {array} The fields.
 */
const getFieldsFromPattern = (pattern, topLevel = false, relation = null) => {
  let fields = pattern.match(/(?<=\/)(\[.*?\])(?=\/|$)/g); // Get all substrings between [] as array. // PR - Now it works with [value[0].field]

  // eslint-disable-next-line prefer-regex-literals
  fields = fields.map((field) => field.replace(/^.|.$/g, "")); // Strip [] from string. // PR - Simplify regex

  if (relation) {
    fields = fields.filter(
      (field) =>
        field.startsWith(`${relation}.`) || field.startsWith(`${relation}[0].`)
    );
    fields = fields.map((field) => field.split(".")[1]);
  } else if (topLevel) {
    fields = fields.filter((field) => field.split(".").length === 1);
  }

  return fields;
};

/**
 * Get all relations from a pattern.
 *
 * @param {string} pattern - The pattern.
 *
 * @returns {array} The relations.
 */
const getRelationsFromPattern = (pattern) => {
  let fields = getFieldsFromPattern(pattern);

  fields = fields.filter((field) => field.split(".").length > 1); // Filter on fields containing a dot (.)
  fields = fields
    .map((field) => field.split(".")[0]) // Extract the first part of the fields. Ex: categories[0].slug -> categories[0]
    .map((field) => field.split("[")[0]); // Extract the first part of the fields. Ex: categories[0] -> categories

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
  const fields = getFieldsFromPattern(pattern);

  fields.map((field) => {
    let relationalField = field.split(".").length > 1 ? field.split(".") : null;

    if (field && field.includes("[")) {
      // If the relational field many to many
      const childField = field.split("[")[0];
      relationalField = [childField, relationalField[1]];
    }

    if (!relationalField) {
      pattern = pattern.replace(`[${field}]`, entity[field] || "");
    } else if (Array.isArray(entity[relationalField[0]])) {
      // Many to Many relationship
      pattern = pattern.replace(
        `[${field}]`,
        entity[relationalField[0]] &&
          entity[relationalField[0]][0] &&
          entity[relationalField[0]][0][relationalField[1]]
          ? entity[relationalField[0]][0][relationalField[1]]
          : ""
      );
    } else if (typeof entity[relationalField[0]] === "object") {
      pattern = pattern.replace(
        `[${field}]`,
        entity[relationalField[0]] &&
          entity[relationalField[0]][relationalField[1]]
          ? entity[relationalField[0]][relationalField[1]]
          : ""
      );
    }
  });

  pattern = pattern.replace(/\/+/g, "/"); // Remove duplicate forward slashes.
  pattern = pattern.startsWith("/") ? pattern : `/${pattern}`; // Make sure we only have on forward slash.
  return pattern;
};

/**
 * Validate if a pattern is correctly structured.
 *
 * @param {string} pattern - The pattern.
 * @param {array} allowedFieldNames - Fields allowed in this pattern.
 *
 * @returns {object} object.
 * @returns {boolean} object.valid Validation boolean.
 * @returns {string} object.message Validation string.
 */
const validatePattern = async (pattern, allowedFieldNames) => {
  if (!pattern) {
    return {
      valid: false,
      message: "Pattern can not be empty",
    };
  }

  const preCharCount = pattern.split("[").length - 1;
  const postCharount = pattern.split("]").length - 1;

  if (preCharCount < 1 || postCharount < 1) {
    return {
      valid: false,
      message: "Pattern should contain at least one field",
    };
  }

  if (preCharCount !== postCharount) {
    return {
      valid: false,
      message: "Fields in the pattern are not escaped correctly",
    };
  }

  let fieldsAreAllowed = true;

  getFieldsFromPattern(pattern).map((field) => {
    if (!allowedFieldNames.includes(field)) fieldsAreAllowed = false;
  });

  if (!fieldsAreAllowed) {
    return {
      valid: false,
      message: "Pattern contains forbidden fields",
    };
  }

  return {
    valid: true,
    message: "Valid pattern",
  };
};

module.exports = () => ({
  getAllowedFields,
  getFieldsFromPattern,
  getRelationsFromPattern,
  resolvePattern,
  validatePattern,
});
