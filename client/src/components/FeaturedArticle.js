import React from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaClock, FaCalendarAlt } from 'react-icons/fa';
import { formatRelativeTime, calculateReadingTime, getAuthorName } from '../utils/helpers';
import './FeaturedArticle.css';

const FeaturedArticle = ({ article }) => {
  // Don't render anything if there's no article data yet
  if (!article) return null;

  const authorName = getAuthorName(article);
  const relativeTime = formatRelativeTime(article.createdAt);
  const readingTime = calculateReadingTime(article.content);

  return (
    <div className="featured-article">
      <div className="featured-image-container">
        <img 
          src={article.imageUrl} 
          alt={article.title}
          loading="lazy"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="450"%3E%3Crect fill="%23ddd" width="800" height="450"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3EImage not available%3C/text%3E%3C/svg%3E';
          }}
        />
        <div className="featured-image-overlay">
          <span className="featured-category-overlay">{article.category}</span>
        </div>
      </div>
      <div className="featured-content">
        <h2 className="featured-title">{article.title}</h2>
        <p className="featured-summary">{article.summary}</p>
        <div className="featured-meta">
          <span className="featured-meta-item">
            <FaUser className="featured-meta-icon" />
            {authorName}
          </span>
          <span className="featured-meta-divider">•</span>
          <span className="featured-meta-item">
            <FaCalendarAlt className="featured-meta-icon" />
            {relativeTime}
          </span>
          <span className="featured-meta-divider">•</span>
          <span className="featured-meta-item">
            <FaClock className="featured-meta-icon" />
            {readingTime}
          </span>
        </div>
        <Link to={`/article/${article._id}`} className="read-more-btn">
          Read More
        </Link>
      </div>
    </div>
  );
};

export default FeaturedArticle;