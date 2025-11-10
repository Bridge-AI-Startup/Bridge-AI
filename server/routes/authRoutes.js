const express = require('express');
const router = express.Router();
const {
  firebaseSignIn,
  studentSignIn,
  employerSignIn,
  verifyFirebaseToken,
  getCurrentUser,
  linkFirebaseAccount,
  studentSignup,
  employerSignup,
} = require('../controllers/authController');
const verifyFirebaseTokenMiddleware = require('../middleware/firebaseAuth');
const authMiddleware = require('../middleware/auth');

/**
 * Authentication Routes
 *
 * Role System:
 * - 'user' (student/candidate): User model with role: 'user'
 * - 'employer': TeamMember model (all team members are employers at application level)
 *   - companyRole: 'admin' = employer admin (company admin)
 *   - companyRole: 'member' = regular employer
 */

// ==================== STUDENT/USER AUTH ====================
// Public routes - No authentication required
router.post('/student/signup', studentSignup); // Create new student account
router.post('/student/signin', studentSignIn); // Sign in existing student (enforces student-only)
router.post('/student/firebase/signin', studentSignIn); // Alias for compatibility

// ==================== EMPLOYER/TEAM MEMBER AUTH ====================
// Public routes - No authentication required
router.post('/employer/signup', employerSignup); // Create new employer account + company
router.post('/employer/signin', employerSignIn); // Sign in existing employer (enforces employer-only)
router.post('/employer/firebase/signin', employerSignIn); // Alias for compatibility

// ==================== SHARED AUTH ROUTES ====================
// These work for both user types
router.post('/firebase/verify', verifyFirebaseToken);

// Protected routes - Require Firebase token
router.get('/me', verifyFirebaseTokenMiddleware, getCurrentUser);
router.post('/firebase/link', verifyFirebaseTokenMiddleware, linkFirebaseAccount);

// Protected routes - Require JWT token (alternative to Firebase token)
router.post('/firebase/link-jwt', authMiddleware, linkFirebaseAccount);

module.exports = router;

