import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Skeleton from './components/Skeleton';

// Lazy loaded pages for code splitting (performance optimization)
const HomePage = lazy(() => import('./pages/HomePage'));
const Register = lazy(() => import('./pages/Register'));
const RegisterInstitution = lazy(() => import('./pages/RegisterInstitution'));
const Login = lazy(() => import('./pages/Login'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const ArticlePage = lazy(() => import('./pages/ArticlePage'));
const BookmarksPage = lazy(() => import('./pages/BookmarksPage'));
const SearchResultsPage = lazy(() => import('./pages/SearchResultsPage'));
const EditArticlePage = lazy(() => import('./pages/EditArticlePage'));
const InstitutionDashboard = lazy(() => import('./pages/InstitutionDashboard'));
const UserManagement = lazy(() => import('./pages/admin/AdminUserManagement'));
const ContentManager = lazy(() => import('./pages/admin/AdminContentPage'));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const EventManager = lazy(() => import('./pages/admin/AdminEventManager'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const NotFound = lazy(() => import('./pages/NotFound'));


function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Skeleton />}>
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
      </Suspense>
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
