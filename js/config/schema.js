import { AppConfig, AccountType, TransactionType, BudgetPeriod } from './constants.js';

/**
 * Storage key mappings. Centralized to prevent typos.
 */
export const STORE_KEYS = Object.freeze({
  METADATA: `${AppConfig.STORAGE_PREFIX}metadata`,
  USER: `${AppConfig.STORAGE_PREFIX}user`,
  WALLETS: `${AppConfig.STORAGE_PREFIX}wallets`,
  TRANSACTIONS: `${AppConfig.STORAGE_PREFIX}transactions`,
  CATEGORIES: `${AppConfig.STORAGE_PREFIX}categories`,
  BUDGETS: `${AppConfig.STORAGE_PREFIX}budgets`,
  GOALS: `${AppConfig.STORAGE_PREFIX}goals`,
  SETTINGS: `${AppConfig.STORAGE_PREFIX}settings`,
});

/**
 * Default application settings.
 */
export const DEFAULT_SETTINGS = Object.freeze({
  defaultCurrency: AppConfig.DEFAULT_CURRENCY,
  locale: AppConfig.DEFAULT_LOCALE,
  timezone: AppConfig.DEFAULT_TIMEZONE,
  theme: 'light',
  notifications: true,
  dateFormat: 'DD/MM/YYYY',
  weekStartsOn: 'Monday',
  pinEnabled: false,
  pinHash: null,
});

/**
 * Default system categories seeded on first run.
 * These are immutable system defaults. Users can add their own later.
 */
export const DEFAULT_CATEGORIES = Object.freeze([
  // Expense categories
  { name: 'Food', type: 'expense', icon: 'restaurant', color: '#FF6B35', sortOrder: 1 },
  { name: 'Transport', type: 'expense', icon: 'directions_car', color: '#1E88E5', sortOrder: 2 },
  { name: 'Shopping', type: 'expense', icon: 'shopping_bag', color: '#8E24AA', sortOrder: 3 },
  { name: 'Rent', type: 'expense', icon: 'home', color: '#E53935', sortOrder: 4 },
  { name: 'Entertainment', type: 'expense', icon: 'movie', color: '#FDD835', sortOrder: 5 },
  { name: 'Healthcare', type: 'expense', icon: 'local_hospital', color: '#43A047', sortOrder: 6 },
  { name: 'Education', type: 'expense', icon: 'school', color: '#00ACC1', sortOrder: 7 },
  { name: 'Utilities', type: 'expense', icon: 'bolt', color: '#FB8C00', sortOrder: 8 },
  { name: 'Fuel', type: 'expense', icon: 'local_gas_station', color: '#6D4C41', sortOrder: 9 },
  { name: 'Other', type: 'expense', icon: 'more_horiz', color: '#9E9E9E', sortOrder: 10 },

  // Income categories
  { name: 'Salary', type: 'income', icon: 'payments', color: '#43A047', sortOrder: 11 },
  { name: 'Business', type: 'income', icon: 'business_center', color: '#1E88E5', sortOrder: 12 },
  { name: 'Freelance', type: 'income', icon: 'laptop', color: '#8E24AA', sortOrder: 13 },
  { name: 'Gift', type: 'income', icon: 'card_giftcard', color: '#FDD835', sortOrder: 14 },
  { name: 'Refund', type: 'income', icon: 'replay', color: '#00ACC1', sortOrder: 15 },
  { name: 'Investment', type: 'income', icon: 'trending_up', color: '#6D4C41', sortOrder: 16 },
]);
