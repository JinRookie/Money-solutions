/**
 * Ledger Service
 * Computes running balances and financial aggregates from the transaction ledger.
 * Read-only. Never writes to storage.
 */

import { StorageService } from './storage.service.js';
import { TransactionType } from '../config/constants.js';
import { toISODate } from '../utils/formatters.util.js';

/**
 * Retrieves all non-deleted transactions. Internal helper.
 * @returns {Array}
 */
function getActiveTransactions() {
  return (StorageService.get('transactions') || []).filter(t => !t.isDeleted);
}

/**
 * Computes the current balance of a single wallet.
 * Formula: openingBalance + income - expenses + incoming transfers - outgoing transfers
 * Designed with options pattern for future historical balance queries.
 * @param {string} walletId
 * @param {Object} [options={}]
 * @param {string} [options.asOfDate] - ISO date to compute balance up to (Future Phase 3)
 * @returns {number} Balance in smallest currency unit
 */
function getWalletBalance(walletId, { asOfDate } = {}) {
  const wallets = StorageService.get('wallets') || [];
  const wallet = wallets.find(w => w.id === walletId);
  
  if (!wallet) {
    throw new Error(`[LedgerService] Wallet not found: ${walletId}`);
  }

  let transactions = getActiveTransactions();

  // Future-proofing: allow calculating balance as of a specific date
  if (asOfDate) {
    transactions = transactions.filter(t => t.date <= asOfDate);
  }

  let balance = wallet.openingBalance;

  for (const t of transactions) {
    if (t.type === TransactionType.INCOME && t.walletId === walletId) {
      balance += t.amount;
    } else if (t.type === TransactionType.EXPENSE && t.walletId === walletId) {
      balance -= t.amount;
    } else if (t.type === TransactionType.TRANSFER) {
      if (t.walletId === walletId) {
        balance -= t.amount; // Outgoing transfer
      }
      if (t.destinationWalletId === walletId) {
        balance += t.amount; // Incoming transfer
      }
    }
  }

  return balance;
}

/**
 * Computes total income for a wallet within a date range.
 * @param {string} walletId
 * @param {string} [startDate] - ISO date, inclusive
 * @param {string} [endDate] - ISO date, inclusive
 * @returns {number}
 */
function getWalletIncome(walletId, startDate, endDate) {
  return getActiveTransactions()
    .filter(t => 
      t.type === TransactionType.INCOME && 
      t.walletId === walletId &&
      (!startDate || t.date >= startDate) &&
      (!endDate || t.date <= endDate)
    )
    .reduce((sum, t) => sum + t.amount, 0);
}

/**
 * Computes total expenses for a wallet within a date range.
 * @param {string} walletId
 * @param {string} [startDate]
 * @param {string} [endDate]
 * @returns {number}
 */
function getWalletExpenses(walletId, startDate, endDate) {
  return getActiveTransactions()
    .filter(t => 
      t.type === TransactionType.EXPENSE && 
      t.walletId === walletId &&
      (!startDate || t.date >= startDate) &&
      (!endDate || t.date <= endDate)
    )
    .reduce((sum, t) => sum + t.amount, 0);
}

/**
 * Computes total incoming transfers for a wallet.
 * @param {string} walletId
 * @returns {number}
 */
function getIncomingTransfers(walletId) {
  return getActiveTransactions()
    .filter(t => 
      t.type === TransactionType.TRANSFER && 
      t.destinationWalletId === walletId
    )
    .reduce((sum, t) => sum + t.amount, 0);
}

/**
 * Computes total outgoing transfers for a wallet.
 * @param {string} walletId
 * @returns {number}
 */
function getOutgoingTransfers(walletId) {
  return getActiveTransactions()
    .filter(t => 
      t.type === TransactionType.TRANSFER && 
      t.walletId === walletId
    )
    .reduce((sum, t) => sum + t.amount, 0);
}

/**
 * Computes the net worth: sum of balances of all wallets where includeInNetWorth is true.
 * @returns {number}
 */
function getNetWorth() {
  const wallets = (StorageService.get('wallets') || []).filter(w => w.includeInNetWorth);
  
  return wallets.reduce((totalNetWorth, wallet) => {
    return totalNetWorth + getWalletBalance(wallet.id);
  }, 0);
}

/**
 * Computes today's money in and money out across all wallets.
 * @returns {{moneyIn: number, moneyOut: number}}
 */
function getTodayFlow() {
  const today = toISODate();
  const transactions = getActiveTransactions().filter(t => t.date === today);

  const moneyIn = transactions
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((sum, t) => sum + t.amount, 0);

  const moneyOut = transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((sum, t) => sum + t.amount, 0);

  return { moneyIn, moneyOut };
}

export const LedgerService = Object.freeze({
  getWalletBalance,
  getWalletIncome,
  getWalletExpenses,
  getIncomingTransfers,
  getOutgoingTransfers,
  getNetWorth,
  getTodayFlow,
});
