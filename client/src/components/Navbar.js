import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import SearchBar from './SearchBar';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import { HiMenu, HiX } from 'react-icons/hi';
import { User, LogOut, Newspaper } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenus = () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-1000 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition-opacity">
            <Newspaper size={28} className="text-primary-600 dark:text-primary-400" />
            <h1 className="m-0 text-xl font-bold text-gray-900 dark:text-white">
              News Portal
            </h1>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden lg:flex flex-1 max-w-md">
            <SearchBar />
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center gap-6">
            {/* Theme & Language */}
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <LanguageToggle />
            </div>

            {/* User Menu / Auth */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-br from-primary-100 to-teal-100 dark:from-slate-700 dark:to-slate-600 hover:from-primary-200 hover:to-teal-200 dark:hover:from-slate-600 dark:hover:to-slate-500 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 font-medium text-gray-800 dark:text-gray-200"
                >
                  <User size={18} className="text-primary-700 dark:text-primary-400" />
                  <span className="text-sm">{user?.username}</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                    {user?.role === 'Admin' && (
                      <Link
                        to="/admin"
                        onClick={closeMenus}
                        className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        Admin Panel
                      </Link>
                    )}
                    {user?.role === 'Institution' && (
                      <Link
                        to="/institution"
                        onClick={closeMenus}
                        className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        Submit Article
                      </Link>
                    )}

                    <div className="border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => {
                          logout();
                          closeMenus();
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                >
                  Register
                </Link>
                <Link
                  to="/register-institution"
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Institution
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200 dark:border-gray-700 space-y-3 pt-4">
            {/* Mobile Search */}
            <div className="px-4">
              <SearchBar />
            </div>

            {/* Mobile Settings */}
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Dark Mode</span>
                <ThemeToggle />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Language</span>
                <LanguageToggle />
              </div>
            </div>

            {/* Mobile Auth */}
            {isAuthenticated ? (
              <div className="px-4 space-y-2">
                <p className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
                  <User size={16} />
                  {user?.username}
                </p>
                {user?.role === 'Admin' && (
                  <Link to="/admin" onClick={closeMenus} className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                    Admin Panel
                  </Link>
                )}
                {user?.role === 'Institution' && (
                  <Link to="/institution" onClick={closeMenus} className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                    Submit Article
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    closeMenus();
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="px-4 space-y-2">
                <Link to="/login" onClick={closeMenus} className="block w-full px-3 py-2.5 text-sm bg-primary-600 text-white hover:bg-primary-700 rounded font-semibold text-center transition-colors">
                  Login
                </Link>
                <Link to="/register" onClick={closeMenus} className="block px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-center transition-colors">
                  Register
                </Link>
                <Link to="/register-institution" onClick={closeMenus} className="block px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-center transition-colors">
                  Register Institution
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
