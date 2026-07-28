/**
 * Application Entry Point
 * Bootstraps the initialization sequence and temporary debug tools.
 */

import { initializeApp } from './services/init.service.js';
import { StorageService } from './services/storage.service.js';
import { WalletService } from './services/wallet.service.js';
import { LedgerService } from './services/ledger.service.js';
import { createTransaction } from './models/transaction.model.js';
import { TransactionType, AccountType } from './config/constants.js';

document.addEventListener('DOMContentLoaded', () => {
  try {
    initializeApp();
    console.info('[MoneyManager] Boot sequence complete.');

    // Temporary: Seed test data and validate services
    seedTestData();
    
    // Isolate tests so they never crash the user-facing app
    try {
      runServiceTests();
    } catch (err) {
      console.error('[MoneyManager] Service tests failed:', err);
    }

    setupDebugPanel();
  } catch (err) {
    console.error('[MoneyManager] Boot failed:', err);
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

  // Explicit guard to ensure we have a valid category before creating a transaction
  if (!foodCategory) {
    throw new Error('[TestData] No seeded category found. Cannot create test transaction.');
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

  console.info('[TestData] Seeded:', cash.name, bank.name);
}

/**
 * Temporary service validation. Removed in Milestone 5.
 */
function runServiceTests() {
  const wallets = WalletService.getAll();
  wallets.forEach(w => {
    const withBalance = WalletService.getWithBalance(w.id);
    console.info(`[Test] ${w.name}: QAR ${withBalance.currentBalance / 100}`);
  });

  const netWorth = LedgerService.getNetWorth();
  console.info(`[Test] Net Worth: QAR ${netWorth / 100}`);

  const todayFlow = LedgerService.getTodayFlow();
  console.info(`[Test] Today: +${todayFlow.moneyIn / 100}, -${todayFlow.moneyOut / 100}`);
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
    console.warn('[MoneyManager] Debug panel elements not found in DOM.');
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

  // Clear storage, re-initialize to simulate fresh install, and refresh display
  clearBtn.addEventListener('click', () => {
    localStorage.clear(); // Nuclear clear as per M1 spec
    initializeApp();      // Re-seed fresh data (buddy's improvement)
    renderDebugData();    // Show the newly seeded state
  });
}
