const User = require('../models/User');
const Application = require('../models/Application');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc   Register user
// @route  POST /api/auth/register
// @access Public
const register = async (req, res, next) => {
  console.log('Register called with args:', typeof req, typeof res, typeof next);
  try {
    const { name, email, password, targetRole } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password, targetRole });
    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error('Error in register:', error);
    if (typeof next === 'function') {
      next(error);
    } else {
      res.status(500).json({ success: false, message: error.message, stack: error.stack });
    }
  }
};

// @desc   Login user
// @route  POST /api/auth/login
// @access Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc   Google login/register
// @route  POST /api/auth/google
// @access Public
const googleLogin = async (req, res, next) => {
  try {
    const { credential } = req.body;
    
    if (!credential) {
      return res.status(400).json({ success: false, message: 'Google credential missing' });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      // audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
    });
    
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture: avatar } = payload;

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // If user exists but doesn't have googleId, we can link it
      if (!user.googleId) {
        user.googleId = googleId;
        if (!user.avatar && avatar) user.avatar = avatar;
        await user.save();
      }
    } else {
      // Create new user
      user = await User.create({
        name,
        email,
        googleId,
        avatar
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(500).json({ success: false, message: 'Google authentication failed' });
  }
};

// @desc   Get current user
// @route  GET /api/auth/me
// @access Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Calculate readiness score
    const appCount = await Application.countDocuments({ user: req.user.id });
    const baseScore = user.calculateReadinessScore();
    const activityScore = Math.min(appCount * 2, 20); // Max 20% from activity
    user.readinessScore = Math.min(baseScore + activityScore, 100);
    await user.save();
    
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Update user profile
// @route  PUT /api/auth/profile
// @access Private
const updateProfile = async (req, res) => {
  try {
    const allowedFields = ['name', 'targetRole', 'skills', 'preferredLocation', 'college', 
                           'graduationYear', 'linkedinUrl', 'githubUrl', 'portfolioUrl', 'bio', 'avatar'];
    
    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true, runValidators: true
    });

    // Recalculate readiness
    const baseScore = user.calculateReadinessScore();
    const appCount = await Application.countDocuments({ user: req.user.id });
    const activityScore = Math.min(appCount * 2, 20);
    user.readinessScore = Math.min(baseScore + activityScore, 100);
    await user.save();

    res.status(200).json({ success: true, data: user, message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Change password
// @route  PUT /api/auth/change-password
// @access Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user.id).select('+password');
    const isMatch = await user.matchPassword(currentPassword);
    
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();
    
    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Logout
// @route  GET /api/auth/logout
// @access Private
const logout = async (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const userObj = user.toObject();
  delete userObj.password;
  
  res.status(statusCode).json({
    success: true,
    token,
    data: userObj
  });
};

module.exports = { register, login, googleLogin, getMe, updateProfile, changePassword, logout };
