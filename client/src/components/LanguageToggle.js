import React from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './LanguageToggle.css';

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();
  const location = useLocation();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  if (isAuthPage) {
    return null;
  }

  const handleSelect = (value) => {
    setLanguage(value);
  };

  return (
    <div className="language-toggle" role="group" aria-label="Language selector">
      <button
        type="button"
        className={language === 'all' ? 'active' : ''}
        onClick={() => handleSelect('all')}
      >
        All
      </button>
      <button
        type="button"
        className={language === 'en' ? 'active' : ''}
        onClick={() => handleSelect('en')}
      >
        English
      </button>
      <button
        type="button"
        className={language === 'kn' ? 'active' : ''}
        onClick={() => handleSelect('kn')}
      >
        ಕನ್ನಡ
      </button>
    </div>
  );
};

export default LanguageToggle;
