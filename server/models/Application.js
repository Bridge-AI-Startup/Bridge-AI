const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  applicationId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // References - Single source of truth
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
  
  // Denormalized ONLY for performance in list views
  // These are updated via hooks when User/Company changes
  candidateName: String,  // For quick display in lists
  candidateEmail: String, // For notifications without extra query
  
  // Application-Specific Data (not in User model)
  applicationMaterials: {
    // Override resume if different from profile
    customResume: {
      fileName: String,
      fileUrl: String,
      uploadedAt: Date
    },
    coverLetter: String,
    // Additional materials specific to this application
    additionalDocuments: [{
      fileName: String,
      fileUrl: String,
      fileSize: Number,
      uploadedAt: Date
    }]
  },
  
  // Custom Responses (Application-specific)
  customResponses: [{
    questionId: mongoose.Schema.Types.ObjectId,
    question: String,
    answer: mongoose.Schema.Types.Mixed // Can be string, array, or file URL
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
    projectCompatibility: Number,
    educationMatch: Number
  },
  matchReasons: [String],
  matchDetails: {
    matchedSkills: [String],
    missingSkills: [String],
    experienceGap: String,
    strengths: [String]
  },
  
  // Pipeline Status
  stage: {
    type: String,
    enum: [
      'new',
      'in_review',
      'assessment_sent',
      'assessment_in_progress',
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
    movedAt: {
      type: Date,
      default: Date.now
    },
    movedBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'stageHistory.movedByModel'
    },
    movedByModel: {
      type: String,
      enum: ['User', 'Company']
    },
    notes: String,
    automated: {
      type: Boolean,
      default: false
    }
  }],
  
  // Assessment Results (References Assessment model)
  assessments: [{
    assessmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assessment'
    },
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'completed', 'overdue', 'skipped'],
      default: 'not_started'
    },
    score: Number,
    percentile: Number, // How they ranked vs other candidates
    startedAt: Date,
    completedAt: Date,
    timeAllowed: Number,
    timeTaken: Number,
    dueDate: Date,
    submissionUrl: String, // Link to detailed submission
    feedback: String,
    evaluatorNotes: String,
    evaluatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    evaluatedAt: Date
  }],
  
  // Interview References (stores interview IDs)
  interviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview'
  }],
  
  // Interview Summary (denormalized for quick view)
  interviewSummary: {
    totalScheduled: {
      type: Number,
      default: 0
    },
    completed: {
      type: Number,
      default: 0
    },
    averageRating: Number,
    overallRecommendation: {
      type: String,
      enum: ['strong_hire', 'hire', 'no_hire', 'strong_no_hire', 'pending']
    }
  },
  
  // Offer Details (Application-specific)
  offer: {
    status: {
      type: String,
      enum: ['pending', 'sent', 'accepted', 'declined', 'expired', 'withdrawn']
    },
    sentAt: Date,
    expiresAt: Date,
    respondedAt: Date,
    offerDetails: {
      position: String,
      compensation: Number,
      currency: String,
      startDate: Date,
      endDate: Date,
      duration: String,
      equity: Number,
      benefits: [String],
      additionalTerms: String
    },
    offerLetter: {
      fileName: String,
      fileUrl: String,
      sentVia: String // email, platform, etc.
    },
    declineReason: String,
    negotiations: [{
      date: Date,
      type: String, // salary, start_date, equity, etc.
      request: String,
      response: String,
      status: {
        type: String,
        enum: ['pending', 'accepted', 'declined', 'counter']
      }
    }]
  },
  
  // Communication Log
  communications: [{
    communicationId: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId()
    },
    type: {
      type: String,
      enum: ['email', 'message', 'call', 'note', 'automated']
    },
    direction: {
      type: String,
      enum: ['inbound', 'outbound']
    },
    subject: String,
    content: String,
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'communications.sentByModel'
    },
    sentByModel: {
      type: String,
      enum: ['User', 'Company']
    },
    sentTo: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'communications.sentToModel'
    },
    sentToModel: {
      type: String,
      enum: ['User', 'Company']
    },
    sentAt: {
      type: Date,
      default: Date.now
    },
    emailOpened: Boolean,
    emailOpenedAt: Date,
    linkClicked: Boolean,
    linkClickedAt: Date,
    attachments: [{
      fileName: String,
      fileUrl: String
    }]
  }],
  
  // Internal Notes & Tags
  internalNotes: [{
    noteId: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId()
    },
    note: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    },
    visibility: {
      type: String,
      enum: ['private', 'team', 'company'],
      default: 'team'
    },
    category: {
      type: String,
      enum: ['general', 'technical', 'cultural', 'concern', 'strength']
    }
  }],
  
  tags: [String],
  
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  
  // Flags
  isStarred: {
    type: Boolean,
    default: false
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  isPriority: {
    type: Boolean,
    default: false
  },
  
  // Metadata
  appliedAt: {
    type: Date,
    default: Date.now,
    index: -1
  },
  lastActivityAt: {
    type: Date,
    default: Date.now
  },
  lastViewedAt: Date,
  lastViewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  source: {
    type: String,
    enum: ['direct_apply', 'referral', 'career_fair', 'linkedin', 'campus', 'website', 'other']
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  referralCode: String,
  
  // Rejection details
  rejectionReason: String,
  rejectionCategory: {
    type: String,
    enum: ['qualifications', 'experience', 'cultural_fit', 'position_filled', 'other']
  },
  rejectedAt: Date,
  rejectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Withdrawal details
  withdrawalReason: String,
  withdrawnAt: Date
  
}, {
  timestamps: true
});

// Compound Indexes
applicationSchema.index({ jobListingId: 1, candidateId: 1 }, { unique: true });
applicationSchema.index({ companyId: 1, stage: 1 });
applicationSchema.index({ companyId: 1, isStarred: 1 });

// Update lastActivityAt on any change
applicationSchema.pre('save', function(next) {
  this.lastActivityAt = new Date();
  next();
});

// Method to get candidate info (with populated data)
applicationSchema.methods.getFullCandidateInfo = async function() {
  await this.populate('candidateId');
  return {
    application: this,
    candidate: this.candidateId,
    resume: this.applicationMaterials.customResume || this.candidateId.resume,
    socialLinks: this.candidateId.socialLinks,
    projects: this.candidateId.projects,
    experience: this.candidateId.experience,
    skills: this.candidateId.skills
  };
};

// Method to add stage history
applicationSchema.methods.moveToStage = function(newStage, movedBy, notes = '', automated = false) {
  this.stage = newStage;
  this.stageHistory.push({
    stage: newStage,
    movedAt: new Date(),
    movedBy: movedBy,
    movedByModel: 'User', // or 'Company' based on context
    notes: notes,
    automated: automated
  });
  return this.save();
};

// Static method to get pipeline statistics
applicationSchema.statics.getPipelineStats = function(jobListingId) {
  return this.aggregate([
    { $match: { jobListingId: mongoose.Types.ObjectId(jobListingId) } },
    {
      $group: {
        _id: '$stage',
        count: { $sum: 1 },
        avgMatchScore: { $avg: '$matchScore' }
      }
    }
  ]);
};

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
