const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  employerId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  password: {
    type: String,
    select: false
  },
  
  // Basic Information
  companyName: {
    type: String,
    required: true
  },
  companyWebsite: String,
  companyLogo: {
    fileName: String,
    fileUrl: String,
    fileSize: Number,
    uploadedAt: Date
  },
  
  headquarters: {
    city: String,
    state: String,
    country: String,
    timezone: String
  },
  
  foundedYear: Number,
  
  industry: {
    type: String,
    enum: ['ai_ml', 'fintech', 'saas', 'healthtech', 'consumer_apps', 
           'climate_sustainability', 'edtech', 'open_source', 'other']
  },
  
  companySize: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']
  },
  
  fundingStage: {
    type: String,
    enum: ['pre_seed', 'seed', 'series_a', 'series_b', 'series_c', 
           'series_d', 'public', 'bootstrapped']
  },
  
  // About Company
  oneSentencePitch: String,
  companyDescription: String,
  
  // Team Members
  teamMembers: [{
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId()
    },
    email: String,
    name: String,
    role: {
      type: String,
      enum: ['admin', 'hiring_manager', 'recruiter']
    },
    invitedAt: Date,
    joinedAt: Date,
    status: {
      type: String,
      enum: ['pending', 'active', 'inactive'],
      default: 'pending'
    }
  }],
  
  // Company Culture
  companyValues: [String],
  benefits: [String],
  
  // Social Links
  socialLinks: {
    linkedin: String,
    twitter: String,
    github: String
  },
  
  // Subscription
  subscriptionTier: {
    type: String,
    enum: ['free', 'starter', 'pro', 'enterprise'],
    default: 'free'
  },
  subscriptionStatus: {
    type: String,
    enum: ['active', 'trial', 'cancelled', 'expired'],
    default: 'trial'
  },
  
  // Settings
  settings: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    autoMatchEnabled: {
      type: Boolean,
      default: true
    },
    assessmentsRequired: {
      type: Boolean,
      default: false
    }
  },
  
  // Metadata
  lastLoginAt: Date,
  isActive: {
    type: Boolean,
    default: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  onboardingCompleted: {
    type: Boolean,
    default: false
  },
  setupMethod: {
    type: String,
    enum: ['ai_generated', 'manual']
  }
}, {
  timestamps: true
});

// Indexes
companySchema.index({ companyName: 'text' });

// Methods
companySchema.methods.toJSON = function() {
  const company = this.toObject();
  delete company.password;
  return company;
};

const Company = mongoose.model('Company', companySchema);

module.exports = Company;
