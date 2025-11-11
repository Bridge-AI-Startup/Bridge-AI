const express = require('express');
const router = express.Router();
const {
  upload,
  createCompanyProfile,
  uploadLogo,
  getOnboardingStatus,
  generateProfile
} = require('../controllers/employerOnboardingController');
const authMiddleware = require('../middleware/auth');

/**
 * Employer Onboarding Routes
 * All routes require JWT authentication with employer role
 */

// Get employer onboarding status and company data
router.get('/status', authMiddleware, getOnboardingStatus);

// Create or update company profile (with optional logo upload)
router.post('/company-profile', authMiddleware, upload.single('logo'), createCompanyProfile);

// Upload company logo separately
router.post('/logo', authMiddleware, upload.single('logo'), uploadLogo);

/**
 * @route   POST /api/ai/generate-company-profile
 * @desc    Generate company profile using AI with web research
 * @access  Private
 */
router.post('/generate-company-profile', authMiddleware, generateProfile);

module.exports = router;
