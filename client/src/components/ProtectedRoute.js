import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user, loading } = useContext(AuthContext);

  // 1. Wait until the authentication status is determined
  if (loading) {
    return <div>Loading...</div>;
  }

  // 2. If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // 3. If it's an admin-only route, check the user's role
  if (adminOnly && user.role !== 'Admin') {
    return <Navigate to="/" />; // Redirect non-admins to homepage
  }

  // 4. If all checks pass, show the page
  return children;
};

export default ProtectedRoute;