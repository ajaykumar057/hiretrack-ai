const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['Saved', 'Applied', 'OA', 'Interview', 'Offer', 'Rejected'],
    default: 'Applied'
  },
  salary: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  jobLink: {
    type: String,
    default: ''
  },
  recruiterName: {
    type: String,
    default: ''
  },
  recruiterEmail: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  },
  appliedDate: {
    type: Date,
    default: Date.now
  },
  followUpDate: {
    type: Date
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  workMode: {
    type: String,
    enum: ['Remote', 'Hybrid', 'Onsite', ''],
    default: ''
  },
  companyType: {
    type: String,
    enum: ['Startup', 'MNC', 'Product', 'Service', 'FAANG', ''],
    default: ''
  },
  techStack: [{
    type: String
  }],
  resumeVersion: {
    type: String,
    default: ''
  },
  source: {
    type: String,
    enum: ['LinkedIn', 'Naukri', 'Company Website', 'Referral', 'Campus', 'Other', ''],
    default: ''
  },
  tags: [{
    type: String
  }],
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  offerDetails: {
    ctc: String,
    joiningDate: Date,
    benefits: String
  },
  rejectionReason: {
    type: String,
    enum: ['Resume', 'OA', 'Technical Interview', 'HR Interview', 'No Response', 'Other', ''],
    default: ''
  }
}, { timestamps: true });

ApplicationSchema.index({ user: 1, status: 1 });
ApplicationSchema.index({ user: 1, appliedDate: -1 });

module.exports = mongoose.model('Application', ApplicationSchema);
