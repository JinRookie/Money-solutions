import { generateUUID } from '../utils/id.util.js';
import { isNonEmptyString } from '../utils/validators.util.js';

const ALLOWED_TYPES = ['income', 'expense', 'transfer'];

/**
 * Creates a validated Category object.
 * @param {Object} props
 * @param {string} props.name
 * @param {string} props.type
 * @returns {Object}
 */
export function createCategory(props = {}) {
  if (!isNonEmptyString(props.name)) {
    throw new Error('[Category] Invalid name: Must be a non-empty string.');
  }

  if (!ALLOWED_TYPES.includes(props.type)) {
    throw new Error(`[Category] Invalid type: ${props.type}. Must be 'income', 'expense', or 'transfer'.`);
  }

  return {
    id: generateUUID(),
    name: props.name.trim(),
    type: props.type,
    parentId: props.parentId || null,
    icon: props.icon || 'label',
    color: props.color || '#9E9E9E',
    isSystem: props.isSystem || false,
    budgetEligible: props.budgetEligible !== undefined ? props.budgetEligible : true,
    isActive: props.isActive !== undefined ? props.isActive : true,
    sortOrder: props.sortOrder || 0,
    createdAt: new Date().toISOString(),
  };
}
