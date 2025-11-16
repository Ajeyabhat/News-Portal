import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './SearchBar.css';

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
    <form onSubmit={onSubmit} className="search-form">
      <input
        type="text"
        placeholder="Search articles..."
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchBar;