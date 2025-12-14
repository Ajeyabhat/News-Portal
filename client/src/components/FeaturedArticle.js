import React from 'react';
import { Link } from 'react-router-dom';
import { User, Clock, Calendar, ArrowRight } from 'lucide-react';
import { formatRelativeTime, calculateReadingTime, getAuthorName, getImageUrl } from '../utils/helpers';

const FeaturedArticle = React.memo(({ article }) => {
  if (!article) return null;

  const authorName = getAuthorName(article);
  const relativeTime = formatRelativeTime(article.createdAt);
  const readingTime = calculateReadingTime(article.content);

  return (
    <Link to={`/article/${article._id}`} className="block group">
      <div className="relative h-80 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-500">
        {/* Background Image */}
        <img 
          src={getImageUrl(article.imageUrl)} 
          alt={article.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="450"%3E%3Crect fill="%23ddd" width="800" height="450"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3EImage not available%3C/text%3E%3C/svg%3E';
          }}
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8">
          {/* Top Badge */}
          <div className="flex gap-3">
            <span className="px-3 py-1 bg-primary-600 text-white text-xs font-bold rounded-full">
              Featured
            </span>
            <span className="px-3 py-1 bg-accent-600 text-white text-xs font-bold rounded-full">
              {article.category}
            </span>
          </div>

          {/* Bottom Content */}
          <div className="space-y-3">
            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight line-clamp-2">
              {article.title}
            </h2>

            {/* Summary */}
            <p className="text-sm text-gray-100 line-clamp-2">
              {article.summary}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 text-xs text-gray-200">
              <span className="flex items-center gap-1">
                <User size={14} />
                {authorName}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {relativeTime}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {readingTime}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
});

FeaturedArticle.displayName = 'FeaturedArticle';

export default FeaturedArticle;
