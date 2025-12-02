import React, { useContext } from 'react';
import ThemeContext from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button 
      onClick={toggleTheme} 
      className="relative p-2.5 rounded-xl bg-gradient-to-br from-blue-100 to-teal-100 dark:from-slate-700 dark:to-slate-600 hover:from-blue-200 hover:to-teal-200 dark:hover:from-slate-600 dark:hover:to-slate-500 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-blue-700 dark:text-yellow-400 transition-transform duration-300" />
      ) : (
        <Sun className="w-5 h-5 text-yellow-500 transition-transform duration-300" />
      )}
    </button>
  );
}

export default ThemeToggle;
