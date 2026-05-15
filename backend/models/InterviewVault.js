const mongoose = require('mongoose');

const InterviewVaultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true
  },
  round: {
    type: String,
    enum: ['OA', 'Technical Round 1', 'Technical Round 2', 'System Design', 'HR', 'Managerial', 'Final'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  outcome: {
    type: String,
    enum: ['Cleared', 'Rejected', 'Pending'],
    default: 'Pending'
  },
  questions: [{
    question: String,
    category: {
      type: String,
      enum: ['DSA', 'System Design', 'HR', 'Technical', 'Behavioral']
    },
    notes: String
  }],
  experience: {
    type: String,
    default: ''
  },
  tips: {
    type: String,
    default: ''
  },
  interviewDate: {
    type: Date,
    default: Date.now
  },
  duration: {
    type: Number // in minutes
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  tags: [String]
}, { timestamps: true });

module.exports = mongoose.model('InterviewVault', InterviewVaultSchema);
