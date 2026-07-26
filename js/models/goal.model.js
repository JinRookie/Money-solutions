import { generateUUID } from '../utils/id.util.js';
import { isNonEmptyString, isValidAmount, isValidISODate } from '../utils/validators.util.js';

/**
 * Creates a validated Goal object.
 * @param {Object} props
 * @param {string} props.name
 * @param {number} props.targetAmount
 * @param {string} props.deadline
 * @param {number} [props.currentAmount=0]
 * @returns {Object}
 */
export function createGoal(props = {}) {
  if (!isNonEmptyString(props.name)) {
    throw new Error('[Goal] Invalid name: Must be a non-empty string.');
  }

  if (!isValidAmount(props.targetAmount) || props.targetAmount <= 0) {
    throw new Error(`[Goal] Invalid targetAmount: ${props.targetAmount}. Must be a safe integer > 0.`);
  }

  if (!isValidISODate(props.deadline)) {
    throw new Error(`[Goal] Invalid deadline: ${props.deadline}. Must be a valid ISO date (YYYY-MM-DD).`);
  }

  const currentAmount = props.currentAmount || 0;

  if (!isValidAmount(currentAmount)) {
    throw new Error(`[Goal] Invalid currentAmount: ${currentAmount}. Must be a safe integer >= 0.`);
  }

  if (currentAmount > props.targetAmount) {
    throw new Error(`[Goal] Invalid state: currentAmount (${currentAmount}) cannot exceed targetAmount (${props.targetAmount}).`);
  }

  return {
    id: generateUUID(),
    name: props.name.trim(),
    targetAmount: props.targetAmount,
    currentAmount: currentAmount,
    walletId: props.walletId || null,
    deadline: props.deadline,
    status: props.status || 'active',
    createdAt: new Date().toISOString(),
  };
}
