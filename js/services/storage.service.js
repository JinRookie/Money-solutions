/**
 * Storage abstraction layer.
 * The ONLY module allowed to touch localStorage directly.
 */

import { AppConfig } from '../config/constants.js';
import { isPlainObject } from '../utils/validators.util.js';
import { Logger } from '../utils/logger.util.js';

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
      Logger.warn('STORAGE_CORRUPTED', `Corrupted data for key: ${PREFIX + key}`, error);
      return null;
    }
    Logger.warn('STORAGE_READ_ERROR', `Error reading key: ${PREFIX + key}`, error);
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
      Logger.error('STORAGE_QUOTA_EXCEEDED', `Cannot save ${key}`);
      throw new Error(`[StorageService] Storage quota exceeded. Cannot save ${key}.`);
    }
    
    if (error instanceof DOMException && error.name === 'SecurityError') {
      Logger.error('STORAGE_ACCESS_DENIED', `Cannot save ${key}. Is localStorage disabled?`);
      throw new Error(`[StorageService] Storage access denied. Cannot save ${key}. Is localStorage disabled?`);
    }

    Logger.error('STORAGE_UNKNOWN_ERROR', `Error saving ${key}: ${error.message}`, error);
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
    Logger.warn('STORAGE_REMOVE_ERROR', `Error removing key: ${PREFIX + key}`, error);
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
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const fullKey = localStorage.key(i);
      if (fullKey && fullKey.startsWith(PREFIX)) {
        keys.push(fullKey);
      }
    }

    keys.forEach(fullKey => {
      const logicalKey = fullKey.slice(PREFIX.length);
      try {
        data[logicalKey] = JSON.parse(localStorage.getItem(fullKey));
      } catch (parseError) {
        Logger.warn('STORAGE_CORRUPTED', `Skipping corrupted key during export: ${fullKey}`);
        data[logicalKey] = null;
      }
    });
  } catch (error) {
    Logger.warn('STORAGE_EXPORT_ERROR', 'Error accessing localStorage during export.', error);
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
    Logger.error('STORAGE_IMPORT_ERROR', 'Provided data is not a plain object.');
    throw new Error('[StorageService] Import failed: Provided data is not a plain object.');
  }

  for (const key of Object.keys(data)) {
    set(key, data[key]);
  }
}

/**
 * Removes all application-specific keys from localStorage.
 * Leaves non-mm_ keys untouched to avoid destroying data from other apps on the same origin.
 */
function clearAll() {
  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const fullKey = localStorage.key(i);
      if (fullKey && fullKey.startsWith(PREFIX)) {
        keysToRemove.push(fullKey);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    Logger.warn('STORAGE_CLEAR_ERROR', 'Error during scoped clear.', error);
  }
}

export const StorageService = Object.freeze({
  get,
  set,
  remove,
  exportAll,
  importAll,
  clearAll,
});
