/**
 * Application Roles & Permissions
 * Role-based access control configuration
 */

export const ROLES = {
  ADMIN: 'admin',
  PUBLISHER: 'publisher',
  USER: 'user',
  GUEST: 'guest',
};

export const PERMISSIONS = {
  // Article permissions
  CREATE_ARTICLE: ['admin', 'publisher'],
  EDIT_ARTICLE: ['admin', 'publisher'],
  DELETE_ARTICLE: ['admin'],
  PUBLISH_ARTICLE: ['admin', 'publisher'],
  
  // User management
  MANAGE_USERS: ['admin'],
  VIEW_USERS: ['admin'],
  DELETE_USER: ['admin'],
  
  // Settings
  MANAGE_SETTINGS: ['admin'],
  VIEW_ANALYTICS: ['admin'],
  
  // Common
  READ_ARTICLE: ['admin', 'publisher', 'user', 'guest'],
  BOOKMARK_ARTICLE: ['admin', 'publisher', 'user'],
};

/**
 * Check if user has permission
 * @param {string} userRole - User's role
 * @param {string} permission - Required permission
 * @returns {boolean} True if user has permission
 */
export const hasPermission = (userRole, permission) => {
  const requiredRoles = PERMISSIONS[permission] || [];
  return requiredRoles.includes(userRole);
};

/**
 * Check if user is admin
 * @param {string} userRole - User's role
 * @returns {boolean} True if user is admin
 */
export const isAdmin = (userRole) => userRole === ROLES.ADMIN;

/**
 * Check if user can publish
 * @param {string} userRole - User's role
 * @returns {boolean} True if user can publish
 */
export const canPublish = (userRole) => {
  return [ROLES.ADMIN, ROLES.PUBLISHER].includes(userRole);
};
