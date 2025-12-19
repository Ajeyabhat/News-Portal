/**
 * Main Server Entry Point
 * This file initializes Express, connects to MongoDB, and registers all API routes
 */

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// ==================== CORS CONFIGURATION ====================
// Environment-based CORS whitelist
let allowedOrigins;

if (process.env.NODE_ENV === 'production') {
  // Production origins (update these when you get a domain)
  allowedOrigins = [
    'https://your-domain.com',           // Replace with your domain
    'https://www.your-domain.com',       // With www
    'https://your-frontend.vercel.app'   // If using Vercel frontend
  ];
} else {
  // Development origins
  allowedOrigins = [
    'http://localhost:3000',   // React frontend
    'http://localhost:5000',   // Express backend
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5000'
  ];
}

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS not allowed for origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// ==================== MIDDLEWARE ====================
app.use(express.json());

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
app.use('/api/search', require('./routes/searchRoutes'));
app.use('/api/submissions', require('./routes/submissionRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api', require('./routes/uploadRoutes'));

// Legacy routes for backward compatibility
const { getAuthUser } = require('./controllers/userController');
const auth = require('./middleware/auth');
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
