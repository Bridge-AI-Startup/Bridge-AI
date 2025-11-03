const mongoose = require('mongoose');

const jobListingSchema = new mongoose.Schema({
  listingId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // Company Reference
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  companyName: String, // denormalized
  
  // Basic Information
  roleTitle: {
    type: String,
    required: true
  },
  department: {
    type: String,
    enum: ['Engineering', 'Design', 'Data Science', 'Product', 'Marketing', 
           'Sales', 'Operations', 'Other']
  },
  roleDescription: {
    type: String,
    required: true
  },
  
  // Responsibilities & Qualifications
  keyResponsibilities: [String],
  qualifications: [String],
  
  // Skills
  requiredSkills: [{
    skillId: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId()
    },
    skillName: String,
    proficiencyLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced']
    }
  }],
  preferredSkills: [String],
  
  // Work Details
  workDetails: {
    locationType: {
      type: String,
      required: true,
      enum: ['remote', 'hybrid', 'in_person']
    },
    officeLocation: {
      city: String,
      state: String,
      country: String
    },
    startDate: Date,
    endDate: Date,
    duration: String,
    hoursPerWeek: {
      type: Number,
      required: true
    },
    schedule: String
  },
  
  // Compensation
  compensation: {
    type: {
      type: String,
      enum: ['paid', 'unpaid', 'for_credit', 'stipend']
    },
    salary: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: 'USD'
      },
      period: {
        type: String,
        enum: ['hourly', 'weekly', 'monthly', 'total']
      }
    },
    equityOffer: {
      hasEquity: Boolean,
      percentage: Number
    },
    benefits: [String]
  },
  
  // AI Matching
  aiMatching: {
    enabled: {
      type: Boolean,
      default: true
    },
    autoMatchThreshold: {
      type: Number,
      default: 75
    },
    matchingCriteria: {
      skillsWeight: {
        type: Number,
        default: 40
      },
      experienceWeight: {
        type: Number,
        default: 30
      },
      educationWeight: {
        type: Number,
        default: 15
      },
      projectsWeight: {
        type: Number,
        default: 15
      }
    }
  },
  
  // Application Settings
  applicationSettings: {
    requireResume: {
      type: Boolean,
      default: true
    },
    requireCoverLetter: {
      type: Boolean,
      default: false
    },
    customQuestions: [{
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId()
      },
      question: String,
      type: {
        type: String,
        enum: ['text', 'multiple_choice', 'file_upload']
      },
      required: Boolean
    }]
  },
  
  // Assessment Requirements
  assessments: [{
    assessmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assessment'
    },
    assessmentType: {
      type: String,
      enum: ['coding', 'technical', 'behavioral']
    },
    title: String,
    required: Boolean,
    timeLimit: Number
  }],
  
  // Application Statistics
  stats: {
    totalApplicants: {
      type: Number,
      default: 0
    },
    newApplicants: {
      type: Number,
      default: 0
    },
    inReview: {
      type: Number,
      default: 0
    },
    interviewed: {
      type: Number,
      default: 0
    },
    offered: {
      type: Number,
      default: 0
    },
    accepted: {
      type: Number,
      default: 0
    },
    rejected: {
      type: Number,
      default: 0
    },
    averageMatchScore: {
      type: Number,
      default: 0
    },
    totalViews: {
      type: Number,
      default: 0
    }
  },
  
  // Status & Visibility
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'closed', 'filled'],
    default: 'draft',
    index: true
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'invite_only'],
    default: 'public'
  },
  
  // Dates
  postedAt: Date,
  applicationDeadline: Date,
  closedAt: Date,
  
  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  tags: [String],
  importedFrom: String,
  externalId: String
}, {
  timestamps: true
});

// Indexes
jobListingSchema.index({ 'requiredSkills.skillName': 1 });
jobListingSchema.index({ roleTitle: 'text', roleDescription: 'text' });
jobListingSchema.index({ postedAt: -1 });

const JobListing = mongoose.model('JobListing', jobListingSchema);

module.exports = JobListing;
