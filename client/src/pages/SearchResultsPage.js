import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import ArticleCard from '../components/ArticleCard';
import EmptyState from '../components/EmptyState';
import { useLanguage } from '../context/LanguageContext';
import '../App.css';

const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q');
  const langParam = searchParams.get('lang');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    if (langParam && (langParam === 'kn' || langParam === 'en') && langParam !== language) {
      setLanguage(langParam);
    }
  }, [langParam, language, setLanguage]);

  useEffect(() => {
    if (!langParam || langParam !== language) {
      const next = new URLSearchParams();
      if (query) {
        next.set('q', query);
      }
      next.set('lang', language);
      setSearchParams(next, { replace: true });
    }
  }, [language, langParam, query, setSearchParams]);

  useEffect(() => {
    if (query) {
      const fetchResults = async () => {
        setLoading(true); // Set loading to true before fetching
        try {
          const params = new URLSearchParams({ q: query, language });
          const res = await axios.get(`/api/search?${params.toString()}`);
          setArticles(res.data);
        } catch (err) {
          console.error('Error fetching search results:', err);
        }
        setLoading(false);
      };
      fetchResults();
    } else {
      setArticles([]); // Clear articles if there is no query
      setLoading(false);
    }
  }, [query, language]);

  if (loading) {
    return <h2>Searching...</h2>;
  }

  return (
    <div>
      <h1>Search Results for: "{query}"</h1>
      <div className="article-grid">
        {articles.length > 0 ? (
          articles.map((article) => (
            <Link to={`/article/${article._id}`} key={article._id} className="card-link">
              <ArticleCard article={article} />
            </Link>
          ))
        ) : (
          <EmptyState message={`No ${language === 'kn' ? 'Kannada' : language === 'all' ? '' : 'English'} articles found matching "${query}"`} />
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;