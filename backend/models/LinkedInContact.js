const mongoose = require('mongoose');

const LinkedInContactSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recruiterName: {
    type: String,
    required: [true, 'Please add a recruiter name'],
    trim: true
  },
  companyName: {
    type: String,
    required: [true, 'Please add a company name'],
    trim: true
  },
  role: {
    type: String,
    default: ''
  },
  linkedinUrl: {
    type: String,
    match: [
      /^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/,
      'Please add a valid LinkedIn URL'
    ]
  },
  status: {
    type: String,
    enum: ['Not Contacted', 'Message Sent', 'Replied', 'Referral Received', 'Follow-up Pending', 'Closed'],
    default: 'Not Contacted'
  },
  referralRequested: {
    type: Boolean,
    default: false
  },
  responseReceived: {
    type: Boolean,
    default: false
  },
  followUpDate: {
    type: Date
  },
  notes: {
    type: String,
    default: ''
  },
  tags: [{
    type: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('LinkedInContact', LinkedInContactSchema);
