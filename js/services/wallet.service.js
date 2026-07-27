/**
 * Wallet Service
 * CRUD operations for wallets. Balance queries delegated to LedgerService.
 */

import { StorageService } from './storage.service.js';
import { LedgerService } from './ledger.service.js';
import { createWallet } from '../models/wallet.model.js';
import { isNonEmptyString, hasOnlyAllowedKeys } from '../utils/validators.util.js';

const ALLOWED_UPDATE_KEYS = ['name', 'icon', 'color', 'includeInNetWorth'];
const IMMUTABLE_KEYS = ['id', 'type', 'currency', 'openingBalance', 'openingBalanceDate', 'createdAt', 'updatedAt'];

/**
 * Creates and persists a new wallet.
 * @param {Object} props - Passed to createWallet factory
 * @returns {Object} The created wallet
 */
function create(props) {
  const wallet = createWallet(props);
  const wallets = StorageService.get('wallets') || [];
  wallets.push(wallet);
  StorageService.set('wallets', wallets);
  return wallet;
}

/**
 * Retrieves all active wallets.
 * @returns {Array}
 */
function getAll() {
  const wallets = StorageService.get('wallets') || [];
  return wallets
    .filter(w => w.isActive)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}

/**
 * Retrieves a single wallet by ID.
 * @param {string} id
 * @returns {Object|null}
 */
function getById(id) {
  const wallets = StorageService.get('wallets') || [];
  return wallets.find(w => w.id === id) || null;
}

/**
 * Retrieves a wallet with its computed current balance.
 * @param {string} id
 * @returns {Object|null} Wallet object with added `currentBalance` field
 */
function getWithBalance(id) {
  const wallet = getById(id);
  if (!wallet) return null;

  const currentBalance = LedgerService.getWalletBalance(id);
  
  // Return a new object to avoid mutating the stored wallet state
  return { ...wallet, currentBalance };
}

/**
 * Archives a wallet (soft delete). Prevents new transactions but preserves history.
 * @param {string} id
 * @returns {Object} Updated wallet
 */
function archive(id) {
  const wallets = StorageService.get('wallets') || [];
  const index = wallets.findIndex(w => w.id === id);
  
  if (index === -1) {
    throw new Error(`[WalletService] Wallet not found: ${id}`);
  }

  const now = new Date().toISOString();
  wallets[index] = { 
    ...wallets[index], 
    isActive: false, 
    updatedAt: now 
  };
  
  StorageService.set('wallets', wallets);
  return wallets[index];
}

/**
 * Reactivates an archived wallet.
 * @param {string} id
 * @returns {Object} Updated wallet
 */
function reactivate(id) {
  const wallets = StorageService.get('wallets') || [];
  const index = wallets.findIndex(w => w.id === id);
  
  if (index === -1) {
    throw new Error(`[WalletService] Wallet not found: ${id}`);
  }

  const now = new Date().toISOString();
  wallets[index] = { 
    ...wallets[index], 
    isActive: true, 
    updatedAt: now 
  };
  
  StorageService.set('wallets', wallets);
  return wallets[index];
}

/**
 * Updates wallet properties. Only non-financial fields allowed.
 * @param {string} id
 * @param {Object} updates - Allowed: name, icon, color, includeInNetWorth
 * @returns {Object} Updated wallet
 */
function update(id, updates) {
  if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
    throw new Error('[WalletService] Invalid updates object.');
  }

  // Check for immutable keys first to provide specific error messages
  const forbiddenKeys = Object.keys(updates).filter(key => IMMUTABLE_KEYS.includes(key));
  if (forbiddenKeys.length > 0) {
    throw new Error(`[WalletService] Cannot update immutable field(s): ${forbiddenKeys.join(', ')}`);
  }

  // Check for completely invalid keys
  if (!hasOnlyAllowedKeys(updates, ALLOWED_UPDATE_KEYS)) {
    throw new Error(`[WalletService] Invalid update field(s): ${Object.keys(updates).join(', ')}`);
  }

  // Validate and sanitize specific field constraints
  if (updates.name !== undefined) {
    updates.name = updates.name.trim();
    if (!isNonEmptyString(updates.name)) {
      throw new Error('[WalletService] Invalid name: Must be a non-empty string.');
    }
  }

  const wallets = StorageService.get('wallets') || [];
  const index = wallets.findIndex(w => w.id === id);
  
  if (index === -1) {
    throw new Error(`[WalletService] Wallet not found: ${id}`);
  }

  const now = new Date().toISOString();
  wallets[index] = { 
    ...wallets[index], 
    ...updates, 
    updatedAt: now 
  };
  
  StorageService.set('wallets', wallets);
  return wallets[index];
}

export const WalletService = Object.freeze({
  create,
  getAll,
  getById,
  getWithBalance,
  archive,
  reactivate,
  update,
});
