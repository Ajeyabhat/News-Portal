/**
 * User Routes
 * Defines all API endpoints for user management and authentication
 */

const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { ipKeyGenerator } = require('express-rate-limit');
const auth = require('../middleware/auth');
const {
  registerUser,
  loginUser,
  verifyEmail,
  verifyEmailOTP,
  forgotPassword,
  resetPassword,
  getAuthUser,
  getUserBookmarks,
  getAllUsers,
  updateUserRole,
  deleteUser
} = require('../controllers/userController');

// ==================== RATE LIMITERS ====================
// Login rate limiter: 5 attempts per 15 minutes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: {
    code: 'RATE_LIMIT_EXCEEDED',
    msg: 'Too many login attempts. Please try again in 15 minutes or use password reset.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use email as identifier for consistent rate limiting, fallback to IP
    return req.body.email ? `login-${req.body.email}` : ipKeyGenerator(req);
  }
});

// Register rate limiter: 3 attempts per hour
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 registration attempts
  message: {
    code: 'RATE_LIMIT_EXCEEDED',
    msg: 'Too many registration attempts. Please try again in 1 hour.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.body.email ? `register-${req.body.email}` : ipKeyGenerator(req);
  }
});

// Forgot password limiter: 3 attempts per hour
const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 attempts
  message: {
    code: 'RATE_LIMIT_EXCEEDED',
    msg: 'Too many password reset requests. Please try again in 1 hour.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.body.email ? `forgot-${req.body.email}` : ipKeyGenerator(req);
  }
});

// ==================== PUBLIC ROUTES ====================
router.post('/register', registerLimiter, registerUser);                    // POST /api/users/register
router.post('/login', loginLimiter, loginUser);                              // POST /api/users/login
router.get('/verify-email/:token', verifyEmail);                             // GET /api/users/verify-email/:token (kept for backward compatibility)
router.post('/verify-email-otp', verifyEmailOTP);                            // POST /api/users/verify-email-otp
router.post('/forgot-password', forgotPasswordLimiter, forgotPassword);      // POST /api/users/forgot-password
router.post('/reset-password/:token', resetPassword);                        // POST /api/users/reset-password/:token

// ==================== PROTECTED ROUTES ====================
router.get('/auth', auth, getAuthUser);                    // GET /api/users/auth
router.get('/bookmarks', auth, getUserBookmarks);           // GET /api/users/bookmarks

// ==================== ADMIN-ONLY ROUTES ====================
router.get('/', auth, getAllUsers);                        // GET /api/users
router.put('/:id/role', auth, updateUserRole);             // PUT /api/users/:id/role
router.delete('/:id', auth, deleteUser);                   // DELETE /api/users/:id

module.exports = router;
