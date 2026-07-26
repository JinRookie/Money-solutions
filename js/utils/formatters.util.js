/**
 * Display formatting utilities.
 */

/**
 * Formats an integer amount into a human-readable currency string.
 * Amount is in smallest currency unit (e.g., 2550 = 25.50).
 * @param {number} amount
 * @param {string} [currency='QAR']
 * @returns {string}
 */
export function formatCurrency(amount, currency = 'QAR') {
  if (!Number.isSafeInteger(amount)) return `${currency} 0.00`;
  
  try {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      currencyDisplay: 'code',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    
    let formatted = formatter.format(amount / 100);
    // Ensure strict spacing: "QAR 25.50" instead of potential "QAR25.50"
    formatted = formatted.replace(/[A-Z]{3}/, match => `${match} `).trim();
    return formatted;
  } catch (e) {
    // Fallback for unsupported currencies in Intl
    const decimalAmount = (amount / 100).toFixed(2);
    const parts = decimalAmount.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `${currency} ${parts.join('.')}`;
  }
}

/**
 * Formats a date value to locale string.
 * @param {string|Date} value
 * @param {string} [locale='en-QA']
 * @returns {string}
 */
export function formatDate(value, locale = 'en-QA') {
  const date = value instanceof Date ? value : new Date(value);
  if (isNaN(date.getTime())) return 'Invalid Date';
  
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Formats a Date to ISO date string (YYYY-MM-DD).
 * Uses local time methods to prevent timezone/DST shifting bugs.
 * @param {Date} [date=new Date()]
 * @returns {string}
 */
export function toISODate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}
