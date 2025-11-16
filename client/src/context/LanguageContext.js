import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const LanguageContext = createContext({
  language: 'en',
  setLanguage: () => {},
});

const STORAGE_KEY = 'news-portal-language';
const normalizeLanguage = (value) => {
  const normalized = String(value).toLowerCase();
  if (normalized === 'kn') return 'kn';
  if (normalized === 'all') return 'all';
  return 'en';
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    if (typeof window === 'undefined') {
      return 'en';
    }
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return normalizeLanguage(stored);
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const setLanguage = (value) => {
    setLanguageState(normalizeLanguage(value));
  };

  const value = useMemo(() => ({
    language,
    setLanguage,
    toggleLanguage: () => setLanguage(language === 'en' ? 'kn' : 'en'),
  }), [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
