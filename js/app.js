/**
 * Application Entry Point
 * Bootstraps the initialization sequence and temporary debug tools.
 */

import { initializeApp } from './services/init.service.js';
import { StorageService } from './services/storage.service.js';

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

  // Clear all storage and refresh the display
  clearBtn.addEventListener('click', () => {
    // Manager specified explicit localStorage.clear() for this debug tool
    localStorage.clear();
    renderDebugData();
  });
}
