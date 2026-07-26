import { generateUUID } from '../utils/id.util.js';
import { isNonEmptyString } from '../utils/validators.util.js';
import { AppConfig } from '../config/constants.js';

/**
 * Creates a validated User object.
 * @param {Object} props
 * @param {string} [props.name='']
 * @param {string} [props.defaultCurrency]
 * @param {string} [props.locale]
 * @param {string} [props.timezone]
 * @returns {Object}
 */
export function createUser(props = {}) {
  if (props.name !== undefined && !isNonEmptyString(props.name)) {
    throw new Error('[User] Invalid name: Must be a non-empty string if provided.');
  }

  const now = new Date().toISOString();

  return {
    id: generateUUID(),
    name: props.name || '',
    defaultCurrency: props.defaultCurrency || AppConfig.DEFAULT_CURRENCY,
    locale: props.locale || AppConfig.DEFAULT_LOCALE,
    timezone: props.timezone || AppConfig.DEFAULT_TIMEZONE,
    createdAt: now,
  };
}
