/**
 * Server Constants & Configuration
 * Global constants for server operations
 */

// OTP Configuration
export const OTP_CONFIG = {
  LENGTH: 6,
  EXPIRATION_MINUTES: 5,
  MAX_ATTEMPTS: 3,
};

// JWT Configuration
export const JWT_CONFIG = {
  SECRET: process.env.JWT_SECRET || 'your-secret-key',
  EXPIRATION: '7d', // 7 days
  REFRESH_EXPIRATION: '30d', // 30 days
};

// Rate Limiting Configuration
export const RATE_LIMIT_CONFIG = {
  LOGIN_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  LOGIN_MAX_ATTEMPTS: 5,
  REGISTER_WINDOW_MS: 60 * 60 * 1000, // 1 hour
  REGISTER_MAX_ATTEMPTS: 3,
  FORGOT_PASSWORD_WINDOW_MS: 60 * 60 * 1000, // 1 hour
  FORGOT_PASSWORD_MAX_ATTEMPTS: 3,
};

// File Upload Configuration
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FORMATS: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  UPLOAD_DIR: 'uploads',
  IMAGE_COMPRESSION_QUALITY: 80,
  IMAGE_MAX_WIDTH: 1920,
  IMAGE_MAX_HEIGHT: 1080,
};

// Pagination Configuration
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 30,
  MAX_LIMIT: 100,
};

// Email Configuration
export const EMAIL_CONFIG = {
  FROM_EMAIL: process.env.EMAIL_USER || 'noreply@newsportal.com',
  OTP_SUBJECT: 'Verify Your Email - News Portal',
  RESET_PASSWORD_SUBJECT: 'Reset Your Password - News Portal',
  WELCOME_SUBJECT: 'Welcome to News Portal',
};

// Categories
export const ARTICLE_CATEGORIES = [
  'ExamAlert',
  'Scholarships',
  'Guidelines',
  'Internships',
  'Results',
];

// Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  PUBLISHER: 'publisher',
  USER: 'user',
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

// Error Messages
export const ERROR_MESSAGES = {
  INVALID_EMAIL: 'Invalid email format',
  EMAIL_EXISTS: 'Email already registered',
  INVALID_PASSWORD: 'Invalid password format',
  INVALID_OTP: 'Invalid or expired OTP',
  INVALID_TOKEN: 'Invalid or expired token',
  UNAUTHORIZED: 'Unauthorized access',
  NOT_FOUND: 'Resource not found',
  INTERNAL_ERROR: 'Internal server error',
  FILE_TOO_LARGE: 'File size exceeds maximum limit',
  INVALID_FILE_TYPE: 'Invalid file type',
};
