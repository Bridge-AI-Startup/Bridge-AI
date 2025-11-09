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
    required: true,
    unique: true,
    index: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: false  // Optional - not needed for Google Auth users
  },
  
  authProvider: {
    type: String,
    enum: ['email', 'google'],
    required: true,
    default: 'email'
  },
  profilePicture: String,  // Can be populated from Google profile
  
  // Profile
  university: String,
  linkedinUrl: String,
  githubUrl: String,
  videoUrl: String,
  
  // Resume
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
    title: String,
    description: String,
    files: [{
      fileName: String,
      fileUrl: String,
      fileSize: Number,
      mimeType: String,
      uploadedAt: Date,
      s3Key: String
    }]
  }],
  
  // Job Preferences
  jobPreferences: {
    companyStage: {
      type: String,
      enum: ['early_stage', 'growing', 'established', 'no_preference']
    },
    industries: [String],
    workStyle: {
      type: String,
      enum: ['in_person', 'hybrid', 'remote', 'no_preference']
    },
    teamType: {
      type: String,
      enum: ['engineering_heavy', 'product_design', 'growth_business', 'no_preference']
    },
    companyValues: [String]
  },
  
  // Role - 'user' = student/candidate
  role: {
    type: String,
    enum: ['user'],
    default: 'user',
    required: true,
    index: true
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  lastLoginAt: Date
}, {
  timestamps: true
});

// Indexes
userSchema.index({ createdAt: -1 });

// Validation: uid is required, password is optional (for Firebase users)
userSchema.pre('save', function(next) {
  // Generate uid if not provided (for non-Firebase users during creation)
  if (!this.uid && this.isNew) {
    // Generate uid for new non-Firebase users
    this.uid = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // uid is always required (either from Firebase or generated)
  if (!this.uid) {
    next(new Error('User must have a uid'));
  } else {
    next();
  }
});

// Don't return sensitive data in JSON responses
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);
