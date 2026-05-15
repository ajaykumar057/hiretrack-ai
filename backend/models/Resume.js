const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    required: true
  },
  publicId: {
    type: String,
    default: ''
  },
  fileSize: {
    type: Number
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  timesUsed: {
    type: Number,
    default: 0
  },
  callbackCount: {
    type: Number,
    default: 0
  },
  interviewCount: {
    type: Number,
    default: 0
  },
  targetRole: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  },
  version: {
    type: String,
    default: 'v1.0'
  }
}, { timestamps: true });

module.exports = mongoose.model('Resume', ResumeSchema);
