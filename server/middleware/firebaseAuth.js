const admin = require('../config/firebase');

/**
 * Middleware to verify Firebase ID tokens
 * Extracts the token from Authorization header and verifies it with Firebase Admin SDK
 */
const verifyFirebaseToken = async (req, res, next) => {
  try {
    // Check if Firebase Admin SDK is initialized
    if (!admin.apps.length) {
      return res.status(500).json({ 
        success: false,
        message: 'Firebase Admin SDK is not initialized. Please configure FIREBASE_SERVICE_ACCOUNT_KEY or FIREBASE_PROJECT_ID' 
      });
    }

    // Get token from Authorization header
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

    // Verify the token with Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Attach user information to request object
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified,
      name: decodedToken.name,
      picture: decodedToken.picture,
      firebase: decodedToken, // Full Firebase token payload
      authType: 'firebase',
    };

    // Try to get role from database (optional, can be done in route handlers)
    // This is async, but we don't wait for it to avoid blocking
    // Role will be checked in role middleware if needed

    next();
  } catch (error) {
    console.error('Firebase token verification error:', error.message);
    
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ 
        success: false,
        message: 'Token has expired' 
      });
    }
    
    if (error.code === 'auth/id-token-revoked') {
      return res.status(401).json({ 
        success: false,
        message: 'Token has been revoked' 
      });
    }
    
    return res.status(401).json({ 
      success: false,
      message: 'Invalid or malformed token',
      error: error.message 
    });
  }
};

module.exports = verifyFirebaseToken;

