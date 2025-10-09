const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Reader', 'Admin'], 
    default: 'Reader' 
  },
  // New field for saving bookmarks
  bookmarks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article'
  }]
});

module.exports = mongoose.model('User', UserSchema);