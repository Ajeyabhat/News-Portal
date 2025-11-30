/**
 * Search Routes
 * Defines API endpoints for searching articles
 */

const express = require('express');
const router = express.Router();
const { searchArticles } = require('../controllers/articleController');

// Public search route
router.get('/', searchArticles);  // GET /api/search?q=query&language=en

module.exports = router;
