const express = require('express');
const router = express.Router();
const {
  createJobListing,
  getCompanyJobListings,
  getJobListingById,
  updateJobListing,
  deleteJobListing,
  aiImportJobListing,
  aiGenerateResponsibilities,
  aiGenerateQualifications,
  aiGenerateSkills
} = require('../controllers/jobListingController');
const authMiddleware = require('../middleware/auth');

// All routes require employer authentication
router.use(authMiddleware);

/**
 * AI-powered routes (must be before generic routes to avoid conflicts)
 */

/**
 * @route   POST /api/job-listings/ai/import
 * @desc    Import job listing from URL using AI
 * @access  Protected (Employer only)
 */
router.post('/ai/import', aiImportJobListing);

/**
 * @route   POST /api/job-listings/ai/generate-responsibilities
 * @desc    Generate responsibilities using AI
 * @access  Protected (Employer only)
 */
router.post('/ai/generate-responsibilities', aiGenerateResponsibilities);

/**
 * @route   POST /api/job-listings/ai/generate-qualifications
 * @desc    Generate qualifications using AI
 * @access  Protected (Employer only)
 */
router.post('/ai/generate-qualifications', aiGenerateQualifications);

/**
 * @route   POST /api/job-listings/ai/generate-skills
 * @desc    Generate skills using AI
 * @access  Protected (Employer only)
 */
router.post('/ai/generate-skills', aiGenerateSkills);

/**
 * @route   POST /api/job-listings
 * @desc    Create a new job listing
 * @access  Protected (Employer only)
 */
router.post('/', createJobListing);

/**
 * @route   GET /api/job-listings
 * @desc    Get all job listings for the employer's company
 * @access  Protected (Employer only)
 */
router.get('/', getCompanyJobListings);

/**
 * @route   GET /api/job-listings/:id
 * @desc    Get a single job listing by ID
 * @access  Protected (Employer only)
 */
router.get('/:id', getJobListingById);

/**
 * @route   PUT /api/job-listings/:id
 * @desc    Update a job listing
 * @access  Protected (Employer only)
 */
router.put('/:id', updateJobListing);

/**
 * @route   DELETE /api/job-listings/:id
 * @desc    Delete a job listing
 * @access  Protected (Employer only)
 */
router.delete('/:id', deleteJobListing);

module.exports = router;
