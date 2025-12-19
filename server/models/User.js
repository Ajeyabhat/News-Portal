const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  institutionName: {
    type: String, // For institutions, stores their official name
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['Reader', 'Admin', 'Institution'], 
    default: 'Reader' 
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  verificationOTP: {
    type: String
  },
  verificationOTPExpires: {
    type: Date
  },
  verificationToken: {
    type: String
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Performance indexes
// Email already has unique: true, so no need to add explicit index
UserSchema.index({ role: 1 }); // Role-based queries

module.exports = mongoose.model('User', UserSchema);