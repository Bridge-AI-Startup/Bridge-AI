const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  applicationId: {
    type: String,
    required: true,
    unique: true
  },
  
  // References
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  jobListingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobListing',
    required: true,
    index: true
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  
  // Application Materials
  resume: {
    fileName: String,
    fileUrl: String,
    uploadedAt: Date,
    s3Key: String
  },
  coverLetter: String,
  portfolio: {
    websiteUrl: String,
    githubUrl: String,
    linkedinUrl: String
  },
  
  // Custom Question Responses
  customResponses: [{
    questionId: mongoose.Schema.Types.ObjectId,
    question: String,
    answer: String
  }],
  
  // AI Match Score
  matchScore: {
    type: Number,
    min: 0,
    max: 100,
    index: -1
  },
  matchBreakdown: {
    technicalSkills: Number,
    experienceLevel: Number,
    cultureFit: Number,
    projectCompatibility: Number
  },
  matchReasons: [String],
  
  // Pipeline Status
  stage: {
    type: String,
    enum: [
      'new',
      'in_review',
      'assessment_sent',
      'assessment_completed',
      'interview_scheduled',
      'interviewed',
      'offer_extended',
      'accepted',
      'rejected',
      'withdrawn'
    ],
    default: 'new',
    index: true
  },
  stageHistory: [{
    stage: String,
    movedAt: Date,
    movedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TeamMember'
    },
    notes: String
  }],
  
  // Internal Management
  internalNotes: [{
    note: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TeamMember'
    },
    addedAt: Date,
    visibility: {
      type: String,
      enum: ['private', 'team'],
      default: 'team'
    }
  }],
  tags: [String],
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  isStarred: {
    type: Boolean,
    default: false
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  
  // Metadata
  appliedAt: {
    type: Date,
    default: Date.now,
    index: -1
  },
  lastActivityAt: Date,
  source: {
    type: String,
    enum: ['direct_apply', 'referral', 'career_fair', 'linkedin', 'other']
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Compound indexes
applicationSchema.index({ jobListingId: 1, candidateId: 1 }, { unique: true });
applicationSchema.index({ companyId: 1, stage: 1 });

module.exports = mongoose.model('Application', applicationSchema);
