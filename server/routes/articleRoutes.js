/**
 * Article Routes
 * Defines all API endpoints for articles
 */

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getAllArticles,
  getTrendingArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle
} = require('../controllers/articleController');

// Public routes (no authentication required)
router.get('/', getAllArticles);              // GET /api/articles
router.get('/trending', getTrendingArticles);  // GET /api/articles/trending
router.get('/:id', getArticleById);           // GET /api/articles/:id

// Protected routes (Admin only)
router.post('/', auth, createArticle);        // POST /api/articles
router.put('/:id', auth, updateArticle);      // PUT /api/articles/:id
router.delete('/:id', auth, deleteArticle);   // DELETE /api/articles/:id

module.exports = router;
