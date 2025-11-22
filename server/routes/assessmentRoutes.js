const express = require('express');
const router = express.Router();
const {
  createAssessment,
  getAssessmentById,
  getAssessmentsByJobListing,
  updateAssessment,
  deleteAssessment,
  aiGenerateAssessment,
  aiGenerateBatchAssessments,
  aiEvaluateSubmission,
  submitAssessment
} = require('../controllers/assessmentController');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

/**
 * AI-powered routes (must be before generic routes to avoid conflicts)
 */

/**
 * @route   POST /api/assessments/ai/generate-batch
 * @desc    Generate 3 distinct assessments using AI (two-phase approach)
 * @access  Protected (Employer only)
 */
router.post('/ai/generate-batch', aiGenerateBatchAssessments);

/**
 * @route   POST /api/assessments/ai/generate
 * @desc    Generate an assessment using AI based on job listing
 * @access  Protected (Employer only)
 */
router.post('/ai/generate', aiGenerateAssessment);

/**
 * @route   POST /api/assessments/results/evaluate
 * @desc    Evaluate a code submission using AI
 * @access  Protected (Employer only)
 */
router.post('/results/evaluate', aiEvaluateSubmission);

/**
 * @route   GET /api/assessments/student/my-assessments
 * @desc    Get all assessments assigned to the logged-in student
 * @access  Protected (Student only)
 */
router.get('/student/my-assessments', async (req, res) => {
  try {
    const studentId = req.user._id;

    // Import models
    const AssessmentResult = require('../models/AssessmentResult');
    const Match = require('../models/Match');

    // Fetch all assessment results for this student
    const assessmentResults = await AssessmentResult.find({
      candidateId: studentId
    })
      .populate({
        path: 'assessmentId',
        select: 'title description assessmentType timeLimit totalPoints passingScore'
      })
      .populate({
        path: 'jobListingId',
        select: 'roleTitle companyId',
        populate: {
          path: 'companyId',
          select: 'companyName logo'
        }
      })
      .sort({ createdAt: -1 });

    // Also fetch the match data for each assessment to include match score
    const enrichedAssessments = await Promise.all(
      assessmentResults.map(async (result) => {
        const match = await Match.findOne({
          studentId: studentId,
          jobListingId: result.jobListingId?._id,
          visibleToStudent: true
        });

        return {
          assessmentResult: result,
          match: match ? {
            overallScore: match.overallScore,
            matchFactors: match.matchFactors
          } : null
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: { assessments: enrichedAssessments }
    });
  } catch (error) {
    console.error('Error fetching student assessments:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch assessments'
    });
  }
});

/**
 * @route   POST /api/assessments/submit
 * @desc    Submit an assessment (student side)
 * @access  Protected (Student only)
 */
router.post('/submit', submitAssessment);

/**
 * @route   POST /api/assessments
 * @desc    Create a new assessment
 * @access  Protected (Employer only)
 */
router.post('/', createAssessment);

/**
 * @route   GET /api/assessments/:id
 * @desc    Get assessment by ID
 * @access  Protected
 */
router.get('/:id', getAssessmentById);

/**
 * @route   GET /api/assessments/job-listing/:jobListingId
 * @desc    Get all assessments for a job listing
 * @access  Protected (Employer only)
 */
router.get('/job-listing/:jobListingId', getAssessmentsByJobListing);

/**
 * @route   PUT /api/assessments/:id
 * @desc    Update an assessment
 * @access  Protected (Employer only)
 */
router.put('/:id', updateAssessment);

/**
 * @route   DELETE /api/assessments/:id
 * @desc    Delete an assessment
 * @access  Protected (Employer only)
 */
router.delete('/:id', deleteAssessment);

module.exports = router;
