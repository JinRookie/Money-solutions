import { generateUUID } from '../utils/id.util.js';
import { isNonEmptyString, isValidAmount } from '../utils/validators.util.js';
import { AccountType } from '../config/constants.js';
import { toISODate } from '../utils/formatters.util.js';

const WALLET_ICONS = {
  [AccountType.CASH]: 'payments',
  [AccountType.BANK]: 'account_balance',
  [AccountType.DEBIT_CARD]: 'credit_card',
  [AccountType.CREDIT_CARD]: 'credit_score',
  [AccountType.MOBILE_MONEY]: 'phone_android',
  [AccountType.SAVINGS]: 'savings',
  [AccountType.INVESTMENT]: 'trending_up',
  [AccountType.CRYPTO]: 'currency_bitcoin',
};

/**
 * Creates a validated Wallet object.
 * @param {Object} props
 * @param {string} props.name
 * @param {string} props.type
 * @param {string} [props.currency='QAR']
 * @param {number} [props.openingBalance=0]
 * @param {string} [props.openingBalanceDate]
 * @returns {Object}
 */
export function createWallet(props = {}) {
  if (!isNonEmptyString(props.name)) {
    throw new Error('[Wallet] Invalid name: Must be a non-empty string.');
  }

  if (!Object.values(AccountType).includes(props.type)) {
    throw new Error(`[Wallet] Invalid type: ${props.type}. Must be a valid AccountType.`);
  }

  if (props.openingBalance !== undefined && !isValidAmount(props.openingBalance)) {
    throw new Error(`[Wallet] Invalid openingBalance: ${props.openingBalance}. Must be a non-negative safe integer.`);
  }

  const now = new Date().toISOString();

  return {
    id: generateUUID(),
    name: props.name.trim(),
    type: props.type,
    currency: props.currency || 'QAR',
    openingBalance: props.openingBalance || 0,
openingBalanceDate: props.openingBalanceDate || toISODate(),
includeInNetWorth: props.includeInNetWorth !== undefined ? props.includeInNetWorth : true,
isActive: props.isActive !== undefined ? props.isActive : true,
icon: WALLET_ICONS[props.type] || 'account_balance_wallet',
color: props.color || '#1E88E5',
createdAt: now,
updatedAt: now,
