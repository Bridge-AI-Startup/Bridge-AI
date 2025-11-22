const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  // Student and Company/Job Listing reference
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  jobListingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobListing',
    required: false // Can match with company generally or specific job
  },

  // Overall Match Score (0-100)
  overallScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },

  // Individual Match Factors (each 0-100)
  matchFactors: {
    skillsMatch: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    experienceMatch: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    educationMatch: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    culturalFit: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    locationMatch: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    compensationMatch: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },

  // Match Status
  status: {
    type: String,
    enum: ['pending', 'active', 'contacted', 'interview_scheduled', 'rejected', 'archived'],
    default: 'active'
  },

  // Match Type
  matchType: {
    type: String,
    enum: ['manual', 'ai_generated', 'hybrid'],
    default: 'manual'
  },

  // Notes and Context
  adminNotes: String,
  matchReason: String, // Why this match was created

  // Visibility flags
  visibleToStudent: {
    type: Boolean,
    default: true
  },
  visibleToEmployer: {
    type: Boolean,
    default: true
  },

  // Interaction tracking
  studentViewed: {
    type: Boolean,
    default: false
  },
  studentViewedAt: Date,
  employerViewed: {
    type: Boolean,
    default: false
  },
  employerViewedAt: Date,

  // Match metadata
  createdBy: {
    type: String,
    default: 'admin'
  },
  lastModifiedBy: String,
  expiresAt: Date // Optional expiration for time-sensitive matches

}, {
  timestamps: true
});

// Indexes for efficient queries
matchSchema.index({ studentId: 1, companyId: 1 });
matchSchema.index({ studentId: 1, jobListingId: 1 });
matchSchema.index({ overallScore: -1 });
matchSchema.index({ status: 1 });

module.exports = mongoose.model('Match', matchSchema);
