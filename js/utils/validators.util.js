/**
 * Validates that an object contains only allowed keys.
 * @param {Object} obj
 * @param {Array<string>} allowedKeys
 * @returns {boolean}
 */
export function hasOnlyAllowedKeys(obj, allowedKeys) {
  if (!isPlainObject(obj)) return false;
  if (!Array.isArray(allowedKeys) || !allowedKeys.every(k => typeof k === 'string')) {
    return false;
  }

  return Object.keys(obj).every(key => allowedKeys.includes(key));
}
