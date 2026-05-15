const mongoose = require('mongoose');

const NetworkSchema = new mongoose.Schema({
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
  company: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    default: ''
  },
  linkedinUrl: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Not Contacted', 'Reached Out', 'Replied', 'Meeting Scheduled', 'Referred', 'Inactive'],
    default: 'Not Contacted'
  },
  followUpDate: {
    type: Date
  },
  notes: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    enum: ['Recruiter', 'Alumni', 'Peer', 'Mentor', 'Hiring Manager', 'Other'],
    default: 'Recruiter'
  },
  tags: [String]
}, { timestamps: true });

module.exports = mongoose.model('Network', NetworkSchema);
