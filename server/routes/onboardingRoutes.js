const express = require('express');
const router = express.Router();
const {
  upload,
  uploadResume,
  updateLinkedIn,
  updateGitHub,
  uploadProject,
  deleteProject,
  getOnboardingStatus,
  updatePreferences
} = require('../controllers/onboardingController');
const authMiddleware = require('../middleware/auth');

/**
 * Student Onboarding Routes
 * All routes require JWT authentication
 */

// Get onboarding status and user data
router.get('/status', authMiddleware, getOnboardingStatus);

// Upload resume (single file)
router.post('/resume', authMiddleware, upload.single('resume'), uploadResume);

// Update LinkedIn URL
router.post('/linkedin', authMiddleware, updateLinkedIn);

// Update GitHub URL
router.post('/github', authMiddleware, updateGitHub);

// Upload project with files (multiple files allowed)
router.post('/projects', authMiddleware, upload.array('projectFiles', 5), uploadProject);

// Delete a specific project
router.delete('/projects/:projectId', authMiddleware, deleteProject);

// Update company preferences
router.post('/preferences', authMiddleware, updatePreferences);

module.exports = router;
