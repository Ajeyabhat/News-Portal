const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  summary: { type: String, required: true }, // For the ArticleCard preview
  content: { type: String, required: true }, // Rich text content with HTML (text, images, videos)
  imageUrl: { type: String, required: true }, // The main featured image
  source: { type: String },
  category: { type: String, required: true },
  contentLanguage: {
    type: String,
    enum: ['en', 'kn', 'all'],
    default: 'en',
    required: true,
  },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  media: [
    {
      type: { type: String, enum: ['image', 'video'], default: 'image' },
      url: { type: String, required: true },
      caption: { type: String }
    }
  ], // Array to store embedded media references
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  viewCount: { type: Number, default: 0 }
});

// Update the index to also search the new 'content' field
ArticleSchema.index({ title: 'text', summary: 'text', content: 'text' });

module.exports = mongoose.model('Article', ArticleSchema);