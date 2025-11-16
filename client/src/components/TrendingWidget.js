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
      <h3>🔥 Trending Articles</h3>
      <ul>
        {trending.map((article) => (
          <li key={article._id}>
            <Link to={`/article/${article._id}`}>{article.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrendingWidget;