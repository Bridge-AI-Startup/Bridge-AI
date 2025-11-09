const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  assessmentId: {
    type: String,
    required: true,
    unique: true
  },
  
  // Assessment Details
  title: {
    type: String,
    required: true
  },
  description: String,
  assessmentType: {
    type: String,
    enum: ['coding', 'technical_quiz', 'case_study', 'video'],
    required: true
  },
  
  // Coding Challenge (if type = coding)
  codingChallenge: {
    problemStatement: String,
    starterCode: String,
    testCases: [{
      input: String,
      expectedOutput: String,
      isHidden: {
        type: Boolean,
        default: false
      }
    }],
    allowedLanguages: [String],
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard']
    }
  },
  
  // Quiz Questions (if type = technical_quiz)
  questions: [{
    questionText: String,
    questionType: {
      type: String,
      enum: ['multiple_choice', 'code', 'essay']
    },
    options: [String],
    correctAnswer: String, // Should be encrypted in production
    points: Number
  }],
  
  // Timing & Scoring
  timeLimit: Number, // in minutes
  totalPoints: Number,
  passingScore: Number,
  
  // Ownership
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TeamMember',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  
  // Usage Stats (can be calculated)
  timesUsed: {
    type: Number,
    default: 0
  },
  averageScore: Number,
  averageCompletionTime: Number
}, {
  timestamps: true
});

module.exports = mongoose.model('Assessment', assessmentSchema);
