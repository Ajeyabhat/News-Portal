/**
 * UI Messages & Labels
 * Centralized message strings for UI components
 */

export const MESSAGES = {
  // Success Messages
  SUCCESS_LOGIN: 'Login successful! Welcome back.',
  SUCCESS_REGISTER: 'Registration successful! Please verify your email.',
  SUCCESS_BOOKMARK: 'Article bookmarked successfully!',
  SUCCESS_UNBOOKMARK: 'Bookmark removed.',
  SUCCESS_ARTICLE_CREATED: 'Article created successfully!',
  SUCCESS_ARTICLE_UPDATED: 'Article updated successfully!',
  SUCCESS_ARTICLE_DELETED: 'Article deleted successfully!',
  SUCCESS_PASSWORD_RESET: 'Password reset successfully! Please log in.',
  SUCCESS_OTP_VERIFIED: 'Email verified successfully!',
  
  // Error Messages
  ERROR_NETWORK: 'Network error. Please check your connection and try again.',
  ERROR_LOGIN_FAILED: 'Invalid email or password.',
  ERROR_EMAIL_EXISTS: 'Email already registered.',
  ERROR_PASSWORD_WEAK: 'Password must be at least 6 characters with uppercase, lowercase, and numbers.',
  ERROR_BOOKMARK: 'Error updating bookmark. Please try again.',
  ERROR_DELETE_ARTICLE: 'Error deleting article. Please try again.',
  ERROR_FETCH_ARTICLES: 'Failed to load articles. Please check your connection and try again.',
  ERROR_AUTH_REQUIRED: 'Please log in to perform this action.',
  ERROR_OTP_INVALID: 'Invalid or expired OTP. Please try again.',
  ERROR_OTP_EXPIRED: 'OTP has expired. Request a new one.',
  ERROR_TOKEN_EXPIRED: 'Reset link has expired. Please request a new one.',
  
  // Info Messages
  INFO_LOADING: 'Loading...',
  INFO_PROCESSING: 'Processing your request...',
  INFO_NO_RESULTS: 'No results found.',
  INFO_NO_BOOKMARKS: 'You have no bookmarks yet.',
  
  // Confirmations
  CONFIRM_DELETE: 'Are you sure you want to delete this article? This action cannot be undone.',
  CONFIRM_LOGOUT: 'Are you sure you want to log out?',
};

export const BUTTON_LABELS = {
  LOGIN: 'Login',
  REGISTER: 'Register',
  LOGOUT: 'Logout',
  SUBMIT: 'Submit',
  CANCEL: 'Cancel',
  SAVE: 'Save',
  DELETE: 'Delete',
  EDIT: 'Edit',
  BACK: 'Back',
  SEARCH: 'Search',
  BOOKMARK: 'Bookmark',
  SHARE: 'Share',
  READ_MORE: 'Read More',
};

export const PLACEHOLDER_TEXT = {
  EMAIL: 'Enter your email',
  PASSWORD: 'Enter your password',
  SEARCH: 'Search articles...',
  ARTICLE_TITLE: 'Article title',
  ARTICLE_CONTENT: 'Write your article content here...',
};
