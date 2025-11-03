import React from 'react';
import { Link } from 'react-router-dom';
import './FeaturedArticle.css';

const FeaturedArticle = ({ article }) => {
  // Don't render anything if there's no article data yet
  if (!article) return null;

  return (
    <div className="featured-article">
      <div className="featured-image-container">
        <img src={article.imageUrl} alt={article.title} />
      </div>
      <div className="featured-content">
        <span className="featured-category">{article.category}</span>
        <h2 className="featured-title">{article.title}</h2>
        <p className="featured-summary">{article.summary}</p>
        <Link to={`/article/${article._id}`} className="read-more-btn">
          Read More
        </Link>
      </div>
    </div>
  );
};

export default FeaturedArticle;