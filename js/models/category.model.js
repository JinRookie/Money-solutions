import { generateUUID } from '../utils/id.util.js';
import { isNonEmptyString } from '../utils/validators.util.js';
import { CategoryType } from '../config/constants.js';

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
  
if (!Object.values(CategoryType).includes(props.type)) {
  throw new Error(`[Category] Invalid type: ${props.type}. Must be a valid CategoryType.`);
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
