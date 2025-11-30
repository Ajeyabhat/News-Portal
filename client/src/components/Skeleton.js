import React from 'react';
import './Skeleton.css';

const Skeleton = ({ type = 'card', count = 1 }) => {
  const skeletons = Array(count).fill(0);

  if (type === 'card') {
    return (
      <>
        {skeletons.map((_, index) => (
          <div key={index} className="skeleton-card">
            <div className="skeleton-image"></div>
            <div className="skeleton-content">
              <div className="skeleton-category"></div>
              <div className="skeleton-title"></div>
              <div className="skeleton-title short"></div>
              <div className="skeleton-text"></div>
              <div className="skeleton-text short"></div>
              <div className="skeleton-footer">
                <div className="skeleton-meta"></div>
                <div className="skeleton-meta"></div>
              </div>
            </div>
          </div>
        ))}
      </>
    );
  }

  if (type === 'featured') {
    return (
      <div className="skeleton-featured">
        <div className="skeleton-featured-image"></div>
        <div className="skeleton-featured-content">
          <div className="skeleton-category"></div>
          <div className="skeleton-title large"></div>
          <div className="skeleton-title large short"></div>
          <div className="skeleton-text"></div>
          <div className="skeleton-text"></div>
          <div className="skeleton-meta-group">
            <div className="skeleton-meta"></div>
            <div className="skeleton-meta"></div>
            <div className="skeleton-meta"></div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'article') {
    return (
      <div className="skeleton-article">
        <div className="skeleton-title large"></div>
        <div className="skeleton-title large short"></div>
        <div className="skeleton-meta-group">
          <div className="skeleton-meta"></div>
          <div className="skeleton-meta"></div>
          <div className="skeleton-meta"></div>
        </div>
        <div className="skeleton-article-image"></div>
        <div className="skeleton-text"></div>
        <div className="skeleton-text"></div>
        <div className="skeleton-text"></div>
        <div className="skeleton-text short"></div>
      </div>
    );
  }

  // Default text skeleton
  return (
    <div className="skeleton-text"></div>
  );
};

export default Skeleton;
