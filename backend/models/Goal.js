const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['Applications', 'DSA', 'Networking', 'Interview Prep', 'Learning', 'Other'],
    default: 'Applications'
  },
  target: {
    type: Number,
    required: true,
    min: 1
  },
  current: {
    type: Number,
    default: 0
  },
  unit: {
    type: String,
    default: 'tasks'
  },
  deadline: {
    type: Date
  },
  completed: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  streak: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Goal', GoalSchema);
