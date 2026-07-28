/**
 * Application-wide constants and enumerations.
 * All enums are frozen to prevent accidental mutation.
 */

export const TransactionType = Object.freeze({
  INCOME: 'income',
  EXPENSE: 'expense',
  TRANSFER: 'transfer',
  REFUND: 'refund',
  ADJUSTMENT: 'adjustment',
});

export const AccountType = Object.freeze({
  CASH: 'cash',
  BANK: 'bank',
  DEBIT_CARD: 'debit_card',
  CREDIT_CARD: 'credit_card',
  MOBILE_MONEY: 'mobile_money',
  SAVINGS: 'savings',
  INVESTMENT: 'investment',
  CRYPTO: 'crypto',
});

export const BudgetPeriod = Object.freeze({
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
  CUSTOM: 'custom',
});

export const TransactionStatus = Object.freeze({
  COMPLETED: 'completed',
  PENDING: 'pending',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
});

export const BudgetStatus = Object.freeze({
  ACTIVE: 'active',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
});

export const GoalStatus = Object.freeze({
  ACTIVE: 'active',
  COMPLETED: 'completed',
});

export const CategoryType = Object.freeze({
  INCOME: 'income',
  EXPENSE: 'expense',
  TRANSFER: 'transfer',
});

export const AppConfig = Object.freeze({
  NAME: 'MoneyManager',
  VERSION: '1.0.0',
  DB_VERSION: 1,
  STORAGE_PREFIX: 'mm_',
  DEFAULT_CURRENCY: 'QAR',
  DEFAULT_LOCALE: 'en-QA',
  DEFAULT_TIMEZONE: 'Asia/Qatar',
  LOG_LEVEL: 'INFO', // DEBUG, INFO, WARN, ERROR
});
