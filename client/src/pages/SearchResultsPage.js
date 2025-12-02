import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import ArticleCard from '../components/ArticleCard';
import EmptyState from '../components/EmptyState';
import { useLanguage } from '../context/LanguageContext';
import { Loader2, Search, AlertCircle, RotateCcw, Filter, X } from 'lucide-react';

const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q');
  const langParam = searchParams.get('lang');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { language, setLanguage } = useLanguage();
  
  // Filter states
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'recent');
  const [dateRange, setDateRange] = useState(searchParams.get('dateRange') || '');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (langParam && (langParam === 'kn' || langParam === 'en') && langParam !== language) {
      setLanguage(langParam);
    }
  }, [langParam, language, setLanguage]);

  useEffect(() => {
    if (!langParam || langParam !== language) {
      const next = new URLSearchParams();
      if (query) {
        next.set('q', query);
      }
      next.set('lang', language);
      setSearchParams(next, { replace: true });
    }
  }, [language, langParam, query, setSearchParams]);

  const fetchResults = async () => {
    if (!query) {
      setArticles([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ q: query, language });
      if (category) params.append('category', category);
      if (sortBy) params.append('sort', sortBy);
      if (dateRange) params.append('dateRange', dateRange);
      
      const res = await axios.get(`/api/search?${params.toString()}`);
      
      // Apply sorting on frontend
      let results = res.data;
      if (sortBy === 'oldest') {
        results = results.reverse();
      } else if (sortBy === 'title') {
        results = results.sort((a, b) => a.title.localeCompare(b.title));
      }
      
      setArticles(results);
      if (results.length === 0) {
        toast.success(`No articles found for "${query}"`, { icon: '🔍' });
      }
    } catch (err) {
      console.error('Error fetching search results:', err);
      const errorMsg = err.response?.data?.msg || 'Failed to search articles. Please try again.';
      setError(errorMsg);
      toast.error('❌ ' + errorMsg);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchResults();
  }, [query, language, category, sortBy, dateRange]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <Search size={32} className="text-primary-600" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
              Search Results
            </h1>
          </div>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            {query ? `Results for "${query}"` : 'Enter a search term'}
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 size={48} className="text-primary-600 animate-spin mb-4" />
            <p className="text-gray-700 dark:text-gray-300">Searching articles...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-2xl p-8 text-center">
            <AlertCircle size={48} className="text-red-600 dark:text-red-400 mx-auto mb-4" />
            <p className="text-red-800 dark:text-red-200 text-lg mb-4">{error}</p>
            <button
              onClick={fetchResults}
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
            >
              <RotateCcw size={18} />
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* Filter Button & Controls */}
            <div className="mb-6 flex flex-col gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold w-full justify-center"
              >
                <Filter size={18} />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>

              {/* Filter Panel */}
              <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 ${!showFilters && 'hidden md:grid'}`}>
                {/* Category Filter */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    📁 Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 transition-colors"
                  >
                    <option value="">All Categories</option>
                    <option value="Technology">🖥️ Technology</option>
                    <option value="Science">🔬 Science</option>
                    <option value="Education">📚 Education</option>
                    <option value="Business">💼 Business</option>
                    <option value="Health">⚕️ Health</option>
                    <option value="Sports">⚽ Sports</option>
                    <option value="Entertainment">🎬 Entertainment</option>
                    <option value="General">📰 General</option>
                  </select>
                </div>

                {/* Sort Filter */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    ⏱️ Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 transition-colors"
                  >
                    <option value="recent">Recent First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="title">By Title (A-Z)</option>
                  </select>
                </div>

                {/* Date Range Filter */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    📅 Date Range
                  </label>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 transition-colors"
                  >
                    <option value="">Any Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                  </select>
                </div>
              </div>

              {/* Active Filters Display */}
              {(category || sortBy !== 'recent' || dateRange) && (
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">Active:</span>
                  {category && (
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm">
                      {category}
                      <button onClick={() => setCategory('')} className="hover:opacity-70">
                        <X size={14} />
                      </button>
                    </span>
                  )}
                  {sortBy !== 'recent' && (
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm">
                      {sortBy === 'oldest' ? 'Oldest First' : 'By Title'}
                      <button onClick={() => setSortBy('recent')} className="hover:opacity-70">
                        <X size={14} />
                      </button>
                    </span>
                  )}
                  {dateRange && (
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm">
                      {dateRange}
                      <button onClick={() => setDateRange('')} className="hover:opacity-70">
                        <X size={14} />
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.length > 0 ? (
                articles.map((article) => (
                  <Link to={`/article/${article._id}`} key={article._id} className="transform hover:scale-105 transition-transform duration-300">
                    <ArticleCard article={article} />
                  </Link>
                ))
              ) : (
                <div className="col-span-full">
                  <EmptyState
                    message={query ? `No ${language === 'kn' ? 'Kannada' : 'English'} articles found matching "${query}". Try different keywords!` : 'Enter a search term to find articles'}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;