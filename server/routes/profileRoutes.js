const express = require('express');
const router = express.Router();
const {
  getStudentProfile,
  updateStudentProfile,
  getEmployerProfile,
  updateEmployerProfile
} = require('../controllers/profileController');
const authMiddleware = require('../middleware/auth');

// Student profile routes
router.get('/student', authMiddleware, getStudentProfile);
router.put('/student', authMiddleware, updateStudentProfile);

// Employer profile routes
router.get('/employer', authMiddleware, getEmployerProfile);
router.put('/employer', authMiddleware, updateEmployerProfile);

module.exports = router;
