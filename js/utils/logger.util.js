/**
 * Logger Utility
 * Provides structured, level-aware logging.
 * Zero internal dependencies to prevent circular import crashes.
 * State is cached at boot via init() to avoid repeated evaluations.
 */

// Internal state (not exposed on frozen export)
let currentLevel = 'INFO';

const LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

/**
 * Initializes the logger with a specific log level.
 * Must be called once at boot. Subsequent calls update the level.
 * @param {string} level - 'DEBUG' | 'INFO' | 'WARN' | 'ERROR'
 */
function init(level) {
  if (LEVELS[level] !== undefined) {
    currentLevel = level;
  } else {
    console.warn(`[Logger] Invalid log level: ${level}. Defaulting to INFO.`);
    currentLevel = 'INFO';
  }
}

/**
 * Internal routing logic.
 * @param {string} level 
 * @param {string} code - Structured event code (e.g., 'BOOT_COMPLETE')
 * @param {string} message 
 * @param {*} [data] - Optional extra data to log
 */
function _log(level, code, message, data) {
  if (LEVELS[level] < LEVELS[currentLevel]) return;

  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level}] [${code}]`;

  if (level === 'ERROR') {
    console.error(prefix, message, data !== undefined ? data : '');
  } else if (level === 'WARN') {
    console.warn(prefix, message, data !== undefined ? data : '');
  } else {
    console.log(prefix, message, data !== undefined ? data : '');
  }
}

/**
 * Logs a DEBUG level message.
 * @param {string} code 
 * @param {string} message 
 * @param {*} [data] 
 */
function debug(code, message, data) {
  _log('DEBUG', code, message, data);
}

/**
 * Logs an INFO level message.
 * @param {string} code 
 * @param {string} message 
 * @param {*} [data] 
 */
function info(code, message, data) {
  _log('INFO', code, message, data);
}

/**
 * Logs a WARN level message.
 * @param {string} code 
 * @param {string} message 
 * @param {*} [data] 
 */
function warn(code, message, data) {
  _log('WARN', code, message, data);
}

/**
 * Logs an ERROR level message.
 * @param {string} code 
 * @param {string} message 
 * @param {*} [data] 
 */
function error(code, message, data) {
  _log('ERROR', code, message, data);
}

export const Logger = Object.freeze({
  init,
  debug,
  info,
  warn,
  error,
});
