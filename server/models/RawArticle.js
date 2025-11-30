const mongoose = require('mongoose');

const RawArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true, unique: true },
  source: { type: String },
  videoUrl: { type: String }, // Optional video URL
  status: { 
    type: String, 
    enum: ['pending', 'published'], 
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RawArticle', RawArticleSchema);