import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import SearchBar from './SearchBar';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import { HiMenu, HiX } from 'react-icons/hi';
import { ChevronDown } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const authLinks = (
    <div className="relative">
      <button 
        onClick={() => setDropdownOpen(!dropdownOpen)} 
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent-600 to-accent-700 text-white font-semibold text-sm hover:from-accent-700 hover:to-accent-800 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
      >
        Welcome, {user?.username}
        <ChevronDown size={16} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
      </button>
      {dropdownOpen && (
        <ul className="absolute top-full right-0 mt-2 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 min-w-48 z-50 overflow-hidden">
          {user?.role === 'Admin' && (
            <li><Link to="/admin" onClick={() => { setDropdownOpen(false); setMobileMenuOpen(false); }} className="block px-4 py-3 hover:bg-primary-50 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium transition-colors">📊 Admin Panel</Link></li>
          )}
          {user?.role === 'Institution' && (
            <li><Link to="/institution" onClick={() => { setDropdownOpen(false); setMobileMenuOpen(false); }} className="block px-4 py-3 hover:bg-primary-50 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium transition-colors">📝 Submit Article</Link></li>
          )}
          <li><Link to="/bookmarks" onClick={() => { setDropdownOpen(false); setMobileMenuOpen(false); }} className="block px-4 py-3 hover:bg-primary-50 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium transition-colors">🔖 My Bookmarks</Link></li>
          <li><button onClick={() => { logout(); setDropdownOpen(false); setMobileMenuOpen(false); }} className="w-full text-left px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 font-medium transition-colors border-t border-gray-200 dark:border-gray-700">🚪 Logout</button></li>
        </ul>
      )}
    </div>
  );

  const guestLinks = (
    <ul className="hidden md:flex list-none m-0 p-0 gap-4 items-center">
      <li><Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-semibold text-sm uppercase tracking-wider transition-colors">Home</Link></li>
      <li><Link to="/register" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-semibold text-sm uppercase tracking-wider transition-colors">Register</Link></li>
      <li><Link to="/register-institution" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-semibold text-sm uppercase tracking-wider transition-colors">🏫 Institutions</Link></li>
      <li><Link to="/login" className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-lg">Login</Link></li>
    </ul>
  );

  return (
    <nav className="sticky top-0 z-1000 bg-white/70 dark:bg-slate-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          {/* Logo */}
          <h1 className="m-0 text-2xl font-extrabold">
            <Link to="/" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors flex items-center gap-2">
              📰 News Portal
            </Link>
          </h1>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden lg:flex flex-1 max-w-md">
            <SearchBar />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? authLinks : guestLinks}
            <ThemeToggle />
            <LanguageToggle />
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <LanguageToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200 dark:border-gray-800 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
            {/* Mobile Search */}
            <div className="py-2">
              <SearchBar />
            </div>

            {isAuthenticated ? (
              <>
                {user?.role === 'Admin' && (
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium transition-colors">📊 Admin Panel</Link>
                )}
                {user?.role === 'Institution' && (
                  <Link to="/institution" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium transition-colors">📝 Submit Article</Link>
                )}
                <Link to="/bookmarks" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium transition-colors">🔖 My Bookmarks</Link>
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full text-left px-4 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 font-medium transition-colors">🚪 Logout</button>
              </>
            ) : (
              <>
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium transition-colors">Home</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium transition-colors">Register</Link>
                <Link to="/register-institution" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium transition-colors">🏫 Institutions</Link>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 font-semibold text-center transition-colors">Login</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;