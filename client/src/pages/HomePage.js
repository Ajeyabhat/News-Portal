import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ArticleCard from '../components/ArticleCard';
import FeaturedArticle from '../components/FeaturedArticle';
import TrendingWidget from '../components/TrendingWidget';
import DeadlinesWidget from '../components/DeadlinesWidget';
import './HomePage.css';

// Define your categories
const categories = ['ExamAlert', 'Scholarships', 'Guidelines', 'Internships', 'Results'];

const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null); // State for selected category

  // Updated fetchArticles function to accept a category
  const fetchArticles = async (category = null) => {
    setLoading(true);
    try {
      let url = 'http://localhost:5000/api/articles';
      if (category) {
        url += `?category=${encodeURIComponent(category)}`; // Add category to URL if selected
      }
      const res = await axios.get(url);
      setArticles(res.data);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setArticles([]); // Clear articles on error
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchArticles(selectedCategory); // Fetch based on selected category
  }, [selectedCategory]); // Re-run effect when selectedCategory changes

  const handleCategoryClick = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null); // Click again to show all
    } else {
      setSelectedCategory(category);
    }
  };

  const featuredArticle = articles.length > 0 && !selectedCategory ? articles[0] : null; // Show featured only when showing all
  const displayArticles = selectedCategory ? articles : articles.slice(1); // Show all if filtered, else skip first

  return (
    <div className="home-layout">
      <div className="main-content">
        {/* Only show featured article when no category is selected */}
        {!selectedCategory && <FeaturedArticle article={featuredArticle} />}

        <h2>{selectedCategory ? `Latest News in ${selectedCategory}` : 'Latest News'}</h2>

        {/* Category Buttons */}
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
              {cat} {/* Display without '#' */}
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
              <p>No articles found{selectedCategory ? ` for ${selectedCategory}` : ''}.</p>
            )}
          </div>
        )}
      </div>
      <aside className="sidebar">
        <TrendingWidget />
        <DeadlinesWidget />
      </aside>
    </div>
  );
};

export default HomePage;