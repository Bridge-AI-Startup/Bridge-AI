const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  companyId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  companyName: {
    type: String,
    required: true,
    index: 'text'
  },
  companyWebsite: String,
  
  // Logo
  companyLogo: {
    fileName: String,
    fileUrl: String,
    fileSize: Number,
    uploadedAt: Date,
    s3Key: String
  },
  
  // About
  oneSentencePitch: String,
  companyDescription: String,
  
  // Location
  headquarters: {
    city: String,
    state: String,
    country: String,
    timezone: String
  },
  
  // Details
  foundedYear: Number,
  industry: String,
  companySize: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '501+']
  },
  fundingStage: {
    type: String,
    enum: ['pre_seed', 'seed', 'series_a', 'series_b', 'series_c', 'public', 'bootstrapped']
  },
  
  // Culture
  companyValues: [String],
  benefits: [String],
  
  // Social Links
  socialLinks: {
    linkedin: String,
    twitter: String,
    github: String
  },
  
  // Settings
  settings: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    autoMatchEnabled: {
      type: Boolean,
      default: false
    },
    assessmentsRequired: {
      type: Boolean,
      default: false
    }
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  onboardingCompleted: {
    type: Boolean,
    default: false
  },
  setupMethod: {
    type: String,
    enum: ['ai', 'manual']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Company', companySchema);
