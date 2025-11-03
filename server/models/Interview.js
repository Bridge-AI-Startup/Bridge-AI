const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  interviewId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // Primary Reference - Everything flows from Application
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true,
    index: true
  },
  
  // Denormalized for query performance (updated via hooks)
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  jobListingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobListing',
    required: true
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  
  // Denormalized for display (avoid extra queries)
  candidateName: String,
  roleName: String,
  
  // Schedule Details
  scheduledDate: {
    type: Date,
    required: true,
    index: true
  },
  duration: {
    type: Number,
    required: true,
    default: 60
  },
  timezone: {
    type: String,
    default: 'America/Los_Angeles'
  },
  
  type: {
    type: String,
    required: true,
    enum: ['phone_screen', 'technical', 'behavioral', 'system_design', 'cultural_fit', 'final', 'other'],
    index: true
  },
  
  round: {
    type: Number,
    default: 1
  },
  
  // Location
  location: {
    type: {
      type: String,
      enum: ['virtual', 'office', 'phone'],
      default: 'virtual'
    },
    meetingLink: String,
    meetingId: String,
    password: String,
    dialInNumber: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
      room: String,
      floor: String
    }
  },
  
  // Participants - References to Company team members
  interviewers: [{
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String, // Denormalized
    email: String, // Denormalized
    role: String,
    title: String,
    isLeadInterviewer: {
      type: Boolean,
      default: false
    },
    confirmed: {
      type: Boolean,
      default: false
    },
    confirmedAt: Date
  }],
  
  // Interview Panel (if group interview)
  panelSize: {
    type: Number,
    default: 1
  },
  
  // Calendar Integration
  calendarEventId: String,
  candidateCalendarEventId: String,
  calendarProvider: {
    type: String,
    enum: ['google', 'outlook', 'apple', 'other']
  },
  
  // Status
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'rescheduled', 'in_progress', 'completed', 'cancelled', 'no_show'],
    default: 'scheduled',
    index: true
  },
  
  // Confirmation tracking
  candidateConfirmed: {
    type: Boolean,
    default: false
  },
  candidateConfirmedAt: Date,
  
  interviewersConfirmed: {
    type: Boolean,
    default: false
  },
  
  // Reminders
  remindersSent: [{
    type: {
      type: String,
      enum: ['72h', '24h', '2h', '30min']
    },
    sentTo: {
      type: String,
      enum: ['candidate', 'interviewer', 'both']
    },
    sentAt: Date,
    opened: Boolean
  }],
  
  // Rescheduling History
  rescheduleHistory: [{
    previousDate: Date,
    newDate: Date,
    rescheduledBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'rescheduleHistory.rescheduledByModel'
    },
    rescheduledByModel: {
      type: String,
      enum: ['User', 'Company']
    },
    reason: String,
    rescheduledAt: Date
  }],
  
  // Interview Materials
  materials: {
    candidateInstructions: String,
    interviewerGuide: String,
    scorecardUrl: String,
    preparationMaterials: [{
      title: String,
      description: String,
      fileUrl: String
    }]
  },
  
  // Feedback from each interviewer
  feedback: [{
    interviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    
    // Ratings (1-10 scale)
    rating: {
      type: Number,
      min: 1,
      max: 10
    },
    technicalSkills: {
      type: Number,
      min: 1,
      max: 10
    },
    communication: {
      type: Number,
      min: 1,
      max: 10
    },
    cultureFit: {
      type: Number,
      min: 1,
      max: 10
    },
    problemSolving: {
      type: Number,
      min: 1,
      max: 10
    },
    
    // Qualitative feedback
    strengths: [String],
    weaknesses: [String],
    concerns: [String],
    
    // Structured scorecard
    scorecard: [{
      criterion: String,
      score: Number,
      maxScore: Number,
      notes: String
    }],
    
    overallRecommendation: {
      type: String,
      enum: ['strong_hire', 'hire', 'maybe', 'no_hire', 'strong_no_hire'],
      required: true
    },
    
    // Decision factors
    technicalDecision: {
      type: String,
      enum: ['pass', 'borderline', 'fail']
    },
    culturalDecision: {
      type: String,
      enum: ['pass', 'borderline', 'fail']
    },
    
    detailedNotes: String,
    
    // Metadata
    submittedAt: {
      type: Date,
      default: Date.now
    },
    isComplete: {
      type: Boolean,
      default: false
    }
  }],
  
  // Consolidated Interview Results
  results: {
    overallRating: Number,
    technicalScore: Number,
    culturalScore: Number,
    recommendation: {
      type: String,
      enum: ['strong_hire', 'hire', 'maybe', 'no_hire', 'strong_no_hire']
    },
    consensusReached: Boolean,
    topStrengths: [String],
    topConcerns: [String],
    nextSteps: String
  },
  
  // Recording & Transcript (if applicable)
  recording: {
    recordingUrl: String,
    recordingId: String,
    transcript: String,
    transcriptUrl: String,
    duration: Number,
    recordingConsent: {
      candidate: Boolean,
      interviewers: Boolean,
      consentObtainedAt: Date
    }
  },
  
  // Notes taken during interview
  liveNotes: [{
    timestamp: Date,
    note: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  
  // Metadata
  completedAt: Date,
  cancelledAt: Date,
  cancellationReason: String,
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'cancelledByModel'
  },
  cancelledByModel: {
    type: String,
    enum: ['User', 'Company']
  },
  
  noShowBy: {
    type: String,
    enum: ['candidate', 'interviewer']
  },
  noShowFollowUpSent: Boolean,
  
  // Duration tracking
  actualStartTime: Date,
  actualEndTime: Date,
  actualDuration: Number
  
}, {
  timestamps: true
});

