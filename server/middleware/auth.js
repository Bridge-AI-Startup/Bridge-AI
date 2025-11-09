const jwt = require('jsonwebtoken');
const admin = require('../config/firebase');
const User = require('../models/User');
const TeamMember = require('../models/TeamMember');

/**
 * Helper function to fetch user role from database
 */
const fetchUserRole = async (userObj) => {
  try {
    const { userId, uid, email } = userObj;

    // Check TeamMember (employer) first
    let teamMember = await TeamMember.findOne({
      $or: [
        { _id: userId },
        { uid: uid },
        { email: email }
      ]
    });

    if (teamMember) {
      userObj.role = 'employer'; // Application-level role: all team members are employers
      userObj.userId = teamMember._id;
      userObj.companyRole = teamMember.companyRole; // Company-level role: 'admin' (employer admin) or 'member'
      userObj.isEmployerAdmin = teamMember.companyRole === 'admin';
      return;
    }

    // Check User (student/candidate)
    const user = await User.findOne({
      $or: [
        { _id: userId },
        { uid: uid },
        { email: email }
      ]
    });

    if (user) {
      userObj.role = 'user'; // Student/candidate role
      userObj.userId = user._id;
    }
  } catch (error) {
    console.error('Error fetching user role:', error);
  }
};

/**
 * Unified authentication middleware that supports both JWT and Firebase tokens
 * Tries Firebase token first, then falls back to JWT
 */
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({ 
        success: false,
        message: 'No authorization header provided' 
      });
    }

    // Extract token (format: "Bearer <token>")
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'No token provided' 
      });
    }

    // Try Firebase token first (if Firebase Admin SDK is initialized)
    if (admin.apps.length > 0) {
      try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        const { uid, email } = decodedToken;

        // Try to determine role from database
        let userRole = null;
        let userId = null;

        // Check TeamMember (employer) first
        let teamMember = await TeamMember.findOne({
          $or: [
            { uid: uid },
            { email: email }
          ]
        });

        if (teamMember) {
          userRole = 'employer'; // Application-level role: all team members are employers
          userId = teamMember._id;
        } else {
          // Check User (student/candidate)
          const user = await User.findOne({
            $or: [
              { uid: uid },
              { email: email }
            ]
          });

          if (user) {
            userRole = 'user'; // Student/candidate role
            userId = user._id;
          }
        }

        req.user = {
          userId: userId,
          uid: decodedToken.uid,
          email: decodedToken.email,
          emailVerified: decodedToken.email_verified,
          name: decodedToken.name,
          picture: decodedToken.picture,
          role: userRole,
          authType: 'firebase',
          firebase: decodedToken,
        };
        return next();
      } catch (firebaseError) {
        // If Firebase verification fails, try JWT
        if (firebaseError.code && firebaseError.code.startsWith('auth/')) {
          // This is a Firebase error, try JWT instead
          try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
            
            // JWT token should already contain role information from sign-in
            req.user = {
              ...decoded,
              authType: 'jwt',
            };
            
            // If role is not in JWT, fetch from database
            if (!req.user.role && req.user.userId) {
              await fetchUserRole(req.user);
            }
            
            return next();
          } catch (jwtError) {
            // Both failed
            return res.status(401).json({ 
              success: false,
              message: 'Invalid token' 
            });
          }
        } else {
          // Unexpected Firebase error, still try JWT
          try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
            
            req.user = {
              ...decoded,
              authType: 'jwt',
            };
            
            // If role is not in JWT, fetch from database
            if (!req.user.role && req.user.userId) {
              await fetchUserRole(req.user);
            }
            
            return next();
          } catch (jwtError) {
            return res.status(401).json({ 
              success: false,
              message: 'Token verification failed',
              error: firebaseError.message 
            });
          }
        }
      }
    }
    
    // If Firebase is not initialized, try JWT only
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      
      req.user = {
        ...decoded,
        authType: 'jwt',
      };
      
      // If role is not in JWT, fetch from database
      if (!req.user.role && req.user.userId) {
        await fetchUserRole(req.user);
      }
      
      return next();
    } catch (jwtError) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token' 
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ 
      success: false,
      message: 'Authentication failed',
      error: error.message 
    });
  }
};

module.exports = authMiddleware;
