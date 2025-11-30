/**
 * Article Controller
 * Handles all article-related business logic (CRUD operations, search, trending)
 */

const mongoose = require('mongoose');
const sanitizeHtml = require('sanitize-html');
const Article = require('../models/Article');
const { buildLanguageFilter, resolveLanguage } = require('../utils/languageHelpers');

/**
 * GET /api/articles
 * Get all articles with optional filtering by category and language
 */
exports.getAllArticles = async (req, res) => {
  try {
    const { category } = req.query;
    const language = String(req.query.language || 'en').toLowerCase();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const skip = (page - 1) * limit;
    
    const languageFilter = buildLanguageFilter(language);
    const filter = { ...languageFilter };
    
    if (category) {
      filter.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }
    
    const [articles, total] = await Promise.all([
      Article.find(filter)
        .populate('author', 'username institutionName name')
        .select('title summary imageUrl videoUrl source category contentLanguage createdAt author viewCount')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Article.countDocuments(filter)
    ]);
    
    res.json({
      articles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * GET /api/articles/trending
 * Get top 5 trending articles based on view count
 */
exports.getTrendingArticles = async (req, res) => {
  try {
    const language = String(req.query.language || 'en').toLowerCase();
    const trendingArticles = await Article.find(buildLanguageFilter(language))
      .populate('author', 'username institutionName name')
      .select('title contentLanguage author')
      .sort({ viewCount: -1 })
      .limit(5);
      
    res.json(trendingArticles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * GET /api/articles/:id
 * Get single article by ID and increment view count
 */
exports.getArticleById = async (req, res) => {
  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ msg: 'Invalid article ID format' });
    }
    
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { $inc: { viewCount: 1 } }, // Increment view count
      { new: true }
    ).populate('author', 'username institutionName name');
    
    if (!article) {
      return res.status(404).json({ msg: 'Article not found' });
    }
    
    res.json(article);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * POST /api/articles
 * Create a new article (Admin only)
 */
exports.createArticle = async (req, res) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ 
      code: 'PERMISSION_DENIED',
      message: 'Access denied. Admins only.' 
    });
  }
  
  try {
    const { title, summary, content, imageUrl, source, category, language } = req.body;

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
        message: 'Article summary is required for preview cards' 
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

    if (!category || !category.trim()) {
      return res.status(400).json({ 
        code: 'CATEGORY_REQUIRED',
        message: 'Article category is required' 
      });
    }

    // Sanitize HTML content to prevent XSS attacks
    const sanitizedContent = sanitizeHtml(content, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'video', 'iframe']),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        img: ['src', 'alt', 'title', 'width', 'height'],
        video: ['src', 'controls', 'width', 'height'],
        iframe: ['src', 'width', 'height', 'frameborder', 'allowfullscreen'],
        a: ['href', 'name', 'target']
      },
      allowedSchemes: ['http', 'https', 'mailto']
    });

    const newArticle = new Article({
      title: title.trim(),
      summary: summary.trim(),
      content: sanitizedContent,
      imageUrl: imageUrl.trim(),
      source: source ? source.trim() : '',
      category: category.trim(),
      contentLanguage: resolveLanguage(language),
    });

    await newArticle.save();
    console.log('Article created:', newArticle._id);
    
    res.json({
      code: 'SUCCESS',
      message: 'Article published successfully!',
      article: newArticle
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      code: 'SERVER_ERROR',
      message: 'Server error. Could not publish article. Try again later.'
    });
  }
};

/**
 * PUT /api/articles/:id
 * Update an existing article (Admin only)
 */
exports.updateArticle = async (req, res) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ msg: 'Access denied. Admins only.' });
  }
  
  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ msg: 'Invalid article ID format' });
    }
    
    const { title, summary, content, imageUrl, source, category, language } = req.body;
    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      {
        title,
        summary,
        content,
        imageUrl,
        source,
        category,
        contentLanguage: resolveLanguage(language),
      },
      { new: true }
    );
    
    if (!updatedArticle) {
      return res.status(404).json({ msg: 'Article not found' });
    }
    
    res.json(updatedArticle);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * DELETE /api/articles/:id
 * Delete article (Admin only)
 */
exports.deleteArticle = async (req, res) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ msg: 'Access denied. Admins only.' });
  }
  
  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ msg: 'Invalid article ID format' });
    }
    
    const article = await Article.findById(req.params.id)
      .populate('author', 'username institutionName name');
      
    if (!article) {
      return res.status(404).json({ msg: 'Article not found' });
    }
    
    await article.deleteOne();
    res.json({ msg: 'Article removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * GET /api/search
 * Search articles using full-text search with language filtering
 */
exports.searchArticles = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ msg: 'Search query is required' });
    }
    
    const language = String(req.query.language || 'en').toLowerCase();
    const languageFilter = buildLanguageFilter(language);
    
    const articles = await Article.find(
      {
        $and: [
          { $text: { $search: query } },
          languageFilter,
        ],
      },
      { score: { $meta: 'textScore' } }
    )
    .populate('author', 'username institutionName name')
    .sort({ score: { $meta: 'textScore' } });
    
    res.json(articles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
