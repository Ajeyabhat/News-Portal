/**
 * Submission Routes
 * Defines API endpoints for institution submissions and raw articles
 */

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createSubmission,
  getPendingSubmissions,
  updateSubmissionStatus,
  getRawArticles,
  updateRawArticle
} = require('../controllers/submissionController');

// Institution submission routes
router.post('/', auth, createSubmission);            // POST /api/submissions
router.get('/', auth, getPendingSubmissions);        // GET /api/submissions (Admin only)
router.put('/:id', auth, updateSubmissionStatus);    // PUT /api/submissions/:id (Admin only)

// Raw article routes (for external/scrapped content)
// These are accessed via /api/submissions/raw-articles
router.get('/raw-articles', auth, getRawArticles);   // GET /api/submissions/raw-articles
router.put('/raw-articles/:id', auth, updateRawArticle);  // PUT /api/submissions/raw-articles/:id

module.exports = router;
