const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  offerId: {
    type: String,
    required: true,
    unique: true
  },
  
  // References
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true,
    index: true
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobListingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobListing',
    required: true
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'sent', 'accepted', 'declined', 'expired'],
    default: 'pending'
  },
  sentAt: Date,
  expiresAt: Date,
  respondedAt: Date,
  
  // Offer Details
  compensation: Number,
  startDate: Date,
  duration: String,
  equity: Number,
  
  // Offer Letter
  offerLetter: {
    fileName: String,
    fileUrl: String,
    s3Key: String
  },
  
  // Response
  declineReason: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Offer', offerSchema);
