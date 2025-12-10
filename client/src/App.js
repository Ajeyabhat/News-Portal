import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import Register from './pages/Register';
import RegisterInstitution from './pages/RegisterInstitution';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail'; // Email verification page
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
import TermsPage from './pages/TermsPage';
import NotFound from './pages/NotFound';


function App() {
  return (
    <ErrorBoundary>
      <Routes>
        {/* Admin Routes - No Main Layout */}
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

        {/* All Other Routes - With Main Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-institution" element={<RegisterInstitution />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/article/:id" element={<ArticlePage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          
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

          {/* Edit Article Route */}
          <Route 
            path="/edit-article/:id" 
            element={
              <ProtectedRoute adminOnly={true}>
                <EditArticlePage />
              </ProtectedRoute>
            } 
          />

          {/* 404 Not Found - Must be last */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={12}
        toastOptions={{
          duration: 3500,
          style: {
            background: '#ffffff',
            color: '#1f2937',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
            border: '1px solid #e5e7eb',
            fontSize: '14px',
            fontWeight: '500',
            padding: '16px 20px',
            backdropFilter: 'blur(10px)',
          },
          success: {
            duration: 3000,
            style: {
              background: '#ecfdf5',
              color: '#065f46',
              border: '1px solid #d1fae5',
            },
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#fef2f2',
              color: '#7f1d1d',
              border: '1px solid #fee2e2',
            },
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
          loading: {
            style: {
              background: '#f0f9ff',
              color: '#0c4a6e',
              border: '1px solid #bae6fd',
            },
            iconTheme: {
              primary: '#0284c7',
              secondary: '#ffffff',
            },
          },
          className: 'dark:bg-slate-800 dark:text-gray-100 dark:border-slate-700',
        }}
      />
    </ErrorBoundary>
  );
}

export default App;