// Indexes
interviewSchema.index({ scheduledDate: 1, status: 1 });
interviewSchema.index({ 'interviewers.memberId': 1 });

// Virtual to check if all feedback submitted
interviewSchema.virtual('allFeedbackSubmitted').get(function() {
  return this.interviewers.length === this.feedback.length;
});

// Virtual to calculate average rating
interviewSchema.virtual('averageRating').get(function() {
  if (!this.feedback || this.feedback.length === 0) return null;
  const sum = this.feedback.reduce((acc, fb) => acc + (fb.rating || 0), 0);
  return sum / this.feedback.length;
});

// Method to add feedback
interviewSchema.methods.addFeedback = async function(interviewerId, feedbackData) {
  // Check if feedback already exists from this interviewer
  const existingIndex = this.feedback.findIndex(
    fb => fb.interviewerId.toString() === interviewerId.toString()
  );
  
  if (existingIndex >= 0) {
    // Update existing feedback
    this.feedback[existingIndex] = {
      ...this.feedback[existingIndex],
      ...feedbackData,
      submittedAt: new Date(),
      isComplete: true
    };
  } else {
    // Add new feedback
    this.feedback.push({
      interviewerId,
      ...feedbackData,
      submittedAt: new Date(),
      isComplete: true
    });
  }
  
  // Check if all feedback is submitted
  if (this.feedback.length === this.interviewers.length) {
    this.status = 'completed';
    this.completedAt = new Date();
    await this.calculateResults();
  }
  
  return this.save();
};

// Method to calculate consolidated results
interviewSchema.methods.calculateResults = function() {
  if (!this.feedback || this.feedback.length === 0) return;
  
  const avgRating = this.feedback.reduce((sum, fb) => sum + (fb.rating || 0), 0) / this.feedback.length;
  const avgTechnical = this.feedback.reduce((sum, fb) => sum + (fb.technicalSkills || 0), 0) / this.feedback.length;
  const avgCultural = this.feedback.reduce((sum, fb) => sum + (fb.cultureFit || 0), 0) / this.feedback.length;
  
  // Determine overall recommendation based on feedback
  const recommendations = this.feedback.map(fb => fb.overallRecommendation);
  const strongHires = recommendations.filter(r => r === 'strong_hire').length;
  const hires = recommendations.filter(r => r === 'hire').length;
  const noHires = recommendations.filter(r => r === 'no_hire').length;
  const strongNoHires = recommendations.filter(r => r === 'strong_no_hire').length;
  
  let overallRecommendation;
  if (strongHires > this.feedback.length / 2) {
    overallRecommendation = 'strong_hire';
  } else if ((strongHires + hires) > this.feedback.length / 2) {
    overallRecommendation = 'hire';
  } else if ((noHires + strongNoHires) > this.feedback.length / 2) {
    overallRecommendation = 'no_hire';
  } else {
    overallRecommendation = 'maybe';
  }
  
  // Collect all strengths and concerns
  const allStrengths = this.feedback.flatMap(fb => fb.strengths || []);
  const allConcerns = this.feedback.flatMap(fb => fb.concerns || []);
  
  this.results = {
    overallRating: avgRating,
    technicalScore: avgTechnical,
    culturalScore: avgCultural,
    recommendation: overallRecommendation,
    consensusReached: recommendations.every(r => r === recommendations[0]),
    topStrengths: [...new Set(allStrengths)].slice(0, 5),
    topConcerns: [...new Set(allConcerns)].slice(0, 5)
  };
};

// Method to get full interview details with populated data
interviewSchema.methods.getFullDetails = async function() {
  await this.populate([
    { path: 'applicationId', populate: { path: 'candidateId jobListingId' } },
    { path: 'candidateId', select: 'name email profile resume' },
    { path: 'interviewers.memberId', select: 'name email' },
    { path: 'feedback.interviewerId', select: 'name' }
  ]);
  return this;
};

// Static method to get interviewer schedule
interviewSchema.statics.getInterviewerSchedule = function(interviewerId, startDate, endDate) {
  return this.find({
    'interviewers.memberId': interviewerId,
    scheduledDate: { $gte: startDate, $lte: endDate },
    status: { $in: ['scheduled', 'confirmed'] }
  }).sort({ scheduledDate: 1 });
};

const Interview = mongoose.model('Interview', interviewSchema);

module.exports = Interview;
