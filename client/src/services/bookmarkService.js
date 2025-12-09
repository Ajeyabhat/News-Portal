/**
 * Bookmark Service
 * Centralized API calls for bookmark operations
 */
import axios from 'axios';

const API_BASE = '/api/bookmarks';

/**
 * Get all bookmarks for current user
 * @returns {Promise} Array of bookmarked articles
 */
export const getBookmarks = async () => {
  return axios.get(API_BASE);
};

/**
 * Add bookmark
 * @param {string} articleId - Article ID to bookmark
 * @returns {Promise} Bookmark confirmation
 */
export const addBookmark = async (articleId) => {
  return axios.post(API_BASE, { articleId });
};

/**
 * Remove bookmark
 * @param {string} articleId - Article ID to unbookmark
 * @returns {Promise} Removal confirmation
 */
export const removeBookmark = async (articleId) => {
  return axios.delete(`${API_BASE}/${articleId}`);
};

/**
 * Toggle bookmark status
 * @param {string} articleId - Article ID
 * @param {boolean} isBookmarked - Current bookmark status
 * @returns {Promise} Updated bookmark status
 */
export const toggleBookmark = async (articleId, isBookmarked) => {
  if (isBookmarked) {
    return removeBookmark(articleId);
  } else {
    return addBookmark(articleId);
  }
};
