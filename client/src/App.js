import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import Register from './pages/Register';
import RegisterInstitution from './pages/RegisterInstitution';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail'; // New email verification page
import VerifyPage from './pages/VerifyPage'; // Old verify page (can be removed later)
import ArticlePage from './pages/ArticlePage';
import BookmarksPage from './pages/BookmarksPage';
import SearchResultsPage from './pages/SearchResultsPage';
import EditArticlePage from './pages/EditArticlePage';
import InstitutionDashboard from './pages/InstitutionDashboard';
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
        <Route path="/register-institution" element={<RegisterInstitution />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
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

        {/* Institution Dashboard */}
        <Route 
          path="/institution" 
          element={
            <ProtectedRoute institutionOnly={true}>
              <InstitutionDashboard />
            </ProtectedRoute>
          }
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
          <Route path="dashboard" element={<Navigate to="content" replace />} />
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
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 2000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 1500,
          },
          error: {
            duration: 3000,
          },
        }}
      />
    </Layout>
  );
}

export default App;
