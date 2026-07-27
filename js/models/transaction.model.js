import { generateUUID, generateTxnNumber } from '../utils/id.util.js';
import { isNonEmptyString, isValidAmount } from '../utils/validators.util.js';
import { TransactionType, TransactionStatus } from '../config/constants.js';
import { toISODate } from '../utils/formatters.util.js';

/**
 * Creates a validated Transaction object.
 * @param {Object} props
 * @param {string} props.type
 * @param {number} props.amount
 * @param {string} props.walletId
 * @param {string} props.categoryId
 * @param {string} [props.destinationWalletId]
 * @returns {Object}
 */
export function createTransaction(props = {}) {
  if (!Object.values(TransactionType).includes(props.type)) {
    throw new Error(`[Transaction] Invalid type: ${props.type}. Must be a valid TransactionType.`);
  }

  if (!isValidAmount(props.amount)) {
    throw new Error(`[Transaction] Invalid amount: ${props.amount}. Must be a non-negative safe integer.`);
  }

  if (!isNonEmptyString(props.walletId)) {
    throw new Error('[Transaction] Invalid walletId: Must be a non-empty string.');
  }

  if (!isNonEmptyString(props.categoryId)) {
    throw new Error('[Transaction] Invalid categoryId: Must be a non-empty string.');
  }

  // Transfer specific validations
  if (props.type === TransactionType.TRANSFER) {
    if (!isNonEmptyString(props.destinationWalletId)) {
      throw new Error('[Transaction] Invalid destinationWalletId: Required for transfers.');
    }
    if (props.walletId === props.destinationWalletId) {
      throw new Error('[Transaction] Invalid transfer: walletId and destinationWalletId cannot be the same.');
    }
  } else {
    if (props.destinationWalletId !== undefined && props.destinationWalletId !== null) {
      throw new Error(`[Transaction] Invalid destinationWalletId: Must be null for type '${props.type}'.`);
    }
  }

  const now = new Date();
  const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  return {
    id: generateUUID(),
    txnNumber: generateTxnNumber(),
    type: props.type,
    amount: props.amount,
    currency: props.currency || 'QAR',
    walletId: props.walletId,
    destinationWalletId: props.type === TransactionType.TRANSFER ? props.destinationWalletId : null,
    categoryId: props.categoryId,
    date: props.date || toISODate(now),
    time: props.time || timeString,
    timezone: props.timezone || 'Asia/Qatar',
    note: props.note || '',
    paymentMethod: paymentMethod: props.paymentMethod || 'cash', // Deferred: PaymentMethod enum pending Phase 2
    status: status: props.status || TransactionStatus.COMPLETED,
    isRecurring: props.isRecurring || false,
    recurringId: props.recurringId || null,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    importSource: props.importSource || 'manual',
    isDeleted: props.isDeleted || false,
  };
    }
