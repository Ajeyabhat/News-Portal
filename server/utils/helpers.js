/**
 * Helper Functions & Utilities
 * Reusable utility functions for validation, formatting, etc.
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} Validation result with isValid and message
 */
export const validatePassword = (password) => {
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters' };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain uppercase letters' };
  }
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must contain lowercase letters' };
  }
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'Password must contain numbers' };
  }
  return { isValid: true, message: 'Password is strong' };
};

/**
 * Generate OTP code (6 digits)
 * @returns {string} OTP code
 */
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Get OTP expiration time (5 minutes from now)
 * @returns {Date} Expiration timestamp
 */
export const getOTPExpiration = () => {
  const now = new Date();
  return new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes
};

/**
 * Check if OTP is expired
 * @param {Date} expirationTime - OTP expiration time
 * @returns {boolean} True if expired
 */
export const isOTPExpired = (expirationTime) => {
  return new Date() > new Date(expirationTime);
};

/**
 * Sanitize user input
 * @param {string} input - User input
 * @returns {string} Sanitized input
 */
export const sanitizeInput = (input) => {
  return input.trim().replace(/<[^>]*>/g, '');
};

/**
 * Format date to readable string
 * @param {Date} date - Date to format
 * @returns {string} Formatted date
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Calculate reading time (in minutes)
 * @param {string} content - Article content
 * @returns {number} Estimated reading time in minutes
 */
export const calculateReadingTime = (content) => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

/**
 * Validate MongoDB ObjectId
 * @param {string} id - ID to validate
 * @returns {boolean} True if valid ObjectId
 */
export const isValidMongoId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

/**
 * Generate unique filename
 * @param {string} extension - File extension
 * @returns {string} Unique filename
 */
export const generateUniqueFilename = (extension) => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `${timestamp}-${random}.${extension}`;
};
