require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const admin = require('firebase-admin'); // For Firebase Auth

// Import Models
const User = require('./models/User');
const Article = require('./models/Article');
const RawArticle = require('./models/RawArticle');
const Event = require('./models/Event');
// const Subscriber = require('./models/Subscriber'); // We can add this back later

// Import Middleware
const auth = require('./middleware/auth'); // This is our new Firebase auth middleware

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

const resolveLanguage = (value) => {
  const normalized = String(value || 'en').toLowerCase();
  if (normalized === 'kn') return 'kn';
  if (normalized === 'all') return 'en'; // 'all' on create defaults to 'en'
  return 'en';
};
const buildLanguageFilter = (language) => {
  if (language === 'kn') {
    return { contentLanguage: 'kn' };
  }
  if (language === 'all') {
    return {}; // Return all articles regardless of language
  }
  // Default to English (missing contentLanguage field counts as English)
  return {
    $or: [
      { contentLanguage: { $exists: false } },
      { contentLanguage: null },
      { contentLanguage: 'en' }
    ]
  };
};
const matchesLanguage = (article, language) => {
  if (language === 'kn') {
    return article.contentLanguage === 'kn';
  }
  if (language === 'all') {
    return true; // All languages match
  }
  return !article.contentLanguage || article.contentLanguage === 'en';
};

// --- Firebase Admin SDK Initialization ---
const serviceAccount = require('./config/serviceAccountKey.json');

// This check prevents the "already exists" error on server restart
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
    console.log('Firebase Admin initialized.');
  } catch (error) {
    console.error('Firebase Admin initialization error:', error.message);
  }
}
// ------------------------------------

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully!'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- API ROUTES ---

app.get('/', (req, res) => {
  res.send('Hello from the News Portal API!');
});

// --- USER AUTH & DATA ROUTES ---

// This route is now only for saving user details to our database
// after Firebase has already created the user.
app.post('/api/register', async (req, res) => {
  try {
    const { username, email } = req.body; // No password!

    // Check if user already exists in our database
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists in our database.' });
    }

    // Create a new user in our database
    user = new User({
      username,
      email,
      isVerified: true // We trust Firebase's email verification
    });
    
    await user.save();
    res.status(201).json(user);

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// GET LOGGED IN USER (THIS IS THE NEW "LOGIN")
// It gets our MongoDB user data (like role) using the Firebase token.
app.get('/api/auth', auth, async (req, res) => {
  try {
    // req.user is now attached by our new Firebase auth middleware
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.get('/api/users/bookmarks', auth, async (req, res) => {
  try {
    const language = String(req.query.language || 'en').toLowerCase();
    const user = await User.findById(req.user.id).populate('bookmarks');
    const filtered = user.bookmarks.filter((article) => matchesLanguage(article, language));
    res.json(filtered);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- ADMIN-ONLY ROUTES ---
app.get('/api/users', auth, async (req, res) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ msg: 'Access denied. Admins only.' });
  }
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.put('/api/users/:id/role', auth, async (req, res) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ msg: 'Access denied. Admins only.' });
  }
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    user.role = req.body.role === 'Admin' ? 'Admin' : 'Reader';
    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.delete('/api/users/:id', auth, async (req, res) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ msg: 'Access denied. Admins only.' });
  }
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    if (user.id === req.user.id) {
      return res.status(400).json({ msg: 'You cannot delete your own admin account.' });
    }
    await user.deleteOne();
    res.json({ msg: 'User removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.get('/api/raw-articles', auth, async (req, res) => {
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
});

app.put('/api/raw-articles/:id', auth, async (req, res) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ msg: 'Access denied. Admins only.' });
  }
  try {
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
});

// --- ARTICLE & SEARCH ROUTES ---
app.post('/api/articles', auth, async (req, res) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ msg: 'Access denied. Admins only.' });
  }
  try {
    const { title, summary, content, imageUrl, source, category, language } = req.body;
    const newArticle = new Article({
      title,
      summary,
      content,
      imageUrl,
      source,
      category,
      contentLanguage: resolveLanguage(language),
      author: req.user.id,
    });
    const article = await newArticle.save();
    res.status(201).json(article);
  } catch (err) {
    console.error('Article creation error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

app.get('/api/articles', async (req, res) => {
  try {
    const { category } = req.query;
  const language = String(req.query.language || 'en').toLowerCase();
  const languageFilter = buildLanguageFilter(language);
  const filter = { ...languageFilter };
    if (category) {
      filter.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }
    const articles = await Article.find(filter)
      .select('title summary imageUrl source category contentLanguage createdAt')
      .sort({ createdAt: -1 });
    res.json(articles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.get('/api/articles/trending', async (req, res) => {
  try {
    const language = String(req.query.language || 'en').toLowerCase();
    const trendingArticles = await Article.find(buildLanguageFilter(language))
      .select('title contentLanguage')
      .sort({ viewCount: -1 })
      .limit(5);
    res.json(trendingArticles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.get('/api/search', async (req, res) => {
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
    ).sort({ score: { $meta: 'textScore' } });
    res.json(articles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.put('/api/articles/:id', auth, async (req, res) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ msg: 'Access denied. Admins only.' });
  }
  try {
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
});

app.delete('/api/articles/:id', auth, async (req, res) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ msg: 'Access denied. Admins only.' });
  }
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ msg: 'Article not found' });
    }
    await article.deleteOne();
    res.json({ msg: 'Article removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.get('/api/articles/:id', async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id, 
      { $inc: { viewCount: 1 } }, 
      { new: true }
    ).populate('author', 'username');
    if (!article) {
      return res.status(404).json({ msg: 'Article not found' });
    }
    res.json(article);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.post('/api/articles/:id/bookmark', auth, async (req, res) => {
  try {
    const articleId = req.params.id;
    const user = await User.findById(req.user.id);
    const index = user.bookmarks.indexOf(articleId);
    if (index === -1) {
      user.bookmarks.push(articleId);
    } else {
      user.bookmarks.splice(index, 1);
    }
    await user.save();
    res.json(user.bookmarks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- EVENT ROUTES ---
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find({ date: { $gte: new Date() } }).sort({ date: 1 }).limit(5);
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.post('/api/events', auth, async (req, res) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ msg: 'Access denied. Admins only.' });
  }
  try {
    const { title, date, link } = req.body;
    const newEvent = new Event({ title, date, link });
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.delete('/api/events/:id', auth, async (req, res) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ msg: 'Access denied. Admins only.' });
  }
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    await event.deleteOne();
    res.json({ msg: 'Event removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});