import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ArticleCard from '../components/ArticleCard';
import EmptyState from '../components/EmptyState';
import { useLanguage } from '../context/LanguageContext';
import './BookmarksPage.css';

const BookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { language } = useLanguage();

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await axios.get(`/api/users/bookmarks?language=${language}`);
        setBookmarks(res.data);
      } catch (err) {
        console.error('Error fetching bookmarks:', err);
        setError('Could not fetch your bookmarks. Please try logging in again.');
      }
      setLoading(false);
    };

    fetchBookmarks();
  }, [language]);

  useEffect(() => {
    setSelectedCategory('all');
    setSearchTerm('');
  }, [language]);

  // Filter bookmarks
  const filteredBookmarks = bookmarks.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Get unique categories
  const categories = ['all', ...new Set(bookmarks.map(b => b.category))];

  if (loading) {
    return (
      <div className="bookmarks-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your bookmarks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bookmarks-container">
        <div className="error-state">
          <p>⚠️ {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bookmarks-container">
      {/* Header */}
      <div className="bookmarks-header">
        <div className="header-content">
          <div className="header-title">
            <h1>📚 My Bookmarks</h1>
            <p className="bookmark-count">
              {bookmarks.length} article{bookmarks.length !== 1 ? 's' : ''} saved
            </p>
          </div>
          <div className="header-icon">🔖</div>
        </div>
      </div>

      {bookmarks.length > 0 ? (
        <>
          {/* Search and Filter */}
          <div className="bookmarks-controls">
            <div className="search-box">
              <input
                type="text"
                placeholder="🔍 Search bookmarks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="category-filter">
              <span className="filter-label">Filter by:</span>
              <div className="category-buttons">
                {categories.map(category => (
                  <button
                    key={category}
                    className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category === 'all' ? '📋 All' : `📌 ${category}`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Info */}
          <div className="results-info">
            {filteredBookmarks.length === 0 ? (
              <p>No bookmarks match your search or filter</p>
            ) : (
              <p>Showing {filteredBookmarks.length} bookmark{filteredBookmarks.length !== 1 ? 's' : ''}</p>
            )}
          </div>

          {/* Articles Grid */}
          {filteredBookmarks.length > 0 ? (
            <div className="article-grid">
              {filteredBookmarks.map((article) => (
                <Link to={`/article/${article._id}`} key={article._id} className="card-link">
                  <ArticleCard article={article} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-filter-state">
              <p>🔍 No results found</p>
              <p className="help-text">Try adjusting your search or filters</p>
            </div>
          )}
        </>
      ) : (
        <EmptyState 
          message={`No ${language === 'kn' ? 'Kannada' : language === 'all' ? '' : 'English'} bookmarks yet. Start bookmarking!`} 
          icon="📚"
        />
      )}
    </div>
  );
};

export default BookmarksPage;