const User = require('../models/User');
const TeamMember = require('../models/TeamMember');

/**
 * Role-based access control middleware
 * Checks if the authenticated user has the required role(s)
 * 
 * @param {string|string[]} allowedRoles - Role(s) allowed to access the route
 * @returns {Function} Express middleware function
 * 
 * Usage:
 * - router.get('/employer-only', requireRole('employer'), handler);
 * - router.get('/user-only', requireRole('user'), handler);
 */
const requireRole = (allowedRoles) => {
  // Convert single role to array
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return async (req, res, next) => {
    try {
      // req.user should be set by authMiddleware or verifyFirebaseToken
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      const { userId, uid, email, role: tokenRole, userType } = req.user;

      // If role is already in token, use it
      if (tokenRole && roles.includes(tokenRole)) {
        return next();
      }

      // Otherwise, fetch role from database
      let userRole = tokenRole;
      let userDoc = null;

      // Check TeamMember (employer) first
      let teamMember = await TeamMember.findOne({
        $or: [
          { uid: uid },
          { email: email },
          { _id: userId }
        ]
      });

      if (teamMember) {
        userRole = 'employer'; // Application-level role: all team members are employers
        userDoc = teamMember;
      } else {
        // Check User (student/candidate)
        const user = await User.findOne({
          $or: [
            { uid: uid },
            { email: email },
            { _id: userId }
          ]
        });

        if (user) {
          userRole = 'user'; // Student/candidate role
          userDoc = user;
        }
      }

      // Check if user has required role
      if (!userRole || !roles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Required role(s): ${roles.join(', ')}. Your role: ${userRole || 'unknown'}`,
        });
      }

      // Attach role and user document to request
      req.user.role = userRole;
      req.user.userDoc = userDoc;

      next();
    } catch (error) {
      console.error('Role middleware error:', error);
      res.status(500).json({
        success: false,
        message: 'Error checking user role',
        error: error.message,
      });
    }
  };
};

/**
 * Check if user is employer (TeamMember - all team members are employers at application level)
 * Note: Use req.user.companyRole to check if they're employer admin ('admin') or regular employer ('member')
 */
const requireEmployer = requireRole('employer');

/**
 * Check if user is regular user (student/candidate - User with role: 'user')
 */
const requireUser = requireRole('user');

module.exports = {
  requireRole,
  requireEmployer,
  requireUser,
};

