/**
 * Application Entry Point
 * Bootstraps the initialization sequence and temporary debug tools.
 */

import { initializeApp } from './services/init.service.js';

document.addEventListener('DOMContentLoaded', () => {
  try {
    initializeApp();
    console.log('[MoneyManager] Boot sequence complete.');

    // Temporary debug panel wiring (Milestone 1 only)
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
 * Temporary debug panel logic.
 * Stub defined here to prevent ReferenceErrors during boot.
 * Implementation is injected in the next commit.
 */
function setupDebugPanel() {
  // Stub - will be implemented in Commit 7
}
