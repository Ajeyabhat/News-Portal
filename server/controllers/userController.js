/**
 * User Controller with MongoDB Authentication
 * Handles registration, login, email verification, password reset
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { sendVerificationEmail, sendPasswordResetEmail, sendWelcomeEmail } = require('../config/email');

/**
 * Generate JWT Token
 */
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' } // Token expires in 7 days
  );
};

/**
 * POST /api/users/register
 * Register a new user
 */
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password, role, institutionName } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ msg: 'Please provide username, email, and password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ msg: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ msg: 'Email already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate 6-digit OTP
    const verificationOTP = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Create user with OTP
    const user = new User({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || 'Reader',
      institutionName: institutionName || undefined,
      emailVerified: false,
      verificationOTP,
      verificationOTPExpires: otpExpires
    });

    await user.save();

    console.log('✅ User created:', user.email);
    console.log('🔐 Verification OTP generated:', verificationOTP);

    // Send verification email with OTP
    try {
      await sendVerificationEmail(user.email, user.username, verificationOTP);
      console.log('✅ Verification email sent with OTP');
    } catch (emailError) {
      console.error('⚠️ Email error:', emailError.message);
    }

    // Return success WITHOUT OTP (user must verify email first)
    res.status(201).json({
      msg: 'Registration successful! Please check your email for the verification code.',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        emailVerified: false
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ msg: 'Server error during registration' });
  }
};

/**
 * POST /api/users/login
 * Login user
 */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ msg: 'Please provide email and password' });
    }

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return res.status(403).json({ msg: 'Please verify your email first. Check your inbox for verification link.' });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.json({
      msg: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        institutionName: user.institutionName
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Server error during login' });
  }
};

/**
 * GET /api/users/verify-email/:token
 * Verify email address
 */
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    console.log('\n=== EMAIL VERIFICATION REQUEST ===');
    console.log('🔍 Token received from URL:', token);
    console.log('⏱️  Token length:', token?.length);

    if (!token) {
      console.log('❌ No token provided');
      return res.status(400).json({ msg: 'Invalid or expired verification token' });
    }

    // Find user with this verification token
    console.log('🔎 Searching database for user with this token...');
    const user = await User.findOne({ verificationToken: token });

    if (user) {
      console.log('✅ User found:', user.email);
      console.log('   emailVerified:', user.emailVerified);
      console.log('   storedToken:', user.verificationToken);
      console.log('   tokensMatch:', user.verificationToken === token);
    } else {
      console.log('❌ User NOT found with this token');
      
      // Debug: show what tokens are in DB
      const allUsers = await User.find({ verificationToken: { $exists: true, $ne: null } });
      console.log('📋 Users with verification tokens in DB:', allUsers.length);
      allUsers.forEach(u => {
        console.log(`   - ${u.email}: ${u.verificationToken?.substring(0, 20)}...`);
      });
      
      return res.status(400).json({ msg: 'Invalid or expired verification token' });
    }

    // Check if already verified
    if (user.emailVerified) {
      console.log('⚠️  User already verified');
      return res.json({ msg: 'Email already verified! You can login now.' });
    }

    // Update user
    user.emailVerified = true;
    user.verificationToken = undefined;
    await user.save();

    console.log('✅ User verified successfully:', user.email);

    // Send welcome email
    try {
      await sendWelcomeEmail(user.email, user.username);
    } catch (emailError) {
      console.error('⚠️  Error sending welcome email:', emailError.message);
    }

    console.log('=== VERIFICATION COMPLETE ===\n');
    res.json({ msg: 'Email verified successfully! You can now login.' });
  } catch (err) {
    console.error('❌ Email verification error:', err);
    res.status(500).json({ msg: 'Server error during verification' });
  }
};

/**
 * POST /api/users/verify-email-otp
 * Verify email with OTP code
 */
