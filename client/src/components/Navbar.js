import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import SearchBar from './SearchBar';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import { HiMenu, HiX } from 'react-icons/hi'; // Import icons
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // New state for mobile menu

  const authLinks = (
    <div className="user-menu">
      <button onClick={() => setDropdownOpen(!dropdownOpen)} className="user-menu-button">
        Welcome, {user ? user.username : ''}
      </button>
      {dropdownOpen && (
        <ul className="dropdown-menu">
          {user && user.role === 'Admin' && (
            <li><Link to="/admin" onClick={() => setDropdownOpen(false)}>Admin Panel</Link></li>
          )}
          <li><Link to="/bookmarks" onClick={() => setDropdownOpen(false)}>My Bookmarks</Link></li>
          <li><button onClick={() => { logout(); setDropdownOpen(false); }}>Logout</button></li>
        </ul>
      )}
    </div>
  );

  const guestLinks = (
    <ul className="nav-links">
      <li><Link to="/">Home</Link></li>
      <li><Link to="/register">Register</Link></li>
      <li><Link to="/login">Login</Link></li>
    </ul>
  );

  return (
    <nav className="navbar">
      <h1>
        <Link to="/">News Portal</Link>
      </h1>
      <SearchBar />
      
      <div className="menu-icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        {mobileMenuOpen ? <HiX /> : <HiMenu />}
      </div>

      <div className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
        <LanguageToggle />
        <ThemeToggle />
        {isAuthenticated ? authLinks : guestLinks}
      </div>
    </nav>
  );
};

export default Navbar;