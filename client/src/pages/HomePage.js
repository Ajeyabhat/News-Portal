import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ArticleCard from '../components/ArticleCard';
import TrendingWidget from '../components/TrendingWidget';
import DeadlinesWidget from '../components/DeadlinesWidget';
import './HomePage.css';

const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/articles');
        setArticles(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching articles:', err);
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  if (loading) return <h2>Loading articles...</h2>;

  return (
    <div className="home-layout">
      <div className="main-content">
        <h1>Latest News</h1>
        <div className="article-grid">
          {articles.length > 0 ? (
            articles.map((article) => (
              <Link to={`/article/${article._id}`} key={article._id} className="card-link">
                <ArticleCard article={article} />
              </Link>
            ))
          ) : (
            <p>No articles found.</p>
          )}
        </div>
      </div>
      <aside className="sidebar">
        <TrendingWidget />
          <DeadlinesWidget />

      </aside>
    </div>
  );
};

export default HomePage;