exports.verifyEmailOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ msg: 'Email and OTP are required' });
    }

    // Find user with this email and OTP
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    // Check if already verified
    if (user.emailVerified) {
      return res.json({ msg: 'Email already verified! You can login now.' });
    }

    // Check if OTP exists and hasn't expired
    if (!user.verificationOTP) {
      return res.status(400).json({ msg: 'No OTP found. Please register again.' });
    }

    if (new Date() > user.verificationOTPExpires) {
      return res.status(400).json({ msg: 'OTP expired. Please register again.' });
    }

    // Verify OTP
    if (user.verificationOTP !== otp.toString()) {
      return res.status(400).json({ msg: 'Invalid OTP' });
    }

    // Mark email as verified
    user.emailVerified = true;
    user.verificationOTP = undefined;
    user.verificationOTPExpires = undefined;
    await user.save();

    console.log('✅ Email verified with OTP:', email);

    // Send welcome email
    try {
      await sendWelcomeEmail(user.email, user.username);
    } catch (emailError) {
      console.error('⚠️  Error sending welcome email:', emailError.message);
    }

    res.json({ msg: 'Email verified successfully! You can now login.' });
  } catch (err) {
    console.error('❌ OTP verification error:', err);
    res.status(500).json({ msg: 'Server error during verification' });
  }
};

/**
 * POST /api/users/forgot-password
 * Send password reset email
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ msg: 'Please provide your email' });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal if email exists
      return res.json({ msg: 'If that email exists, a reset link has been sent' });
    }

    // Generate reset token (expires in 1 hour)
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send reset email
    try {
      await sendPasswordResetEmail(user.email, user.username, resetToken);
    } catch (emailError) {
      console.error('Error sending reset email:', emailError);
      return res.status(500).json({ msg: 'Error sending reset email' });
    }

    res.json({ msg: 'Password reset link sent to your email' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

/**
 * POST /api/users/reset-password/:token
 * Reset password with token
 */
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ msg: 'Password must be at least 6 characters' });
    }

    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid or expired reset token' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ msg: 'Password reset successful! You can now login with your new password.' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

/**
 * GET /api/auth
 * Get logged-in user data (protected route)
 */
exports.getAuthUser = async (req, res) => {
  try {
    // req.user is attached by auth middleware
    const user = await User.findById(req.user.id)
      .select('-password -verificationToken -resetPasswordToken -resetPasswordExpires')
      .populate('bookmarks');

    res.json(user);
  } catch (err) {
    console.error('Get auth user error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

/**
 * POST /api/articles/:id/bookmark
 * Toggle bookmark (protected route)
 */
exports.toggleBookmark = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const articleId = req.params.id;

    const index = user.bookmarks.indexOf(articleId);
    if (index > -1) {
      // Remove bookmark
      user.bookmarks.splice(index, 1);
      await user.save();
      res.json({ msg: 'Bookmark removed', bookmarks: user.bookmarks });
    } else {
      // Add bookmark
      user.bookmarks.push(articleId);
      await user.save();
      res.json({ msg: 'Bookmark added', bookmarks: user.bookmarks });
    }
  } catch (err) {
    console.error('Toggle bookmark error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

/**
 * GET /api/users/bookmarks
 * Get user's bookmarks (protected route)
 */
exports.getUserBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'bookmarks',
      populate: {
        path: 'author',
        select: 'username institutionName name'
      }
    });

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user.bookmarks);
  } catch (err) {
    console.error('Get bookmarks error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

/**
 * GET /api/users
 * Get all users (Admin only)
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password -verificationToken -resetPasswordToken');
    res.json(users);
  } catch (err) {
    console.error('Get all users error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

/**
 * PUT /api/users/:id/role
 * Update user role (Admin only)
 */
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    console.error('Update role error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

/**
 * DELETE /api/users/:id
 * Delete user (Admin only)
 */
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

/**
 * POST /api/users/bulk-delete
 * Delete multiple users (Admin only)
 */
exports.bulkDeleteUsers = async (req, res) => {
  try {
    const { userIds } = req.body;

    // Validation
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ msg: 'Please provide an array of user IDs' });
    }

    // Delete all users
    const result = await User.deleteMany({ _id: { $in: userIds } });

    res.json({ 
      msg: `${result.deletedCount} user(s) deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (err) {
    console.error('Bulk delete users error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};
