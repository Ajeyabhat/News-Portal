import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Search } from 'lucide-react';

const SearchBar = () => {
  const [term, setTerm] = useState('');
  const navigate = useNavigate();
  const { language } = useLanguage();

  const onSubmit = (e) => {
    e.preventDefault();
    if (term.trim()) {
      const params = new URLSearchParams({ q: term.trim(), lang: language });
      navigate(`/search?${params.toString()}`);
      setTerm('');
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex-1 max-w-2xl hidden lg:flex">
      <div className="relative w-full group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 dark:group-focus-within:text-teal-500 transition-colors duration-300" />
        <input
          type="text"
          placeholder="Search articles, topics, authors..."
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-teal-500 focus:border-blue-600 dark:focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-teal-900/30 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300 shadow-sm focus:shadow-lg"
        />
        <button 
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;