/**
 * Language Configurations
 * Supported languages and translations
 */

export const LANGUAGES = {
  EN: 'en',
  HI: 'hi',
};

export const LANGUAGE_NAMES = {
  en: 'English',
  hi: 'हिन्दी',
};

export const LANGUAGE_OPTIONS = [
  { code: 'en', label: 'English', nativeName: 'English' },
  { code: 'hi', label: 'हिन्दी', nativeName: 'हिन्दी' },
];

export const DEFAULT_LANGUAGE = 'en';

/**
 * Get language display name
 * @param {string} langCode - Language code
 * @returns {string} Display name
 */
export const getLanguageName = (langCode) => {
  return LANGUAGE_NAMES[langCode] || langCode;
};

/**
 * Is valid language
 * @param {string} langCode - Language code
 * @returns {boolean} True if valid
 */
export const isValidLanguage = (langCode) => {
  return Object.values(LANGUAGES).includes(langCode);
};
