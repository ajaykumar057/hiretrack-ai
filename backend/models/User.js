const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: false,
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  avatar: {
    type: String,
    default: ''
  },
  targetRole: {
    type: String,
    default: ''
  },
  skills: [{
    type: String
  }],
  preferredLocation: {
    type: String,
    default: ''
  },
  college: {
    type: String,
    default: ''
  },
  graduationYear: {
    type: Number
  },
  linkedinUrl: {
    type: String,
    default: ''
  },
  githubUrl: {
    type: String,
    default: ''
  },
  portfolioUrl: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  readinessScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  profileCompleted: {
    type: Boolean,
    default: false
  },
  theme: {
    type: String,
    enum: ['dark', 'light'],
    default: 'dark'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Match password
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Calculate readiness score
UserSchema.methods.calculateReadinessScore = function() {
  let score = 0;
  if (this.name) score += 5;
  if (this.email) score += 5;
  if (this.targetRole) score += 10;
  if (this.skills && this.skills.length > 0) score += 15;
  if (this.preferredLocation) score += 5;
  if (this.college) score += 5;
  if (this.linkedinUrl) score += 10;
  if (this.githubUrl) score += 10;
  if (this.portfolioUrl) score += 10;
  if (this.bio) score += 5;
  return Math.min(score, 80); // Max 80% from profile, rest from activity
};

module.exports = mongoose.model('User', UserSchema);
