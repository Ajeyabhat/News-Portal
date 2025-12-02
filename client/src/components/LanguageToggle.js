import React from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Globe } from 'lucide-react';

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
    <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-1.5 shadow-md border border-gray-200 dark:border-slate-700" role="group" aria-label="Language selector">
      <button
        type="button"
        onClick={() => handleSelect('all')}
        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
          language === 'all'
            ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
        }`}
      >
        All
      </button>
      <button
        type="button"
        onClick={() => handleSelect('en')}
        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
          language === 'en'
            ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => handleSelect('kn')}
        className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-all duration-300 ${
          language === 'kn'
            ? 'bg-primary-600 text-white shadow-md'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        KN
      </button>
    </div>
  );
};

export default LanguageToggle;
