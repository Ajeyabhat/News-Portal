require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// We no longer need bcryptjs, jsonwebtoken, nodemailer, or crypto
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer');
// const crypto = require('crypto');

// Import Models
const User = require('./models/User');
const Article = require('./models/Article');
const RawArticle = require('./models/RawArticle');
const Event = require('./models/Event');

// Import Middleware
const auth = require('./middleware/auth'); // This is our new Firebase auth middleware

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --- (We removed the Nodemailer transporter) ---

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
    const { username, email } = req.body;

    // Check if user already exists in our database
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists in our database.' });
    }

    // Create a new user in our database
    // We don't save a password here, as Firebase handles that.
    user = new User({
      username,
      email,
      // isVerified will be true by default in the new User model
    });
    
    await user.save();
    res.status(201).json(user);

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// --- (We removed the /api/login route, Firebase handles it) ---
// --- (We removed the /api/verify-otp route, Firebase handles it) ---

// This route is now the MOST IMPORTANT auth route.
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
    const user = await User.findById(req.user.id).populate('bookmarks');
    res.json(user.bookmarks);
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
    const { title, summary, imageUrl, source, category } = req.body;
    const newArticle = new Article({
      title, summary, imageUrl, source, category, author: req.user.id
    });
    const article = await newArticle.save();
    res.status(201).json(article);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.get('/api/articles', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category) {
      filter.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }
    const articles = await Article.find(filter).sort({ createdAt: -1 });
    res.json(articles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.get('/api/articles/trending', async (req, res) => {
  try {
    const trendingArticles = await Article.find().sort({ viewCount: -1 }).limit(5);
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
    const articles = await Article.find(
      { $text: { $search: query } },
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
    const { title, summary, imageUrl, source, category } = req.body;
    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      { title, summary, imageUrl, source, category },
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