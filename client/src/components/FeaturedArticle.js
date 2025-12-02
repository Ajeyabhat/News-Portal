import React from 'react';
import { Link } from 'react-router-dom';
import { User, Clock, Calendar, ArrowRight } from 'lucide-react';
import { formatRelativeTime, calculateReadingTime, getAuthorName } from '../utils/helpers';

const FeaturedArticle = ({ article }) => {
  if (!article) return null;

  const authorName = getAuthorName(article);
  const relativeTime = formatRelativeTime(article.createdAt);
  const readingTime = calculateReadingTime(article.content);

  return (
    <Link to={`/article/${article._id}`} className="block group mb-8">
      <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl hover:shadow-2xl transition-all duration-500">
        {/* Background Image */}
        <img 
          src={article.imageUrl} 
          alt={article.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="450"%3E%3Crect fill="%23ddd" width="800" height="450"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3EImage not available%3C/text%3E%3C/svg%3E';
          }}
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8">
          {/* Top Badge */}
          <div className="flex justify-between items-start">
            <span className="px-4 py-2 bg-primary-600 text-white text-sm font-bold rounded-full shadow-lg">
              Featured
            </span>
            <span className="px-4 py-2 bg-accent-600 text-white text-sm font-bold rounded-full shadow-lg">
              {article.category}
            </span>
          </div>

          {/* Bottom Content */}
          <div className="space-y-4">
            {/* Title */}
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight group-hover:text-primary-200 transition-colors">
              {article.title}
            </h2>

            {/* Summary */}
            <p className="text-lg text-gray-50 line-clamp-2">
              {article.summary}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-200">
              <span className="flex items-center gap-2">
                <User size={16} />
                {authorName}
              </span>
              <span className="flex items-center gap-2">
                <Calendar size={16} />
                {relativeTime}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={16} />
                {readingTime}
              </span>
            </div>

            {/* Read More Button */}
            <div className="pt-4">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-bold rounded-lg group-hover:bg-primary-700 group-hover:gap-3 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                Read More
                <ArrowRight size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FeaturedArticle;