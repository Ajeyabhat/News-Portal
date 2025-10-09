import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import Register from './pages/Register';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ArticlePage from './pages/ArticlePage';
import BookmarksPage from './pages/BookmarksPage';
import SearchResultsPage from './pages/SearchResultsPage';
import ContentManager from './components/ContentManager';
import UserManagement from './components/UserManagement';
import EventManager from './components/EventManager';
import './App.css';

function App() {
  return (
    <Layout> 
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/article/:id" element={<ArticlePage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route 
          path="/bookmarks" 
          element={<ProtectedRoute><BookmarksPage /></ProtectedRoute>} 
        />
        
        {/* New Nested Admin Route */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        >
          <Route index element={<ContentManager />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="events" element={<EventManager />} />
        </Route>
      </Routes>
    </Layout>
  );
}

export default App;