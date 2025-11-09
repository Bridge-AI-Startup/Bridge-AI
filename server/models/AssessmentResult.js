const mongoose = require('mongoose');

const assessmentResultSchema = new mongoose.Schema({
  assessmentResultId: {
    type: String,
    required: true,
    unique: true
  },
  
  // References
  assessmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true,
    index: true
  },
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true,
    index: true
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  jobListingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobListing'
  },
  
  // Status & Timing
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed', 'overdue'],
    default: 'not_started'
  },
  startedAt: Date,
  completedAt: Date,
  dueDate: Date,
  timeAllowed: Number, // in minutes
  timeTaken: Number, // in minutes
  
  // Results
  score: Number,
  results: {
    correctAnswers: Number,
    totalQuestions: Number,
    detailedFeedback: String,
    codeSubmission: String,
    evaluatorNotes: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AssessmentResult', assessmentResultSchema);
