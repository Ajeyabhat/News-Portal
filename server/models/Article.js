const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  summary: { type: String, required: true }, // For the ArticleCard preview
  content: { type: String, required: true }, // Rich text content with HTML (text, images, videos)
  imageUrl: { type: String, required: true }, // The main featured image
  videoUrl: { type: String }, // Optional featured video URL
  source: { type: String },
  category: { type: String, required: true },
  contentLanguage: {
    type: String,
    enum: ['en', 'kn', 'all'],
    default: 'en',
    required: true,
  },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  wordSubmissionId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'WordSubmission',
    optional: true
  }, // Optional reference to source Word document
  media: [
    {
      type: { type: String, enum: ['image', 'video'], default: 'image' },
      url: { type: String, required: true },
      caption: { type: String }
    }
  ], // Array to store embedded media references (optional)
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  viewCount: { type: Number, default: 0 }
});

// Text search index
ArticleSchema.index({ title: 'text', summary: 'text', content: 'text' });

// Performance indexes for frequent queries
ArticleSchema.index({ contentLanguage: 1, createdAt: -1 }); // Language + date sorting
ArticleSchema.index({ category: 1, createdAt: -1 }); // Category filtering
ArticleSchema.index({ author: 1 }); // Author lookups
ArticleSchema.index({ viewCount: -1 }); // Trending articles

module.exports = mongoose.model('Article', ArticleSchema);