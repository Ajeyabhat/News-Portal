/**
 * Submission Controller
 * Handles institution article submissions and raw articles
 */

const mongoose = require('mongoose');
const Submission = require('../models/Submission');
const RawArticle = require('../models/RawArticle');
const Article = require('../models/Article');

/**
 * POST /api/submissions
 * Institution submits an article for admin review
 */
exports.createSubmission = async (req, res) => {
  if (req.user.role !== 'Institution') {
    return res.status(403).json({ 
      code: 'PERMISSION_DENIED',
      message: 'Access denied. Only institutions can submit articles.' 
    });
  }
  
  try {
    const { title, summary, content, imageUrl, contentLanguage } = req.body;

    // Validation
    if (!title || !title.trim()) {
      return res.status(400).json({ 
        code: 'TITLE_REQUIRED',
        message: 'Article title is required' 
      });
    }

    if (title.trim().length < 5) {
      return res.status(400).json({ 
        code: 'TITLE_TOO_SHORT',
        message: 'Title must be at least 5 characters' 
      });
    }

    if (!summary || !summary.trim()) {
      return res.status(400).json({ 
        code: 'SUMMARY_REQUIRED',
        message: 'Article summary is required' 
      });
    }

    if (summary.trim().length < 20) {
      return res.status(400).json({ 
        code: 'SUMMARY_TOO_SHORT',
        message: 'Summary should be at least 20 characters' 
      });
    }

    if (!content || !content.trim() || content === '<p><br></p>') {
      return res.status(400).json({ 
        code: 'CONTENT_REQUIRED',
        message: 'Article content cannot be empty' 
      });
    }

    if (!imageUrl || !imageUrl.trim()) {
      return res.status(400).json({ 
        code: 'IMAGE_REQUIRED',
        message: 'Featured image URL is required' 
      });
    }

    const newSubmission = new Submission({
      title: title.trim(),
      summary: summary.trim(),
      content: content.trim(),
      imageUrl: imageUrl.trim(),
      source: req.user.username,
      institutionId: req.user.id,
      status: 'pending',
      contentLanguage: contentLanguage || 'en',
    });

    await newSubmission.save();
    console.log('Submission saved:', newSubmission._id);
    
    res.json({ 
      code: 'SUCCESS',
      message: 'Article submitted successfully! Awaiting admin review.',
      submission: newSubmission 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      code: 'SERVER_ERROR',
      message: 'Server error. Could not submit article. Try again later.'
    });
  }
};

/**
 * GET /api/submissions
 * Get all pending submissions (Admin only)
 */
exports.getPendingSubmissions = async (req, res) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ msg: 'Access denied. Admins only.' });
  }
  
  try {
    const submissions = await Submission.find({ status: 'pending' }).sort({ createdAt: -1 });
    res.json(submissions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * PUT /api/submissions/:id
 * Approve submission and create Article with institution as author (Admin only)
 */
exports.updateSubmissionStatus = async (req, res) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ msg: 'Access denied. Admins only.' });
  }
  
  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ msg: 'Invalid submission ID format' });
    }
    
    const submission = await Submission.findById(req.params.id);
    
    if (!submission) {
      return res.status(404).json({ msg: 'Submission not found' });
    }

    if (submission.status === 'published') {
      return res.status(400).json({ msg: 'This submission has already been published' });
    }

    // Create a new Article with the institution as the author
    const newArticle = new Article({
      title: submission.title,
      summary: submission.summary,
      content: submission.content,
      imageUrl: submission.imageUrl,
      videoUrl: submission.videoUrl,
      source: submission.source, // Institution name
      author: submission.institutionId, // IMPORTANT: Institution is the author, not admin
      category: req.body.category || 'General', // Admin can set category during approval
      contentLanguage: submission.contentLanguage || 'en',
    });

    await newArticle.save();
    console.log('Article created from submission:', newArticle._id);

    // Mark submission as published
    submission.status = 'published';
    await submission.save();
    
    res.json({ 
      msg: 'Submission approved and published as article',
      submission,
      article: newArticle
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * GET /api/raw-articles
 * Get all pending raw articles (Admin only)
 */
exports.getRawArticles = async (req, res) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ msg: 'Access denied. Admins only.' });
  }
  
  try {
    const rawArticles = await RawArticle.find({ status: 'pending' }).sort({ createdAt: -1 });
    res.json(rawArticles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * PUT /api/raw-articles/:id
 * Update raw article status (Admin only)
 */
exports.updateRawArticle = async (req, res) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ msg: 'Access denied. Admins only.' });
  }
  
  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ msg: 'Invalid raw article ID format' });
    }
    
    const rawArticle = await RawArticle.findById(req.params.id);
    if (!rawArticle) {
      return res.status(404).json({ msg: 'Raw article not found' });
    }
    
    rawArticle.status = 'published';
    await rawArticle.save();
    res.json(rawArticle);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
