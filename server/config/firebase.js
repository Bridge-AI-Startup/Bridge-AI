const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin SDK
// Option 1: Using service account (recommended for production)
if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error) {
    console.error('Error parsing Firebase service account key:', error.message);
    // Fallback to project ID if service account key is invalid
    if (process.env.FIREBASE_PROJECT_ID) {
      admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID,
      });
    }
  }
} else if (process.env.FIREBASE_PROJECT_ID) {
  // Option 2: Using project ID (for development/testing)
  admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
} else {
  console.warn('Firebase Admin SDK not initialized: Missing FIREBASE_SERVICE_ACCOUNT_KEY or FIREBASE_PROJECT_ID');
}

module.exports = admin;

