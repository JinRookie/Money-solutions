/**
 * UUID and identifier generation utilities.
 */

/**
 * Generates an RFC4122 v4 UUID.
 * Uses crypto.randomUUID when available, falls back to manual generation.
 * @returns {string}
 */
export function generateUUID() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  
  // Fallback using crypto.getRandomValues (preferred over Math.random)
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const buffer = new Uint8Array(16);
    crypto.getRandomValues(buffer);
    // Set version 4 bits
    buffer[6] = (buffer[6] & 0x0f) | 0x40;
    // Set variant 10 bits
    buffer[8] = (buffer[8] & 0x3f) | 0x80;
    
    const hex = Array.from(buffer, b => b.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }
  
  // Last resort Math.random fallback for very old environments
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Generates a human-readable transaction reference number.
 * Format: TXN-YYYYMMDD-XXXXXX (6-digit zero-padded random)
 * @returns {string}
 */
export function generateTxnNumber() {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  const random = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
  
  return `TXN-${year}${month}${day}-${random}`;
}
