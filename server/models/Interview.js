const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  interviewId: {
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
  
  // Schedule
  scheduledDate: {
    type: Date,
    required: true,
    index: true
  },
  duration: Number, // in minutes
  timezone: String,
  type: {
    type: String,
    enum: ['phone', 'video', 'in_person', 'technical'],
    index: true
  },
  
  // Location
  locationType: {
    type: String,
    enum: ['virtual', 'office']
  },
  meetingLink: String,
  address: String,
  
  // Participants
  interviewers: [{
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TeamMember'
    },
    isLeadInterviewer: {
      type: Boolean,
      default: false
    }
  }],
  
  // Calendar Integration
  calendarEventId: String,
  candidateCalendarEventId: String,
  
  // Status & Confirmations
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'],
    default: 'scheduled',
    index: true
  },
  candidateConfirmed: {
    type: Boolean,
    default: false
  },
  
  // Reminders
  remindersSent: [{
    type: {
      type: String,
      enum: ['24h', '1h', '15min']
    },
    sentAt: Date
  }],
  
  // Feedback
  feedback: [{
    interviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TeamMember'
    },
    rating: {
      type: Number,
      min: 1,
      max: 10
    },
    technicalSkills: Number,
    communication: Number,
    cultureFit: Number,
    problemSolving: Number,
    strengths: [String],
    weaknesses: [String],
    overallRecommendation: {
      type: String,
      enum: ['strong_hire', 'hire', 'no_hire', 'strong_no_hire']
    },
    detailedNotes: String,
    submittedAt: Date
  }],
  
  // Recording (optional)
  recording: {
    recordingUrl: String,
    transcript: String,
    duration: Number
  },
  
  // Metadata
  completedAt: Date,
  cancelledAt: Date,
  cancellationReason: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Interview', interviewSchema);
