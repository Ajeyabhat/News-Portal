import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ArticleCard from '../components/ArticleCard';
import FeaturedArticle from '../components/FeaturedArticle';
import TrendingWidget from '../components/TrendingWidget';
import DeadlinesWidget from '../components/DeadlinesWidget';
import DeadlineAlert from '../components/DeadlineAlert';
import EmptyState from '../components/EmptyState';
import Skeleton from '../components/Skeleton';
import { useLanguage } from '../context/LanguageContext';
import { AlertCircle, RotateCcw } from 'lucide-react';

// Define your categories
const categories = ['ExamAlert', 'Scholarships', 'Guidelines', 'Internships', 'Results'];

const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 30, total: 0, pages: 0 });
  const { language } = useLanguage();

  const fetchArticles = useCallback(async (category = null, page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ language, page, limit: 30 });
      if (category) {
        params.append('category', category);
      }
      const url = `/api/articles?${params.toString()}`;
      console.log('Fetching from:', url);
      const res = await axios.get(url);
      console.log('Articles fetched:', res.data);
      setArticles(res.data.articles || res.data);
      if (res.data.pagination) {
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('Failed to load articles. Please check your connection and try again.');
      setArticles([]);
    }
    setLoading(false);
  }, [language]);

  useEffect(() => {
    console.log('HomePage useEffect triggered - selectedCategory:', selectedCategory);
    fetchArticles(selectedCategory);
  }, [fetchArticles, selectedCategory]);

  const handleCategoryClick = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  const featuredArticle = articles.length > 0 && !selectedCategory ? articles[0] : null;
  const displayArticles = selectedCategory ? articles : articles.slice(1);

  return (
    <section className="min-h-screen py-8 lg:py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6 lg:space-y-8">
              <DeadlineAlert />
              {!selectedCategory && featuredArticle && <FeaturedArticle article={featuredArticle} />}

              {/* Section Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
                  {selectedCategory ? `${selectedCategory}` : 'Latest News'}
                </h2>
                {selectedCategory && (
                  <button 
                    onClick={() => setSelectedCategory(null)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-semibold"
                  >
                    ✕ Clear Filter
                  </button>
                )}
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    !selectedCategory
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  All
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                      selectedCategory === cat
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Loading State */}
              {loading && !articles.length ? (
                <>
                  {!selectedCategory && <Skeleton type="featured" count={1} />}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Skeleton type="card" count={6} />
                  </div>
                </>
              ) : /* Error State */ error && !articles.length ? (
                <div className="flex flex-col items-center justify-center py-12 bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-red-300 dark:border-red-900">
                  <AlertCircle size={48} className="text-red-600 mb-3" />
                  <p className="text-gray-600 dark:text-gray-400 mb-4 text-center">{error}</p>
                  <button 
                    onClick={() => fetchArticles(selectedCategory, 1)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <RotateCcw size={18} />
                    Try Again
                  </button>
                </div>
              ) : (
                <>
                  {/* Articles Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {displayArticles.length > 0 ? (
                      displayArticles.map((article) => (
                        <Link to={`/article/${article._id}`} key={article._id} className="transform hover:scale-105 transition-transform duration-300">
                          <ArticleCard article={article} />
                        </Link>
                      ))
                    ) : (
                      <div className="col-span-full">
                        <EmptyState message={selectedCategory ? `No articles found for ${selectedCategory}` : `No articles published yet.`} />
                      </div>
                    )}
                  </div>
                  
                  {/* Load More Button */}
                  {pagination.page < pagination.pages && (
                    <div className="flex justify-center pt-8">
                      <button 
                        onClick={() => fetchArticles(selectedCategory, pagination.page + 1)}
                        disabled={loading}
                        className="px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold rounded-lg hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                      >
                        {loading ? '⏳ Loading...' : '📰 Load More Articles'}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-6 lg:sticky lg:top-24 lg:self-start">
              <TrendingWidget />
              <DeadlinesWidget />
            </aside>
          </div>
        </div>
      </section>
  );
};
export default HomePage;