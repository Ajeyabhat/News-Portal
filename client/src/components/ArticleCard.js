import React from 'react';
import './ArticleCard.css';

const ArticleCard = ({ article }) => {
  // Format the date to be more readable
  const formattedDate = new Date(article.createdAt).toLocaleDateString();

  return (
    <div className="article-card">
      <div className="card-image-container">
        <img src={article.imageUrl} alt={article.title} className="card-image" />
      </div>
      <div className="card-content">
        <span className="card-category">{article.category}</span>
        <h3 className="card-title">{article.title}</h3>
        <p className="card-summary">{article.summary}</p>
        <div className="card-footer">
          <span className="card-source">{article.source}</span>
          <span className="card-date">{formattedDate}</span>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;