import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* 404 Header */}
        <div className="space-y-4">
          <div className="text-9xl font-extrabold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            404
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Page Not Found
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Sorry! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Illustration */}
        <div className="py-8">
          <div className="inline-block p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg">
            <Search size={80} className="text-gray-300 dark:text-slate-600" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors shadow-lg"
          >
            <Home size={20} />
            Go Home
          </Link>
          <Link
            to="/articles"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-900 dark:text-white font-semibold rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Articles
          </Link>
        </div>

        {/* Help Text */}
        <div className="pt-8 border-t border-gray-200 dark:border-slate-700">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Can't find what you're looking for? Try these:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to="/"
              className="p-4 bg-white dark:bg-slate-800 rounded-lg hover:shadow-md transition-shadow border border-gray-200 dark:border-slate-700"
            >
              <p className="font-semibold text-gray-900 dark:text-white">Home</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Visit homepage</p>
            </Link>
            <a
              href="/#deadlines"
              className="p-4 bg-white dark:bg-slate-800 rounded-lg hover:shadow-md transition-shadow border border-gray-200 dark:border-slate-700"
            >
              <p className="font-semibold text-gray-900 dark:text-white">Deadlines</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Check schedules</p>
            </a>
            <Link
              to="/about"
              className="p-4 bg-white dark:bg-slate-800 rounded-lg hover:shadow-md transition-shadow border border-gray-200 dark:border-slate-700"
            >
              <p className="font-semibold text-gray-900 dark:text-white">About</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Learn more</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
