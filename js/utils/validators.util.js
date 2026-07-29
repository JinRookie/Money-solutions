/**
 * Input validation utilities.
 * All functions return boolean. They do not throw.
 */

/**
 * Validates a monetary amount.
 * Must be a safe integer >= 0. Floats are invalid.
 * @param {*} value
 * @returns {boolean}
 */
export function isValidAmount(value) {
  return Number.isSafeInteger(value) && value >= 0;
}

/**
 * Validates a non-empty string.
 * @param {*} value
 * @returns {boolean}
 */
export function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Validates an ISO 8601 date string (YYYY-MM-DD).
 * @param {*} value
 * @returns {boolean}
 */
export function isValidISODate(value) {
  if (typeof value !== 'string') return false;

  const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!isoDateRegex.test(value)) return false;

  // Prevent invalid dates like 2026-02-30 from rolling over to March
  const date = new Date(value);
  const [year, month, day] = value.split('-').map(Number);

  return (
    date.getFullYear() === year &&
    date.getMonth() + 1 === month &&
    date.getDate() === day
  );
}

/**
 * Validates that a value is a plain object (not array, not null).
 * @param {*} value
 * @returns {boolean}
 */
export function isPlainObject(value) {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    value.constructor === Object
  );
}

/**
 * Validates that an object contains only allowed keys.
 * @param {Object} obj
 * @param {Array<string>} allowedKeys
 * @returns {boolean}
 */
export function hasOnlyAllowedKeys(obj, allowedKeys) {
  if (!isPlainObject(obj)) return false;

  if (
    !Array.isArray(allowedKeys) ||
    !allowedKeys.every(isNonEmptyString)
  ) {
    return false;
  }

  return Object.keys(obj).every(key => allowedKeys.includes(key));
}