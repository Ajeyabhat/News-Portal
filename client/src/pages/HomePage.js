import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ArticleCard from '../components/ArticleCard';
import FeaturedArticle from '../components/FeaturedArticle';
import TrendingWidget from '../components/TrendingWidget';
import DeadlinesWidget from '../components/DeadlinesWidget';
import DeadlineAlert from '../components/DeadlineAlert';
import EmptyState from '../components/EmptyState'; // 1. Import the new component
import { useLanguage } from '../context/LanguageContext';
import './HomePage.css';

// Define your categories
const categories = ['ExamAlert', 'Scholarships', 'Guidelines', 'Internships', 'Results'];

const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { language } = useLanguage();

  const fetchArticles = useCallback(async (category = null) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ language });
      if (category) {
        params.append('category', category);
      }
      const res = await axios.get(`/api/articles?${params.toString()}`);
      setArticles(res.data);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setArticles([]);
    }
    setLoading(false);
  }, [language]);

  useEffect(() => {
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
      <DeadlineAlert />
      <div className="home-layout">
        <div className="main-content">
          {!selectedCategory && <FeaturedArticle article={featuredArticle} />}

        <h2>{selectedCategory ? `Latest News in ${selectedCategory}` : 'Latest News'}</h2>

        <div className="category-buttons">
          <button
            onClick={() => handleCategoryClick(null)}
            className={!selectedCategory ? 'active' : ''}
          >
            All News
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={selectedCategory === cat ? 'active' : ''}
            >
              {cat.replace('#', '')}
            </button>
          ))}
        </div>

        {loading ? (
          <h2>Loading articles...</h2>
        ) : (
          <div className="article-grid">
            {displayArticles.length > 0 ? (
              displayArticles.map((article) => (
                <Link to={`/article/${article._id}`} key={article._id} className="card-link">
                  <ArticleCard article={article} />
                </Link>
              ))
            ) : (
              // 2. Use the new EmptyState component here
              <EmptyState message={selectedCategory ? `No ${language === 'kn' ? 'Kannada' : 'English'} articles found for ${selectedCategory}` : `No ${language === 'kn' ? 'Kannada' : 'English'} articles published yet.`} />
            )}
          </div>
        )}
      </div>
      <aside className="sidebar">
        <TrendingWidget />
        <DeadlinesWidget />
      </aside>
      </div>
    </>
  );
};

export default HomePage;