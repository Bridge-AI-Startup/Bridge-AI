const admin = require('../config/firebase');

/**
 * @desc    Add email to waitlist
 * @route   POST /api/waitlist
 * @access  Public
 */
const addToWaitlist = async (req, res) => {
  try {
    const { email, userType, source, name } = req.body;

    console.log(req.body);

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address',
      });
    }

    // Check if Firebase is initialized
    if (!admin.apps.length) {
      // Fallback: Just return success (you can add MongoDB storage here if needed)
      console.log('Waitlist signup (Firebase not configured):', email);
      return res.status(200).json({
        success: true,
        message: 'Successfully joined the waitlist!',
      });
    }

    const db = admin.firestore();
    const normalizedEmail = email.toLowerCase().trim();

    // Check if email already exists
    const existingEntry = await db
      .collection('waitlist')
      .where('email', '==', normalizedEmail)
      .limit(1)
      .get();

    if (!existingEntry.empty) {
      return res.status(200).json({
        success: true,
        message: "You're already on the waitlist!",
        alreadyExists: true,
      });
    }

    // Add to Firestore
    const waitlistEntry = {
      email: normalizedEmail,
      userType: userType || 'not_specified',
      source: source || 'landing_page',
      name: name || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'pending',
    };

    await db.collection('waitlist').add(waitlistEntry);

    res.status(201).json({
      success: true,
      message: 'Successfully joined the waitlist!',
    });
  } catch (error) {
    console.error('Waitlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to join waitlist. Please try again.',
      error: error.message,
    });
  }
};

/**
 * @desc    Get waitlist stats (admin only - add auth middleware later)
 * @route   GET /api/waitlist/stats
 * @access  Public (should be protected)
 */
const getWaitlistStats = async (req, res) => {
  try {
    if (!admin.apps.length) {
      return res.status(500).json({
        success: false,
        message: 'Firebase not configured',
      });
    }

    const db = admin.firestore();
    const snapshot = await db.collection('waitlist').get();

    const stats = {
      total: snapshot.size,
      byUserType: {},
      bySource: {},
    };

    snapshot.forEach((doc) => {
      const data = doc.data();

      // Count by user type
      const userType = data.userType || 'not_specified';
      stats.byUserType[userType] = (stats.byUserType[userType] || 0) + 1;

      // Count by source
      const source = data.source || 'unknown';
      stats.bySource[source] = (stats.bySource[source] || 0) + 1;
    });

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Get waitlist stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get waitlist stats',
      error: error.message,
    });
  }
};

module.exports = {
  addToWaitlist,
  getWaitlistStats,
};
