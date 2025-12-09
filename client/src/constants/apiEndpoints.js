/**
 * API Configuration & Constants
 * Centralized API endpoint definitions
 */

export const API_ENDPOINTS = {
  // Articles
  ARTICLES: '/api/articles',
  ARTICLE_BY_ID: (id) => `/api/articles/${id}`,
  
  // Users & Auth
  REGISTER: '/api/users/register',
  LOGIN: '/api/users/login',
  VERIFY_OTP: '/api/users/verify-otp',
  FORGOT_PASSWORD: '/api/users/forgot-password',
  RESET_PASSWORD: '/api/users/reset-password',
  VERIFY_TOKEN: (token) => `/api/users/verify-token/${token}`,
  GET_USER: '/api/users/me',
  
  // Bookmarks
  BOOKMARKS: '/api/bookmarks',
  BOOKMARK_BY_ID: (id) => `/api/bookmarks/${id}`,
  
  // Search
  SEARCH: '/api/search',
  
  // Upload
  UPLOAD: '/api/upload',
  
  // Submissions
  SUBMISSIONS: '/api/submissions',
  
  // Events
  EVENTS: '/api/events',
};

// API Configuration
export const API_CONFIG = {
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};
