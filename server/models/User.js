const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    index: true
  },
  password: {
    type: String,
    select: false
  },
  
  // Profile Fields
  profile: {
    university: String,
    graduationDate: Date,
    major: String,
    gpa: Number,
    location: {
      city: String,
      state: String,
      country: String
    },
    bio: String,
    phoneNumber: String
  },
  
  // Social Links
  socialLinks: {
    linkedin: String,
    github: String,
    portfolio: String,
    twitter: String
  },
  
  // Resume Storage
  resume: {
    fileName: String,
    fileUrl: String,
    fileSize: Number,
    mimeType: String,
    uploadedAt: Date,
    s3Key: String
  },
  
  // Projects
  projects: [{
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId()
    },
    title: {
      type: String,
      required: true
    },
    description: String,
    technologies: [String],
    githubUrl: String,
    liveUrl: String,
    startDate: Date,
    endDate: Date,
    highlights: [String],
    files: [{
      fileName: String,
      fileUrl: String,
      fileSize: Number,
      mimeType: String,
      uploadedAt: Date,
      s3Key: String
    }]
  }],
  
  // Work Experience
  experience: [{
    experienceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId()
    },
    company: String,
    position: String,
    location: String,
    startDate: Date,
    endDate: Date,
    current: Boolean,
    description: String,
    responsibilities: [String]
  }],
  
  // Education
  education: [{
    educationId: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId()
    },
    institution: String,
    degree: String,
    field: String,
    startDate: Date,
    endDate: Date,
    gpa: Number,
    achievements: [String]
  }],
  
  // Skills
  skills: [{
    skillId: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId()
    },
    name: String,
    category: {
      type: String,
      enum: ['programming', 'framework', 'tool', 'soft_skill', 'language', 'other']
    },
    proficiency: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert']
    },
    yearsOfExperience: Number
  }],
  
  // Job Preferences
  jobPreferences: {
    companyStage: {
      type: String,
      enum: ['early_stage', 'growing', 'established', 'no_preference'],
      default: 'no_preference'
    },
    industries: [String],
    workStyle: {
      type: String,
      enum: ['in_person', 'hybrid', 'remote', 'no_preference'],
      default: 'no_preference'
    },
    teamType: {
      type: String,
      enum: ['engineering_heavy', 'product_design', 'growth_business', 'no_preference'],
      default: 'no_preference'
    },
    companyValues: [String],
    preferredLocations: [String],
    salaryExpectation: {
      min: Number,
      max: Number,
      currency: String,
      period: String
    },
    availability: {
      startDate: Date,
      hoursPerWeek: Number
    },
    videoIntroUrl: String
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
  profileCompleted: {
    type: Boolean,
    default: false
  },
  profileCompletionPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

// Indexes
userSchema.index({ createdAt: -1 });
userSchema.index({ 'skills.name': 1 });
userSchema.index({ 'profile.university': 1 });

// Virtual for full name if needed
userSchema.virtual('fullProfile').get(function() {
  return {
    ...this.toObject(),
    hasResume: !!this.resume?.fileUrl,
    projectCount: this.projects?.length || 0,
    experienceCount: this.experience?.length || 0
  };
});

// Method to calculate profile completion
userSchema.methods.calculateProfileCompletion = function() {
  let score = 0;
  const weights = {
    name: 5,
    email: 5,
    profile: 15,
    socialLinks: 10,
    resume: 20,
    projects: 15,
    experience: 10,
    education: 10,
    skills: 10
  };
  
  if (this.name) score += weights.name;
  if (this.email) score += weights.email;
  if (this.profile?.university) score += weights.profile;
  if (this.socialLinks?.linkedin || this.socialLinks?.github) score += weights.socialLinks;
  if (this.resume?.fileUrl) score += weights.resume;
  if (this.projects?.length > 0) score += weights.projects;
  if (this.experience?.length > 0) score += weights.experience;
  if (this.education?.length > 0) score += weights.education;
  if (this.skills?.length > 0) score += weights.skills;
  
  this.profileCompletionPercentage = score;
  this.profileCompleted = score >= 80;
  return score;
};

// Method to get public profile
userSchema.methods.getPublicProfile = function() {
  return {
    _id: this._id,
    name: this.name,
    profile: this.profile,
    socialLinks: this.socialLinks,
    projects: this.projects,
    experience: this.experience,
    education: this.education,
    skills: this.skills
  };
};

// Remove password from JSON
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
