import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ArticleCard from '../components/ArticleCard';
import FeaturedArticle from '../components/FeaturedArticle';
import TrendingWidget from '../components/TrendingWidget';
import DeadlinesWidget from '../components/DeadlinesWidget';
import EmptyState from '../components/EmptyState';
import Skeleton from '../components/Skeleton';
import { useLanguage } from '../context/LanguageContext';
import './HomePage.css';

// Define your categories
const categories = ['ExamAlert', 'Scholarships', 'Guidelines', 'Internships', 'Results'];

const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 30, total: 0, pages: 0 });
  const { language } = useLanguage();

  const fetchArticles = useCallback(async (category = null, page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ language, page, limit: 30 });
      if (category) {
        params.append('category', category);
      }
      const url = `/api/articles?${params.toString()}`;
      console.log('🔍 Fetching from:', url);
      const res = await axios.get(url);
      console.log('✅ Articles fetched:', res.data);
      setArticles(res.data.articles || res.data); // Handle both old and new response format
      if (res.data.pagination) {
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error('❌ Error fetching articles:', err);
      setError('Failed to load articles. Please check your connection and try again.');
      setArticles([]);
    }
    setLoading(false);
  }, [language]);

  useEffect(() => {
    console.log('📌 HomePage useEffect triggered - selectedCategory:', selectedCategory);
    fetchArticles(selectedCategory);
  }, [fetchArticles, selectedCategory]);

  const handleCategoryClick = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  const featuredArticle = articles.length > 0 && !selectedCategory ? articles[0] : null;
  const displayArticles = selectedCategory ? articles : articles.slice(1);

  return (
    <>
      <section className="page-section">
      <div className="home-layout">
        <div className="main-content">
          {!selectedCategory && <FeaturedArticle article={featuredArticle} />}

          <div className="section-header">
            <h2 className="section-heading">{selectedCategory ? `${selectedCategory}` : 'Latest News'}</h2>
            {selectedCategory && (
              <button 
                className="btn btn-sm"
                onClick={() => setSelectedCategory(null)}
              >
                ✕ Clear Filter
              </button>
            )}
          </div>

          <div className="category-filters">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`btn btn-filter ${!selectedCategory ? 'active' : ''}`}
            >
              All
            </button>
            {['ExamAlert', 'Scholarships', 'Guidelines', 'Internships', 'Results'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`btn btn-filter ${selectedCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading && !articles.length ? (
            <>
              {!selectedCategory && <Skeleton type="featured" count={1} />}
              <div className="article-grid">
                <Skeleton type="card" count={6} />
              </div>
            </>
          ) : error && !articles.length ? (
            <div className="error-state">
              <p className="error-message">{error}</p>
              <button 
                className="btn btn-primary retry-button" 
                onClick={() => fetchArticles(selectedCategory, 1)}
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              <div className="article-grid">
                {displayArticles.length > 0 ? (
                  displayArticles.map((article) => (
                    <Link to={`/article/${article._id}`} key={article._id} className="card-link">
                      <ArticleCard article={article} />
                    </Link>
                  ))
                ) : (
                  <EmptyState message={selectedCategory ? `No articles found for ${selectedCategory}` : `No articles published yet.`} />
                )}
              </div>
              
              {/* Load More Button */}
              {pagination.page < pagination.pages && (
                <div className="load-more-container">
                  <button 
                    className="btn btn-primary btn-lg"
                    onClick={() => fetchArticles(selectedCategory, pagination.page + 1)}
                    disabled={loading}
                    aria-label="Load more articles"
                  >
                    {loading ? 'Loading...' : 'Load More Articles'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        <aside className="sidebar">
          <TrendingWidget />
          <DeadlinesWidget />
        </aside>
        </div>
      </section>
    </>
  );
};

export default HomePage;