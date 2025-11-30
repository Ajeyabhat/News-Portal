import React, { createContext, useContext, useMemo, useState } from 'react';

const LanguageContext = createContext({
  language: 'en',
  setLanguage: () => {},
});

const normalizeLanguage = (value) => {
  const normalized = String(value).toLowerCase();
  if (normalized === 'kn') return 'kn';
  if (normalized === 'all') return 'all';
  return 'en';
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState('en');

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
