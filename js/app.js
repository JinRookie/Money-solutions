/**
 * Application Entry Point
 * Bootstraps the initialization sequence and temporary debug tools.
 */

import { initializeApp } from './services/init.service.js';
import { StorageService } from './services/storage.service.js';
import { WalletService } from './services/wallet.service.js';
import { LedgerService } from './services/ledger.service.js';
import { createTransaction } from './models/transaction.model.js';
import { TransactionType, AccountType, AppConfig } from './config/constants.js';
import { Logger } from './utils/logger.util.js';

document.addEventListener('DOMContentLoaded', () => {
  try {
    // Initialize logger first so all subsequent logs are structured and level-filtered
    Logger.init(AppConfig.LOG_LEVEL);

    initializeApp();
    Logger.info('BOOT_COMPLETE', 'Boot sequence complete.');

    // Temporary: Seed test data and validate services
    seedTestData();
    
    // Temporary: Output financial summary to console
    try {
      logFinancialSummary();
    } catch (err) {
      Logger.error('TEST_SUMMARY_FAILED', 'Service summary generation failed', err);
    }

    setupDebugPanel();
  } catch (err) {
    Logger.error('BOOT_FATAL_ERROR', 'Application failed to start', err);
    const appEl = document.getElementById('app');
    if (appEl) {
      appEl.innerHTML = `
        <div style="padding:2rem;text-align:center;color:var(--color-danger)">
          <h2>Failed to start MoneyManager</h2>
          <p>${err.message}</p>
        </div>
      `;
    }
  }
});

/**
 * Temporary test data seeder. Removed in Milestone 5.
 */
function seedTestData() {
  // Only seed if no wallets exist
  const wallets = StorageService.get('wallets') || [];
  if (wallets.length > 0) return;

  const cash = WalletService.create({ name: 'Cash Wallet', type: AccountType.CASH, openingBalance: 50000 });
  const bank = WalletService.create({ name: 'QNB Bank', type: AccountType.BANK, openingBalance: 200000 });

  // Fetch a real seeded category ID to avoid foreign key violations
  const categories = StorageService.get('categories') || [];
  const foodCategory = categories.find(c => c.name === 'Food') || categories[0];

  // Resilient check: Do not crash the whole app if categories are missing
  if (!foodCategory) {
    Logger.warn('TEST_SEED_MISSING_DATA', 'No seeded category found. Skipping test transaction.');
    return;
  }

  // Add a test transaction
  const transactions = StorageService.get('transactions') || [];
  const expense = createTransaction({
    type: TransactionType.EXPENSE,
    amount: 2500,
    walletId: cash.id,
    categoryId: foodCategory.id,
    note: 'Test lunch',
  });
  transactions.push(expense);
  StorageService.set('transactions', transactions);

  Logger.info('TEST_SEED_COMPLETE', 'Seeded test wallets and transactions', { wallets: [cash.name, bank.name] });
}

/**
 * Temporary console-based financial summary for verification. Removed in Milestone 5.
 */
function logFinancialSummary() {
  const wallets = WalletService.getAll();
  
  Logger.info('SUMMARY_WALLETS', '--- Wallet Balances ---');
  wallets.forEach(w => {
    const withBalance = WalletService.getWithBalance(w.id);
    Logger.info('SUMMARY_BALANCE', `${w.name}: QAR ${(withBalance.currentBalance / 100).toFixed(2)}`);
  });

  const netWorth = LedgerService.getNetWorth();
  Logger.info('SUMMARY_NET_WORTH', `Total Net Worth: QAR ${(netWorth / 100).toFixed(2)}`);

  const todayFlow = LedgerService.getTodayFlow();
  Logger.info('SUMMARY_TODAY_FLOW', `Today's Flow: +QAR ${(todayFlow.moneyIn / 100).toFixed(2)} / -QAR ${(todayFlow.moneyOut / 100).toFixed(2)}`);
}

/**
 * Wires up the temporary debug panel for Milestone 1.
 * Allows viewing all mm_ prefixed data and clearing storage on the fly.
 */
function setupDebugPanel() {
  const toggleBtn = document.getElementById('debug-toggle');
  const panel = document.getElementById('debug-panel');
  const output = document.getElementById('debug-output');
  const clearBtn = document.getElementById('debug-clear');

  if (!toggleBtn || !panel || !output || !clearBtn) {
    Logger.warn('DEBUG_PANEL_MISSING', 'Debug panel elements not found in DOM.');
    return;
  }

  /**
   * Reads current state from StorageService and updates the debug output.
   */
  function renderDebugData() {
    const data = StorageService.exportAll();
    output.textContent = JSON.stringify(data, null, 2);
  }

  // Toggle panel visibility and refresh data on open
  toggleBtn.addEventListener('click', () => {
    const isVisible = panel.style.display === 'block';
    panel.style.display = isVisible ? 'none' : 'block';
    
    if (!isVisible) {
      renderDebugData();
    }
  });

  // Clear storage using the abstraction, re-initialize, and refresh display
  clearBtn.addEventListener('click', () => {
    try {
      StorageService.clearAll(); // Scoped clear using abstraction
      initializeApp();          // Re-seed fresh data 
      renderDebugData();        // Show the newly seeded state
      Logger.info('DEBUG_FACTORY_RESET', 'Storage cleared and app re-initialized.');
    } catch (err) {
      Logger.error('DEBUG_RESET_FAILED', 'Failed to reset application state', err);
      renderDebugData(); // Still try to show whatever state is left
    }
  });
}
