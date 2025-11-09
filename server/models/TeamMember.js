const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  
  // Authentication - uid is the primary identifier (Firebase UID or generated)
  uid: {
    type: String,
    required: true,
    unique: true,
    index: true
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
    required: false  // Optional - not needed for Firebase/Google Auth users
  },
  authProvider: {
    type: String,
    enum: ['email', 'google'],
    required: true,
    default: 'email'
  },
  
  // Profile
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  title: String,
  
  profilePhoto: {
    fileName: String,
    fileUrl: String,
    fileSize: Number,
    uploadedAt: Date,
    s3Key: String
  },
  
  // Company Role - 'admin' = employer admin (company admin), 'member' = regular employer
  companyRole: {
    type: String,
    enum: ['admin', 'member'],
    default: 'member',
    required: true,
    index: true
  },
  
  // Status
  status: {
    type: String,
    enum: ['invited', 'active', 'inactive'],
    default: 'invited'
  },
  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TeamMember'
  },
  invitedAt: Date,
  inviteToken: String,
  inviteAcceptedAt: Date,
  
  // Activity
  lastLoginAt: Date,
  lastActiveAt: Date,
  
  // Email Verification
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerifiedAt: Date
}, {
  timestamps: true
});

// Compound indexes
teamMemberSchema.index({ companyId: 1, status: 1 });

// Validation: uid is required, password is optional (for Firebase users)
teamMemberSchema.pre('save', function(next) {
  // Generate uid if not provided (for non-Firebase users during creation)
  if (!this.uid && this.isNew) {
    // Generate uid for new non-Firebase users
    this.uid = `employer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // uid is always required (either from Firebase or generated)
  if (!this.uid) {
    next(new Error('Team member must have a uid'));
  } else {
    next();
  }
});

// Don't return sensitive data in JSON responses
teamMemberSchema.methods.toJSON = function() {
  const member = this.toObject();
  delete member.password;
  delete member.inviteToken;
  return member;
};

module.exports = mongoose.model('TeamMember', teamMemberSchema);
