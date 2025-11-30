/**
 * Utility functions for the News Portal application
 */

/**
 * Format a date as relative time (e.g., "2 hours ago", "3 months ago")
 * @param {Date|string} date - The date to format
 * @returns {string} Formatted relative time string
 */
export const formatRelativeTime = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);

  // Just now (less than 1 minute)
  if (diffInSeconds < 60) {
    return 'just now';
  }

  // Minutes ago
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  // Hours ago
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  // Days ago (1-6 days)
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  // Weeks ago (7-27 days = 1-3 weeks)
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  }

  // Months ago (28+ days, calculated more accurately)
  // Use actual month difference instead of dividing by 30
  const pastDate = new Date(past);
  const nowDate = new Date(now);
  
  let diffInMonths = (nowDate.getFullYear() - pastDate.getFullYear()) * 12;
  diffInMonths += nowDate.getMonth() - pastDate.getMonth();
  
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }

  // Years ago
  const diffInYears = nowDate.getFullYear() - pastDate.getFullYear();
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
};

/**
 * Calculate reading time based on content length
 * Assumes average reading speed of 200 words per minute
 * @param {string} htmlContent - The HTML content to analyze
 * @returns {string} Formatted reading time (e.g., "5 mins read")
 */
export const calculateReadingTime = (htmlContent) => {
  if (!htmlContent) return '< 1 min read';

  // Strip HTML tags
  const textContent = htmlContent.replace(/<[^>]*>/g, '');
  
  // Count words (split by whitespace)
  const words = textContent.trim().split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;

  // Calculate reading time (200 words per minute)
  const minutes = Math.ceil(wordCount / 200);

  if (minutes < 1) {
    return '< 1 min read';
  }

  return `${minutes} min${minutes > 1 ? 's' : ''} read`;
};

/**
 * Get the author name from an article object
 * Handles both populated author objects and fallback to source
 * @param {Object} article - The article object
 * @returns {string} Author name or fallback
 */
export const getAuthorName = (article) => {
  if (!article) return 'Unknown';

  // If author is populated (object with user data)
  if (article.author && typeof article.author === 'object') {
    // Institution users have institutionName
    if (article.author.institutionName) {
      return article.author.institutionName;
    }
    // Regular users have username
    if (article.author.username) {
      return article.author.username;
    }
    // Fallback to name if exists
    if (article.author.name) {
      return article.author.name;
    }
  }

  // Fallback to source field or default
  return article.source || 'Admin';
};
