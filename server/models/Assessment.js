const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  assessmentId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // Assessment Details
  title: {
    type: String,
    required: true
  },
  description: String,
  assessmentType: {
    type: String,
    required: true,
    enum: ['coding', 'technical_quiz', 'case_study', 'video']
  },
  
  // Coding Challenge
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
    allowedLanguages: [{
      type: String,
      enum: ['python', 'javascript', 'java', 'cpp', 'go', 'ruby', 'typescript']
    }],
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard']
    }
  },
  
  // Quiz Questions
  questions: [{
    questionText: String,
    questionType: {
      type: String,
      enum: ['multiple_choice', 'code', 'essay', 'true_false']
    },
    options: [String],
    correctAnswer: String,
    points: {
      type: Number,
      default: 1
    }
  }],
  
  // Timing & Scoring
  timeLimit: {
    type: Number,
    required: true
  },
  totalPoints: Number,
  passingScore: Number,
  
  // Ownership & Usage
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  
  // Usage Stats
  timesUsed: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    default: 0
  },
  averageCompletionTime: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Assessment = mongoose.model('Assessment', assessmentSchema);

module.exports = Assessment;
