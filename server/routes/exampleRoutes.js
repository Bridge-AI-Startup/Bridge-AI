const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { requireRole, requireEmployer, requireUser } = require('../middleware/roles');

/**
 * Example routes demonstrating role-based access control
 * 
 * Role System:
 * - 'user' (student/candidate): User model with role: 'user'
 * - 'employer': TeamMember model (all team members are employers)
 *   - Check req.user.companyRole for 'admin' (employer admin) or 'member' (regular employer)
 */

// Public route - no authentication required
router.get('/public', (req, res) => {
  res.json({ message: 'This is a public route' });
});

// Protected route - requires authentication (any role)
router.get('/protected', authMiddleware, (req, res) => {
  res.json({ 
    message: 'This is a protected route',
    user: req.user 
  });
});

// Employer only route (all TeamMembers are employers)
router.get('/employer-only', authMiddleware, requireEmployer, (req, res) => {
  res.json({ 
    message: 'This is an employer-only route',
    user: req.user,
    companyRole: req.user.companyRole, // 'admin' (employer admin) or 'member' (regular employer)
    isEmployerAdmin: req.user.isEmployerAdmin
  });
});

// Employer admin only route (TeamMember with companyRole: 'admin')
router.get('/employer-admin-only', authMiddleware, requireEmployer, (req, res) => {
  // Additional check for employer admin within the route
  if (req.user.companyRole !== 'admin') {
    return res.status(403).json({ 
      message: 'This route requires employer admin privileges',
      yourRole: req.user.companyRole
    });
  }
  
  res.json({ 
    message: 'This is an employer admin-only route',
    user: req.user,
    note: 'This is company-level admin, not system admin'
  });
});

// User (student) only route
router.get('/user-only', authMiddleware, requireUser, (req, res) => {
  res.json({ 
    message: 'This is a student/user-only route',
    user: req.user 
  });
});

// Custom role requirement
router.get('/custom-role', authMiddleware, requireRole(['employer']), (req, res) => {
  res.json({ 
    message: 'This route requires employer role',
    user: req.user 
  });
});

// Route that checks role in handler (alternative approach)
router.get('/check-role-in-handler', authMiddleware, (req, res) => {
  const { role, companyRole, isEmployerAdmin } = req.user;
  
  if (role === 'employer') {
    if (isEmployerAdmin) {
      return res.json({ message: 'Employer admin access granted' });
    } else {
      return res.json({ message: 'Regular employer access granted' });
    }
  } else if (role === 'user') {
    return res.json({ message: 'Student/user access granted' });
  } else {
    return res.status(403).json({ message: 'Access denied' });
  }
});

module.exports = router;

