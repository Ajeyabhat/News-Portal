import React from 'react';
import { User, Clock, Calendar } from 'lucide-react';
import { formatRelativeTime, calculateReadingTime, getAuthorName } from '../utils/helpers';

const ArticleCard = ({ article }) => {
  const authorName = getAuthorName(article);
  const relativeTime = formatRelativeTime(article.createdAt);
  const readingTime = calculateReadingTime(article.content);

  return (
    <div className="group h-full bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden flex flex-col">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-700">
        <img 
          src={article.imageUrl} 
          alt={article.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="225"%3E%3Crect fill="%23ddd" width="400" height="225"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3EImage not available%3C/text%3E%3C/svg%3E';
          }}
        />
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-primary-600 text-white text-xs font-bold rounded-full">
            {article.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {article.title}
        </h3>

        {/* Summary */}
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-2 flex-1">
          {article.summary}
        </p>

        {/* Footer Meta */}
        <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 flex-wrap">
            <span className="flex items-center gap-1">
              <User size={14} />
              <span className="font-medium">{authorName}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {relativeTime}
            </span>
          </div>
          
          <div className="flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 font-medium">
            <Clock size={14} />
            {readingTime}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;