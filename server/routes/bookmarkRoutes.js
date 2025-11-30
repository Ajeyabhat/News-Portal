/**
 * Bookmark Routes
 * Defines all API endpoints for bookmarking articles
 */

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  toggleBookmark
} = require('../controllers/userController');

// All bookmark routes require authentication
// Legacy route for compatibility
router.post('/:id/bookmark', auth, toggleBookmark); // POST /api/bookmarks/:id/bookmark

module.exports = router;

module.exports = router;
