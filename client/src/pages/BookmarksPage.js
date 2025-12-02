import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ArticleCard from '../components/ArticleCard';
import EmptyState from '../components/EmptyState';
import { useLanguage } from '../context/LanguageContext';
import { Bookmark, Search, AlertCircle } from 'lucide-react';

const BookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { language } = useLanguage();

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await axios.get(`/api/users/bookmarks?language=${language}`);
        setBookmarks(res.data);
      } catch (err) {
        console.error('Error fetching bookmarks:', err);
        setError('Could not fetch your bookmarks. Please try logging in again.');
      }
      setLoading(false);
    };

    fetchBookmarks();
  }, [language]);

  useEffect(() => {
    setSelectedCategory('all');
    setSearchTerm('');
  }, [language]);

  // Filter bookmarks
  const filteredBookmarks = bookmarks.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Get unique categories
  const categories = ['all', ...new Set(bookmarks.map(b => b.category))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 dark:border-primary-900 border-t-primary-600 mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300">Loading your bookmarks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-700 rounded-2xl p-6 flex items-start gap-4">
            <AlertCircle size={24} className="text-red-600 flex-shrink-0 mt-1" />
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with Hint */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="flex items-center gap-3 text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
              <Bookmark size={40} className="text-primary-600" />
              My Bookmarks
            </h1>
            <p className="text-gray-700 dark:text-gray-300">
              {bookmarks.length} article{bookmarks.length !== 1 ? 's' : ''} saved
            </p>
            {bookmarks.length === 0 && (
              <p className="text-sm text-primary-600 dark:text-primary-400 mt-2">
                💡 Tip: Click the bookmark icon on any article to save it here for quick access
              </p>
            )}
          </div>
        </div>

        {bookmarks.length > 0 ? (
          <>
            {/* Search and Filter Controls */}
            <div className="space-y-4">
              {/* Search Box */}
              <div className="relative">
                <Search size={20} className="absolute left-3 top-3.5 text-gray-500 dark:text-gray-400" />
                <input
                  type="text"
                  placeholder="Search bookmarks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-300 focus:outline-none focus:border-primary-600 transition-all duration-300"
                />
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Filter by Category:</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                        selectedCategory === category
                          ? 'bg-primary-600 text-white shadow-md'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {category === 'all' ? 'All' : category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Info */}
            <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">
              {filteredBookmarks.length === 0 ? (
                <p>No bookmarks match your search or filter</p>
              ) : (
                <p>Showing {filteredBookmarks.length} bookmark{filteredBookmarks.length !== 1 ? 's' : ''}</p>
              )}
            </div>

            {/* Articles Grid */}
            {filteredBookmarks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBookmarks.map((article) => (
                  <Link to={`/article/${article._id}`} key={article._id} className="transform hover:scale-105 transition-transform duration-300">
                    <ArticleCard article={article} />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700">
                <Search size={48} className="text-gray-400 dark:text-gray-600 mb-4" />
                <p className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">No results found</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">Try adjusting your search or filters</p>
              </div>
            )}
          </>
        ) : (
          <EmptyState 
            message={`No ${language === 'kn' ? 'Kannada' : language === 'all' ? '' : 'English'} bookmarks yet. Start bookmarking!`} 
          />
        )}
      </div>
    </div>
  );
};

export default BookmarksPage;