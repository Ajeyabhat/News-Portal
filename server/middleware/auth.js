const admin = require('firebase-admin');
const User = require('../models/User'); // We still need our User model

// Initialize Firebase Admin (only do this once)
try {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(), // Tries to find service account key
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
  console.log('Firebase Admin initialized.');
} catch (error) {
  if (error.code !== 'app/duplicate-app') {
    console.error('Firebase Admin initialization error:', error);
  }
}

const auth = async (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1]; // "Bearer <token>"
  if (!token) {
    return res.status(401).json({ msg: 'Token format is invalid' });
  }

  try {
    // Verify the token using Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Find the user in our *own* MongoDB database
    // We use the email from the Firebase token to find our user
    const user = await User.findOne({ email: decodedToken.email });

    if (!user) {
      return res.status(401).json({ msg: 'User not found in our database.' });
    }

    // Attach our MongoDB user (not the Firebase user) to the request
    req.user = {
      id: user._id, // Our MongoDB user ID
      role: user.role,
      email: user.email
    };
    
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = auth;