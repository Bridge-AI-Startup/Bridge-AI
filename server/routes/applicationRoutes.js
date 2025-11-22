const express = require('express');
const router = express.Router();
const {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplicationStage,
  updateApplication,
  getPendingAssessments,
  gradeAssessment
} = require('../controllers/applicationController');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

/**
 * @route   POST /api/applications
 * @desc    Create a new application
 * @access  Protected (Student only)
 */
router.post('/', createApplication);

/**
 * @route   GET /api/applications
 * @desc    Get applications (for student or employer)
 * @access  Protected
 */
router.get('/', getApplications);

/**
 * @route   GET /api/applications/assessments/pending
 * @desc    Get all pending assessments to grade (employer view)
 * @access  Protected (Employer only)
 */
router.get('/assessments/pending', getPendingAssessments);

/**
 * @route   GET /api/applications/:id
 * @desc    Get single application with full details
 * @access  Protected
 */
router.get('/:id', getApplicationById);

/**
 * @route   PUT /api/applications/:id/stage
 * @desc    Update application stage
 * @access  Protected (Employer only)
 */
router.put('/:id/stage', updateApplicationStage);

/**
 * @route   PUT /api/applications/:id
 * @desc    Update application (rating, notes, tags, etc.)
 * @access  Protected (Employer only)
 */
router.put('/:id', updateApplication);

/**
 * @route   POST /api/applications/:id/grade-assessment
 * @desc    Manually grade an assessment (no AI)
 * @access  Protected (Employer only)
 */
router.post('/:id/grade-assessment', gradeAssessment);

module.exports = router;
