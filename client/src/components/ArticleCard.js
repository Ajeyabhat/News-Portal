import React from 'react';
import { FaUser, FaClock, FaCalendarAlt } from 'react-icons/fa';
import { formatRelativeTime, calculateReadingTime, getAuthorName } from '../utils/helpers';
import './ArticleCard.css';

const ArticleCard = ({ article }) => {
  const authorName = getAuthorName(article);
  const relativeTime = formatRelativeTime(article.createdAt);
  const readingTime = calculateReadingTime(article.content);

  return (
    <div className="article-card">
      <div className="card-image-container">
        <img 
          src={article.imageUrl} 
          alt={article.title} 
          className="card-image" 
          loading="lazy"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="225"%3E%3Crect fill="%23ddd" width="400" height="225"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3EImage not available%3C/text%3E%3C/svg%3E';
          }}
        />
      </div>
      <div className="card-content">
        <span className="card-category">{article.category}</span>
        <h3 className="card-title">{article.title}</h3>
        <p className="card-summary">{article.summary}</p>
        <div className="card-footer">
          <div className="card-meta-group">
            <span className="card-meta-item">
              <FaUser className="card-meta-icon" />
              <span className="card-author">{authorName}</span>
            </span>
            <span className="card-meta-divider">•</span>
            <span className="card-meta-item card-date-item">
              <FaCalendarAlt className="card-meta-icon" />
              <span className="card-date">{relativeTime}</span>
            </span>
          </div>
          <span className="card-meta-item card-reading-time">
            <FaClock className="card-meta-icon" />
            <span>{readingTime}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;