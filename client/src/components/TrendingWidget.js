import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import './TrendingWidget.css';

const TrendingWidget = () => {
  const [trending, setTrending] = useState([]);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await axios.get(`/api/articles/trending?language=${language}`);
        setTrending(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTrending();
  }, [language]);

  return (
    <div className="trending-widget">
      <h3 className="trending-title">🔥 Trending Articles</h3>
      <ol className="trending-list">
        {trending.slice(0, 10).map((article, index) => (
          <li key={article._id} className="trending-item">
            <span className="trending-rank">{index + 1}</span>
            <Link to={`/article/${article._id}`} className="trending-link">{article.title}</Link>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default TrendingWidget;