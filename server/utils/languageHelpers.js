/**
 * Language utility functions for handling multilingual content
 * These functions help filter and validate content based on language (English/Kannada)
 */

/**
 * Resolves and normalizes language input
 * @param {string} value - The language value to normalize (en, kn, all)
 * @returns {string} Normalized language code
 */
const resolveLanguage = (value) => {
  const normalized = String(value || 'en').toLowerCase();
  if (normalized === 'kn') return 'kn';
  if (normalized === 'all') return 'en'; // 'all' on create defaults to 'en'
  return 'en';
};

/**
 * Builds MongoDB filter object for language-based queries
 * @param {string} language - The language to filter by (en, kn, all)
 * @returns {Object} MongoDB filter object
 */
const buildLanguageFilter = (language) => {
  if (language === 'kn') {
    return { contentLanguage: 'kn' };
  }
  if (language === 'all') {
    return {}; // Return all articles regardless of language
  }
  // Default to English (missing contentLanguage field counts as English)
  return {
    $or: [
      { contentLanguage: { $exists: false } },
      { contentLanguage: null },
      { contentLanguage: 'en' }
    ]
  };
};

/**
 * Checks if an article matches the specified language
 * @param {Object} article - The article object to check
 * @param {string} language - The language to match against
 * @returns {boolean} Whether the article matches the language
 */
const matchesLanguage = (article, language) => {
  if (language === 'kn') {
    return article.contentLanguage === 'kn';
  }
  if (language === 'all') {
    return true; // All languages match
  }
  return !article.contentLanguage || article.contentLanguage === 'en';
};

module.exports = {
  resolveLanguage,
  buildLanguageFilter,
  matchesLanguage
};
