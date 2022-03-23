'use strict'

/**
 * Pattern service.
 */

/**
 * Get all field names allowed in the URL of a given content type.
 *
 * @param {string} contentType - The content type.
 *
 * @returns {string} The fields.
 */
const getAllowedFields = async contentType => {
  const fields = []
  strapi.config.get('plugin.sitemap.allowedFields').map(fieldType => {
    Object.entries(contentType.attributes).map(([fieldName, field]) => {
      if (field.type === fieldType) {
        fields.push(fieldName)
      }
      if (field.type === 'relation' && field.target) {
        const relation = strapi.contentTypes[field.target]
        Object.entries(relation.attributes).map(([fieldName, field]) => {
          if (field.type === fieldType) {
            fields.push(fieldName)
          }
        })
      }
    })
  })

  // Add id field manually because it is not on the attributes object of a content type.
  if (strapi.config.get('plugin.sitemap.allowedFields').includes('id')) {
    fields.push('id')
  }

  return fields
}

const recursiveMatch = fields => {
  let result = {}
  for (let o of fields) {
    let field = RegExp(/\[([\w\d\[\]]+)\]/g).exec(o)[1]
    if (RegExp(/\[.*\]/g).test(field)) {
      let fieldName = RegExp(/[\w\d]+/g).exec(field)[0]
      result[fieldName] = recursiveMatch(field.match(/\[([\w\d\[\]]+)\]/g))
    } else {
      result[field] = {}
    }
  }
  return result
}

/**
 * Get all fields from a pattern.
 *
 * @param {string} pattern - The pattern.
 *
 * @returns {array} The fields.\[([\w\d\[\]]+)\]
 */
const getFieldsFromPattern = pattern => {
  let fields = pattern.match(/\[([\w\d\[\]]+)\]/g) // Get all substrings between [] as array.
  fields = recursiveMatch(fields) // Strip [] from string.
  return fields
}

/**
 * Resolve a pattern string from pattern to path for a single entity.
 *
 * @param {string} pattern - The pattern.
 * @param {object} entity - The entity.
 *
 * @returns {string} The path.
 */

const resolvePattern = async (pattern, entity) => {
  const fields = getFieldsFromPattern(pattern)

  Object.keys(fields).map(field => {
    if (!Object.keys(fields[field]).length) {
      pattern = pattern.replace(`[${field}]`, entity[field] || '')
    } else {
      const subField = Object.keys(fields[field])[0]
      if (Array.isArray(entity[field]) && entity[field][0]) {
        pattern = pattern.replace(
          `[${field}[${subField}]]`,
          entity[field][0][subField] || ''
        )
      } else {
        pattern = pattern.replace(
          `[${field}[${subField}]]`,
          entity[field][subField] || ''
        )
      }
    }
  })

  pattern = pattern.replace(/([^:]\/)\/+/g, '$1') // Remove duplicate forward slashes.
  pattern = pattern.startsWith('/') ? pattern : `/${pattern}` // Add a starting slash.
  return pattern
}

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
      message: 'Pattern can not be empty'
    }
  }

  const preCharCount = pattern.split('[').length - 1
  const postCharount = pattern.split(']').length - 1

  if (preCharCount < 1 || postCharount < 1) {
    return {
      valid: false,
      message: 'Pattern should contain at least one field'
    }
  }

  if (preCharCount !== postCharount) {
    return {
      valid: false,
      message: 'Fields in the pattern are not escaped correctly'
    }
  }

  let fieldsAreAllowed = true
  const allowedFieldsRecursive = fields => {
    Object.keys(fields).map(field => {
      try {
        if (
          Object.keys(fields[field]) &&
          Object.keys(fields[field]).length > 0
        ) {
          allowedFieldsRecursive(fields[field])
        }
      } catch (e) {
        console.log('Failed!')
        console.log(e)
      }

      if (!allowedFieldNames.includes(field)) fieldsAreAllowed = false
      return true
    })
  }
  allowedFieldsRecursive(getFieldsFromPattern(pattern))

  if (!fieldsAreAllowed) {
    return {
      valid: false,
      message: 'Pattern contains forbidden fields'
    }
  }

  return {
    valid: true,
    message: 'Valid pattern'
  }
}

module.exports = () => ({
  getAllowedFields,
  getFieldsFromPattern,
  resolvePattern,
  validatePattern
})
