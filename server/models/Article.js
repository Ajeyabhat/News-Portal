const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  imageUrl: { type: String, required: true },
  source: { type: String },
  category: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  viewCount: { type: Number, default: 0 }
});

// New: Add a text index to the title and summary fields for searching
ArticleSchema.index({ title: 'text', summary: 'text' });

module.exports = mongoose.model('Article', ArticleSchema);