import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import SearchBar from './SearchBar'; // Import SearchBar
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext); // Get the user object

  const authLinks = (
    <ul>
      {/* New: Show Admin Dashboard link only if user is an Admin */}
      {user && user.role === 'Admin' && (
        <li><Link to="/admin">Admin Dashboard</Link></li>
      )}
      <li><Link to="/bookmarks">My Bookmarks</Link></li>
      <li><button onClick={logout}>Logout</button></li>
    </ul>
  );

  const guestLinks = (
    <ul>
      <li><Link to="/register">Register</Link></li>
      <li><Link to="/login">Login</Link></li>
    </ul>
  );

  return (
    <nav className="navbar">
      <h1>
        <Link to="/">News Portal</Link>
      </h1>
         <SearchBar /> {/* Add the SearchBar */}

      {isAuthenticated ? authLinks : guestLinks}
    </nav>
  );
};

export default Navbar;