import { generateUUID } from '../utils/id.util.js';
import { isNonEmptyString, isValidAmount, isValidISODate } from '../utils/validators.util.js';
import { BudgetPeriod } from '../config/constants.js';

/**
 * Creates a validated Budget object.
 * @param {Object} props
 * @param {string} props.name
 * @param {number} props.amount
 * @param {string} props.period
 * @param {string} props.startDate
 * @param {string} props.endDate
 * @returns {Object}
 */
export function createBudget(props = {}) {
  if (!isNonEmptyString(props.name)) {
    throw new Error('[Budget] Invalid name: Must be a non-empty string.');
  }

  if (!isValidAmount(props.amount)) {
    throw new Error(`[Budget] Invalid amount: ${props.amount}. Must be a non-negative safe integer.`);
  }

  if (!Object.values(BudgetPeriod).includes(props.period)) {
    throw new Error(`[Budget] Invalid period: ${props.period}. Must be a valid BudgetPeriod.`);
  }

  if (!isValidISODate(props.startDate)) {
    throw new Error(`[Budget] Invalid startDate: ${props.startDate}. Must be a valid ISO date (YYYY-MM-DD).`);
  }

  if (!isValidISODate(props.endDate)) {
    throw new Error(`[Budget] Invalid endDate: ${props.endDate}. Must be a valid ISO date (YYYY-MM-DD).`);
  }

  if (new Date(props.startDate) > new Date(props.endDate)) {
    throw new Error('[Budget] Invalid dates: startDate must be before or equal to endDate.');
  }

  return {
    id: generateUUID(),
    name: props.name.trim(),
    amount: props.amount,
    currency: props.currency || 'QAR',
    period: props.period,
    startDate: props.startDate,
    endDate: props.endDate,
    categoryIds: props.categoryIds || [],
    walletIds: props.walletIds || ['all'],
    alertThresholds: props.alertThresholds || [80, 100],
    isRecurring: props.isRecurring || false,
    autoRenew: props.autoRenew !== undefined ? props.autoRenew : true,
    status: props.status || 'active',
    createdAt: new Date().toISOString(),
  };
}
