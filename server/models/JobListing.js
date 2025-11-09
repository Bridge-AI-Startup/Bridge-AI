const mongoose = require('mongoose');

const jobListingSchema = new mongoose.Schema({
  listingId: {
    type: String,
    required: true,
    unique: true
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  
  // Basic Info
  roleTitle: {
    type: String,
    required: true,
    index: 'text'
  },
  department: String,
  roleDescription: {
    type: String,
    required: true,
    index: 'text'
  },
  
  // Responsibilities & Qualifications
  keyResponsibilities: [String],
  qualifications: [String],
  
  // Skills
  requiredSkills: [{
    skillName: {
      type: String,
      index: true
    },
    proficiencyLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced']
    }
  }],
  preferredSkills: [String],
  
  // Work Details
  locationType: {
    type: String,
    required: true,
    enum: ['remote', 'hybrid', 'in_person'],
    index: true
  },
  officeLocation: {
    city: String,
    state: String,
    country: String
  },
  startDate: Date,
  duration: String,
  hoursPerWeek: Number,
  schedule: String,
  
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
  
  // AI Matching (optional, can be enabled later)
  aiMatching: {
    enabled: {
      type: Boolean,
      default: false
    },
    autoMatchThreshold: Number
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
      question: String,
      type: {
        type: String,
        enum: ['text', 'multiple_choice', 'file_upload']
      },
      required: Boolean
    }]
  },
  
  // Assessment References
  assessments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment'
  }],
  
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
  postedAt: {
    type: Date,
    index: -1
  },
  applicationDeadline: Date,
  closedAt: Date,
  
  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TeamMember',
    index: true
  },
  tags: [String],
  importedFrom: String,
  externalId: String
}, {
  timestamps: true
});

// Additional indexes
jobListingSchema.index({ companyId: 1, status: 1 });

module.exports = mongoose.model('JobListing', jobListingSchema);
