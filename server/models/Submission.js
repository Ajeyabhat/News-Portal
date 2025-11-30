const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String, required: true },
  videoUrl: { type: String }, // Optional video URL
  contentLanguage: {
    type: String,
    enum: ['en', 'kn'],
    default: 'en'
  },
  source: { type: String, required: true }, // Institution/School name
  institutionId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the institution user
  status: {
    type: String,
    enum: ['pending', 'published'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Submission', SubmissionSchema);
