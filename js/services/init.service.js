/**
 * Application initialization and migration logic.
 * Handles first-run setup and schema versioning.
 */

import { StorageService } from './storage.service.js';
import { AppConfig } from '../config/constants.js';
import { DEFAULT_SETTINGS, DEFAULT_CATEGORIES } from '../config/schema.js';
import { createUser } from '../models/user.model.js';
import { createCategory } from '../models/category.model.js';
import { Logger } from '../utils/logger.util.js';

/**
 * Initializes the application on first run.
 * Checks metadata. If missing or outdated, seeds defaults.
 */
export function initializeApp() {
  const metadata = StorageService.get('metadata');

  // 1. First Run
  if (!metadata) {
    const user = createUser({ defaultCurrency: AppConfig.DEFAULT_CURRENCY });
    StorageService.set('user', user);

    StorageService.set('settings', { ...DEFAULT_SETTINGS });

    // Map raw defaults through factory to inject IDs, timestamps, and system flags
    const categories = DEFAULT_CATEGORIES.map(rawCategory => {
      return createCategory({ ...rawCategory, isSystem: true });
    });
    StorageService.set('categories', categories);

    // Seed empty arrays for core data stores
    StorageService.set('wallets', []);
    StorageService.set('transactions', []);
    StorageService.set('budgets', []);
    StorageService.set('goals', []);

    const newMetadata = {
      version: AppConfig.VERSION,
      dbVersion: AppConfig.DB_VERSION,
      initialized: true,
      initializedAt: new Date().toISOString(),
    };
    StorageService.set('metadata', newMetadata);

    Logger.info('BOOT_FIRST_RUN', `First run initialized. DB version: ${AppConfig.DB_VERSION}`);
    return;
  }

  // 2. Existing DB, Version Match (Idempotent check)
  if (metadata.dbVersion === AppConfig.DB_VERSION) {
    Logger.info('BOOT_SEQUENCE_COMPLETE', `App initialized. DB version: ${metadata.dbVersion}`);
    return;
  }

  // 3. Migration Pathway
  if (metadata.dbVersion < AppConfig.DB_VERSION) {
    Logger.info('DB_MIGRATION_START', `Migrating DB from ${metadata.dbVersion} to ${AppConfig.DB_VERSION}`);
    
    // Future milestones will inject actual migration logic here based on version diffs.
    
    const updatedMetadata = { 
      ...metadata, 
      dbVersion: AppConfig.DB_VERSION 
    };
    StorageService.set('metadata', updatedMetadata);
    Logger.info('DB_MIGRATION_COMPLETE', 'Migration complete.');
    return;
  }
}