/**
 * Main Server Entry Point
 * This file initializes Express, connects to MongoDB, and registers all API routes
 */

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// ==================== MIDDLEWARE ====================
app.use(cors());
app.use(express.json());

// Serve uploaded images as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ==================== DATABASE CONNECTION ====================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ==================== API ROUTES ====================

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to News Portal API',
    version: '2.0',
    status: 'Server is running'
  });
});

// Import and register route modules
app.use('/api/articles', require('./routes/articleRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/bookmarks', require('./routes/bookmarkRoutes'));
app.use('/api/search', require('./routes/searchRoutes'));
app.use('/api/submissions', require('./routes/submissionRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api', require('./routes/uploadRoutes'));

// Legacy routes for backward compatibility
const { toggleBookmark, getAuthUser } = require('./controllers/userController');
const auth = require('./middleware/auth');
app.post('/api/articles/:id/bookmark', auth, toggleBookmark);
app.get('/api/auth', auth, getAuthUser); // Legacy auth route

// ==================== ERROR HANDLING ====================

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.path}`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
});

// ==================== START SERVER ====================
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app; // For testing purposes
