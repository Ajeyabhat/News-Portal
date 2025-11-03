const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  // We no longer store the password, Firebase handles it.
  // password: { ... } 

  role: {
    type: String,
    enum: ['Reader', 'Admin'], 
    default: 'Reader' 
  },
  bookmarks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article'
  }],
  
  // We no longer need OTP fields, but we'll keep 'isVerified'
  // and set the default to 'true' as Firebase will handle verification.
  isVerified: {
    type: Boolean,
    default: true
  }
  // otp: { ... }
  // otpExpires: { ... }
});

module.exports = mongoose.model('User', UserSchema);