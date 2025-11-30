import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useLanguage } from './LanguageContext';

export const AuthContext = createContext();

// Set baseURL for all axios requests
axios.defaults.baseURL = 'http://localhost:5000';

// Helper to manage JWT token in localStorage
const getToken = () => localStorage.getItem('token');
const setToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const { setLanguage } = useLanguage();

  // Load user data from server
  const loadUser = async () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    setToken(token); // Set axios header

    try {
      const res = await axios.get('/api/users/auth');
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Error loading user:', err);
      // Token invalid or expired
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    }
    setLoading(false);
  };

  // Load user on mount
  useEffect(() => {
    loadUser();
  }, []);

  // Login function
  const login = async (email, password) => {
    setLanguage('en');
    try {
      const res = await axios.post('/api/users/login', { email, password });
      
      // Save token
      setToken(res.data.token);
      
      // Set user
      setUser(res.data.user);
      setIsAuthenticated(true);
      
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const res = await axios.post('/api/users/register', userData);
      
      // Save token (user can use app even before email verification)
      setToken(res.data.token);
      
      // Set user
      setUser(res.data.user);
      setIsAuthenticated(true);
      
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  // Logout function
  const logout = async () => {
    setLanguage('en');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        loadUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
