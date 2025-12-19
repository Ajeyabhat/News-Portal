/**
 * Submission Routes
 * Defines API endpoints for institution submissions and raw articles
 */

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const uploadWord = require('../middleware/uploadWord');
const {
  createSubmission,
  getPendingSubmissions,
  updateSubmissionStatus,
  getRawArticles,
  updateRawArticle
} = require('../controllers/submissionController');
const {
  uploadWordSubmission,
  getWordSubmission,
  getWordSubmissions,
  updateWordSubmissionStatus,
  deleteWordSubmission,
} = require('../controllers/wordSubmissionController');

// Institution submission routes
router.post('/', auth, createSubmission);            // POST /api/submissions
router.get('/', auth, getPendingSubmissions);        // GET /api/submissions (Admin only)
router.put('/:id', auth, updateSubmissionStatus);    // PUT /api/submissions/:id (Admin only)

// Raw article routes (for external/scrapped content)
// These are accessed via /api/submissions/raw-articles
router.get('/raw-articles', auth, getRawArticles);   // GET /api/submissions/raw-articles
router.put('/raw-articles/:id', auth, updateRawArticle);  // PUT /api/submissions/raw-articles/:id

// Word document submission routes
router.post('/word', auth, uploadWord.single('document'), uploadWordSubmission);  // POST /api/submissions/word
router.get('/word/list', auth, getWordSubmissions);  // GET /api/submissions/word/list (Admin only)
router.get('/word/download/:id', auth, getWordSubmission);  // GET /api/submissions/word/download/:id (Admin only)
router.patch('/word/:id', auth, updateWordSubmissionStatus);  // PATCH /api/submissions/word/:id (Admin only)
router.delete('/word/:id', auth, deleteWordSubmission);  // DELETE /api/submissions/word/:id (Admin only)

module.exports = router;
