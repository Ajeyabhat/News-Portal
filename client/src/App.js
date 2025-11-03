import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import Register from './pages/Register';
import Login from './pages/Login';
import VerifyPage from './pages/VerifyPage'; // Import VerifyPage
import ArticlePage from './pages/ArticlePage';
import BookmarksPage from './pages/BookmarksPage';
import SearchResultsPage from './pages/SearchResultsPage';
import EditArticlePage from './pages/EditArticlePage';
import UserManagement from './pages/admin/AdminUserManagement';
import ContentManager from './pages/admin/AdminContentPage';
import AdminLayout from './components/admin/AdminLayout';
import EventManager from './pages/admin/AdminEventManager';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';
import './App.css';

function App() {
  return (
    <Layout> 
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<VerifyPage />} />
        <Route path="/article/:id" element={<ArticlePage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        
        <Route 
          path="/bookmarks" 
          element={<ProtectedRoute><BookmarksPage /></ProtectedRoute>} 
        />
        
        {/* Admin Routes with AdminLayout */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="content" replace />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="content" element={<ContentManager />} />
          <Route path="events" element={<EventManager />} />
        </Route>

        {/* New: Add the Edit Article Route */}
        <Route 
          path="/edit-article/:id" 
          element={
            <ProtectedRoute adminOnly={true}>
              <EditArticlePage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Layout>
  );
}

export default App;
