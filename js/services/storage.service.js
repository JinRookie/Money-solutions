/**
 * Storage abstraction layer.
 * The ONLY module allowed to touch localStorage directly.
 */

import { AppConfig } from '../config/constants.js';
import { isPlainObject } from '../utils/validators.util.js';

const PREFIX = AppConfig.STORAGE_PREFIX;

/**
 * Retrieves and parses a value from storage.
 * @param {string} key - Logical key name (without prefix)
 * @returns {*|null}
 */
function get(key) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw === null) return null;
    
    return JSON.parse(raw);
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.warn(`[StorageService] Corrupted data for key: ${PREFIX + key}`, error);
      return null;
    }
    // Handle cases where localStorage is blocked (e.g. private browsing)
    console.warn(`[StorageService] Error reading key: ${PREFIX + key}`, error);
    return null;
  }
}

/**
 * Serializes and stores a value.
 * @param {string} key - Logical key name (without prefix)
 * @param {*} value - Value to serialize and store
 * @throws {Error} If storage is full or access is denied.
 */
function set(key, value) {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(PREFIX + key, serialized);
  } catch (error) {
    if (error instanceof DOMException && (
      error.name === 'QuotaExceededError' || 
      error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
    )) {
      throw new Error(`[StorageService] Storage quota exceeded. Cannot save ${key}.`);
    }
    
    if (error instanceof DOMException && error.name === 'SecurityError') {
      throw new Error(`[StorageService] Storage access denied. Cannot save ${key}. Is localStorage disabled?`);
    }

    throw new Error(`[StorageService] Unknown error saving ${key}: ${error.message}`);
  }
}

/**
 * Removes a key from storage.
 * @param {string} key - Logical key name (without prefix)
 */
function remove(key) {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch (error) {
    console.warn(`[StorageService] Error removing key: ${PREFIX + key}`, error);
  }
}

/**
 * Exports all mm_ prefixed data as a plain object.
 * Keys in the returned object are unprefixed.
 * @returns {Object}
 */
function exportAll() {
  const data = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const fullKey = localStorage.key(i);
      if (fullKey && fullKey.startsWith(PREFIX)) {
        const logicalKey = fullKey.slice(PREFIX.length);
        try {
          data[logicalKey] = JSON.parse(localStorage.getItem(fullKey));
        } catch (parseError) {
          console.warn(`[StorageService] Skipping corrupted key during export: ${fullKey}`);
          data[logicalKey] = null;
        }
      }
    }
  } catch (error) {
    console.warn('[StorageService] Error accessing localStorage during export.', error);
  }
  return data;
}

/**
 * Imports data from a plain object.
 * Keys in the input object should be unprefixed; the prefix is applied automatically.
 * @param {Object} data - Object containing data to import
 * @throws {Error} If data is not a plain object.
 */
function importAll(data) {
  if (!isPlainObject(data)) {
    throw new Error('[StorageService] Import failed: Provided data is not a plain object.');
  }

  for (const key of Object.keys(data)) {
    set(key, data[key]);
  }
}

export const StorageService = Object.freeze({
  get,
  set,
  remove,
  exportAll,
  importAll,
});
