const mongoose = require('mongoose');

const wordSubmissionSchema = new mongoose.Schema(
  {
    institutionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    institutionName: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileBuffer: {
      type: Buffer,
      required: true,
    },
    mimetype: {
      type: String,
      enum: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'],
      required: true,
    },
    extractedData: {
      title: String,
      summary: String,
      content: String,
      contentLanguage: String,
    },
    status: {
      type: String,
      enum: ['pending', 'reviewing', 'published', 'rejected'],
      default: 'pending',
    },
    adminNotes: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
);

module.exports = mongoose.model('WordSubmission', wordSubmissionSchema);
