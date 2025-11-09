const mongoose = require('mongoose');

const communicationSchema = new mongoose.Schema({
  communicationId: {
    type: String,
    required: true,
    unique: true
  },
  
  // References
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    index: true
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  
  // Communication Details
  type: {
    type: String,
    enum: ['email', 'message', 'call', 'note'],
    required: true
  },
  subject: String,
  content: String,
  sentBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TeamMember',
    required: true
  },
  sentAt: {
    type: Date,
    default: Date.now,
    index: -1
  },
  
  // Email Tracking
  emailOpened: {
    type: Boolean,
    default: false
  },
  emailOpenedAt: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('Communication', communicationSchema);
