/**
 * Article Service
 * Centralized API calls for article-related operations
 */
import axios from 'axios';

const API_BASE = '/api/articles';

/**
 * Fetch all articles with optional filters
 * @param {string} language - Language filter (en/hi/etc)
 * @param {string} category - Category filter
 * @param {number} page - Page number for pagination
 * @param {number} limit - Items per page
 * @returns {Promise} Articles data with pagination info
 */
export const fetchArticles = async (language = 'en', category = null, page = 1, limit = 30) => {
  const params = new URLSearchParams({ language, page, limit });
  if (category) params.append('category', category);
  return axios.get(`${API_BASE}?${params.toString()}`);
};

/**
 * Fetch single article by ID
 * @param {string} id - Article ID
 * @returns {Promise} Article data
 */
export const fetchArticleById = async (id) => {
  return axios.get(`${API_BASE}/${id}`);
};

/**
 * Create new article (Admin only)
 * @param {object} articleData - Article content
 * @returns {Promise} Created article
 */
export const createArticle = async (articleData) => {
  return axios.post(API_BASE, articleData);
};

/**
 * Update article (Admin only)
 * @param {string} id - Article ID
 * @param {object} updates - Updated fields
 * @returns {Promise} Updated article
 */
export const updateArticle = async (id, updates) => {
  return axios.put(`${API_BASE}/${id}`, updates);
};

/**
 * Delete article (Admin only)
 * @param {string} id - Article ID
 * @returns {Promise} Deletion confirmation
 */
export const deleteArticle = async (id) => {
  return axios.delete(`${API_BASE}/${id}`);
};

/**
 * Search articles
 * @param {string} query - Search query
 * @param {number} limit - Max results
 * @returns {Promise} Search results
 */
export const searchArticles = async (query, limit = 20) => {
  return axios.get(`/api/search?q=${encodeURIComponent(query)}&limit=${limit}`);
};
