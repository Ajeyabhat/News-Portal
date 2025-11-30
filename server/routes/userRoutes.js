/**
 * User Routes
 * Defines all API endpoints for user management and authentication
 */

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  registerUser,
  loginUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getAuthUser,
  getUserBookmarks,
  getAllUsers,
  updateUserRole,
  deleteUser
} = require('../controllers/userController');

// Public routes
router.post('/register', registerUser);                    // POST /api/users/register
router.post('/login', loginUser);                          // POST /api/users/login
router.get('/verify-email/:token', verifyEmail);           // GET /api/users/verify-email/:token
router.post('/forgot-password', forgotPassword);           // POST /api/users/forgot-password
router.post('/reset-password/:token', resetPassword);      // POST /api/users/reset-password/:token

// Protected routes (authentication required)
router.get('/auth', auth, getAuthUser);                    // GET /api/users/auth
router.get('/bookmarks', auth, getUserBookmarks);           // GET /api/users/bookmarks

// Admin-only routes
router.get('/', auth, getAllUsers);                        // GET /api/users
router.put('/:id/role', auth, updateUserRole);             // PUT /api/users/:id/role
router.delete('/:id', auth, deleteUser);                   // DELETE /api/users/:id

module.exports = router;
