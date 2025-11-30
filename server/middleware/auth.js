const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * JWT Authentication Middleware
 * Verifies JWT token and attaches user to request
 */
const auth = async (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1]; // "Bearer <token>"
  if (!token) {
    return res.status(401).json({ msg: 'Token format is invalid' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user in MongoDB
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ msg: 'User not found' });
    }

    // Check if email is verified - REQUIRED before login
    if (!user.emailVerified) {
      return res.status(403).json({ msg: 'Please verify your email first. Check your inbox for verification link.' });
    }

    // Attach user to request
    req.user = {
      id: user._id,
      role: user.role,
      email: user.email,
      username: user.username,
      emailVerified: user.emailVerified
    };
    
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: 'Token expired, please login again' });
    }
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = auth;