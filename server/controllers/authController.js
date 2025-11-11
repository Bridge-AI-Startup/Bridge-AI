const User = require('../models/User');
const TeamMember = require('../models/TeamMember');
const Company = require('../models/Company');
const admin = require('../config/firebase');
const jwt = require('jsonwebtoken');

/**
 * @desc    Student sign in with Firebase ID token
 * @route   POST /api/auth/student/signin
 * @access  Public
 */
const studentSignIn = async (req, res) => {
  try {
    if (!admin.apps.length) {
      return res.status(500).json({
        success: false,
        message: 'Firebase Admin SDK is not initialized',
      });
    }

    const { idToken, photoURL } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'Firebase ID token is required',
      });
    }

    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture, email_verified } = decodedToken;

    // Use photoURL from request body if provided, otherwise use from token
    const userPhotoURL = photoURL || picture;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required in Firebase token',
      });
    }

    // Check if user exists as a student
    let user = await User.findOne({
      $or: [{ uid }, { email }]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Student account not found. Please sign up first.',
      });
    }

    // Update user with latest Firebase information
    user.uid = uid;
    user.email = email;
    user.name = name || user.name;
    user.profilePicture = userPhotoURL || user.profilePicture;
    user.emailVerified = email_verified || user.emailVerified;
    user.authProvider = 'google';
    user.lastLoginAt = new Date();

    await user.save();

    // Generate JWT token
    const appToken = jwt.sign(
      {
        userId: user._id,
        uid: user.uid,
        email: user.email,
        role: 'user',
        userType: 'student',
        authProvider: 'google',
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Student sign-in successful',
      data: {
        user: user.toJSON(),
        token: appToken,
        role: 'user',
        userType: 'student',
      },
    });
  } catch (error) {
    console.error('Student sign-in error:', error);

    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({
        success: false,
        message: 'Firebase token has expired',
      });
    }

    if (error.code === 'auth/id-token-revoked') {
      return res.status(401).json({
        success: false,
        message: 'Firebase token has been revoked',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Student sign-in failed',
      error: error.message,
    });
  }
};

/**
 * @desc    Employer sign in with Firebase ID token
 * @route   POST /api/auth/employer/signin
 * @access  Public
 */
const employerSignIn = async (req, res) => {
  try {
    if (!admin.apps.length) {
      return res.status(500).json({
        success: false,
        message: 'Firebase Admin SDK is not initialized',
      });
    }

    const { idToken, photoURL } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'Firebase ID token is required',
      });
    }

    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture, email_verified } = decodedToken;

    // Use photoURL from request body if provided, otherwise use from token
    const userPhotoURL = photoURL || picture;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required in Firebase token',
      });
    }

    // Check if user exists as an employer
    let teamMember = await TeamMember.findOne({
      $or: [{ uid }, { email }]
    }).populate('companyId');

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Employer account not found. Please sign up first.',
      });
    }

    // Update team member with latest Firebase information
    teamMember.uid = uid;
    teamMember.email = email;
    teamMember.firstName = name?.split(' ')[0] || teamMember.firstName;
    teamMember.lastName = name?.split(' ').slice(1).join(' ') || teamMember.lastName;
    if (userPhotoURL) teamMember.profilePhoto = { fileUrl: userPhotoURL };
    teamMember.emailVerified = email_verified || teamMember.emailVerified;
    teamMember.authProvider = 'google';
    teamMember.lastLoginAt = new Date();

    await teamMember.save();

    const applicationRole = 'employer';
    const isEmployerAdmin = teamMember.companyRole === 'admin';

    // Generate JWT token
    const appToken = jwt.sign(
      {
        userId: teamMember._id,
        uid: teamMember.uid,
        email: teamMember.email,
        role: applicationRole,
        userType: 'employer',
        companyId: teamMember.companyId?._id || teamMember.companyId,
        companyRole: teamMember.companyRole,
        isEmployerAdmin: isEmployerAdmin,
        authProvider: 'google',
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    const memberResponse = teamMember.toJSON();
    memberResponse.role = applicationRole;
    memberResponse.isEmployerAdmin = isEmployerAdmin;

    res.status(200).json({
      success: true,
      message: 'Employer sign-in successful',
      data: {
        user: memberResponse,
        company: teamMember.companyId,
        token: appToken,
        role: applicationRole,
        userType: 'employer',
        companyRole: teamMember.companyRole,
        isEmployerAdmin: isEmployerAdmin,
      },
    });
  } catch (error) {
    console.error('Employer sign-in error:', error);

    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({
        success: false,
        message: 'Firebase token has expired',
      });
    }

    if (error.code === 'auth/id-token-revoked') {
      return res.status(401).json({
        success: false,
        message: 'Firebase token has been revoked',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Employer sign-in failed',
      error: error.message,
    });
  }
};

/**
 * @desc    Verify Firebase ID token and create/update user (DEPRECATED - use specific signin endpoints)
 * @route   POST /api/auth/firebase/signin
 * @access  Public
 */
const firebaseSignIn = async (req, res) => {
  try {
    // Check if Firebase Admin SDK is initialized
    if (!admin.apps.length) {
      return res.status(500).json({
        success: false,
        message: 'Firebase Admin SDK is not initialized. Please configure FIREBASE_SERVICE_ACCOUNT_KEY or FIREBASE_PROJECT_ID',
      });
    }

    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'Firebase ID token is required',
      });
    }

    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture, email_verified } = decodedToken;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required in Firebase token',
      });
    }

    // Check if user exists as TeamMember (employer) first
    let teamMember = await TeamMember.findOne({
      $or: [
        { uid: uid },
        { email: email }
      ]
    }).populate('companyId');

    if (teamMember) {
      // Update team member with latest Firebase information
      teamMember.uid = uid; // Ensure uid is set to Firebase UID
      teamMember.email = email;
      teamMember.firstName = name?.split(' ')[0] || teamMember.firstName;
      teamMember.lastName = name?.split(' ').slice(1).join(' ') || teamMember.lastName;
      if (picture) teamMember.profilePhoto = { fileUrl: picture };
      teamMember.emailVerified = email_verified || teamMember.emailVerified;
      teamMember.authProvider = 'google';
      teamMember.lastLoginAt = new Date();

      await teamMember.save();

      // All team members are employers at application level
      // companyRole determines if they're employer admin ('admin') or regular employer ('member')
      const applicationRole = 'employer'; // Application-level role
      const isEmployerAdmin = teamMember.companyRole === 'admin'; // Company-level admin

      // Generate JWT token for the application
      const appToken = jwt.sign(
        {
          userId: teamMember._id,
          uid: teamMember.uid,
          email: teamMember.email,
          role: applicationRole, // 'employer' at application level
          userType: 'employer',
          companyId: teamMember.companyId?._id || teamMember.companyId,
          companyRole: teamMember.companyRole, // 'admin' or 'member' - employer admin vs regular employer
          isEmployerAdmin: isEmployerAdmin,
          authProvider: 'google',
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      const memberResponse = teamMember.toJSON();
      memberResponse.role = applicationRole; // Application role: 'employer'
      memberResponse.isEmployerAdmin = isEmployerAdmin; // Clarify employer admin status

      return res.status(200).json({
        success: true,
        message: 'Firebase authentication successful',
        data: {
          user: memberResponse,
          token: appToken,
          firebaseToken: idToken,
          role: applicationRole, // 'employer'
          userType: 'employer',
          companyRole: teamMember.companyRole, // 'admin' (employer admin) or 'member' (regular employer)
          isEmployerAdmin: isEmployerAdmin,
        },
      });
    }

    // Check if user exists as User (student/candidate)
    let user = await User.findOne({
      $or: [
        { uid: uid },
        { email: email }
      ]
    });

    if (user) {
      // Update user with latest Firebase information
      user.uid = uid; // Ensure uid is set to Firebase UID
      user.email = email;
      user.name = name || user.name;
      user.profilePicture = picture || user.profilePicture;
      user.emailVerified = email_verified || user.emailVerified;
      user.authProvider = 'google';
      user.lastLoginAt = new Date();

      await user.save();
    } else {
      // Create new user (defaults to 'user' role - student/candidate)
      user = await User.create({
        uid: uid,
        email: email,
        name: name || email.split('@')[0],
        authProvider: 'google',
        profilePicture: picture,
        emailVerified: email_verified || false,
        role: 'user', // Student/candidate role
        lastLoginAt: new Date(),
      });
    }

    // Generate JWT token for the application
    const appToken = jwt.sign(
      {
        userId: user._id,
        uid: user.uid,
        email: user.email,
        role: 'user', // Student/candidate role
        userType: 'student',
        authProvider: 'google',
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Remove sensitive data from user object
    const userResponse = user.toJSON();

    res.status(200).json({
      success: true,
      message: 'Firebase authentication successful',
      data: {
        user: userResponse,
        token: appToken,
        firebaseToken: idToken,
        role: 'user', // Student/candidate role
        userType: 'student',
      },
    });
  } catch (error) {
    console.error('Firebase sign-in error:', error);

    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({
        success: false,
        message: 'Firebase token has expired',
      });
    }

    if (error.code === 'auth/id-token-revoked') {
      return res.status(401).json({
        success: false,
        message: 'Firebase token has been revoked',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Firebase authentication failed',
      error: error.message,
    });
  }
};

/**
 * @desc    Verify Firebase ID token (for client-side token verification)
 * @route   POST /api/auth/firebase/verify
 * @access  Public
 */
const verifyFirebaseToken = async (req, res) => {
  try {
    // Check if Firebase Admin SDK is initialized
    if (!admin.apps.length) {
      return res.status(500).json({
        success: false,
        message: 'Firebase Admin SDK is not initialized. Please configure FIREBASE_SERVICE_ACCOUNT_KEY or FIREBASE_PROJECT_ID',
      });
    }

    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'Firebase ID token is required',
      });
    }

    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    res.status(200).json({
      success: true,
      message: 'Token is valid',
      data: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified,
        name: decodedToken.name,
        picture: decodedToken.picture,
      },
    });
  } catch (error) {
    console.error('Firebase token verification error:', error);
    
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      error: error.message,
    });
  }
};

/**
 * @desc    Get current user from Firebase token
 * @route   GET /api/auth/me
 * @access  Protected (requires Firebase token)
 */
const getCurrentUser = async (req, res) => {
  try {
    // req.user is set by verifyFirebaseToken middleware or authMiddleware
    const { uid, email, userId } = req.user;

    // Try to find as TeamMember (employer) first
    let teamMember = await TeamMember.findOne({ 
      $or: [
        { uid: uid },
        { email: email },
        { _id: userId }
      ]
    }).populate('companyId');

    if (teamMember) {
      const memberResponse = teamMember.toJSON();
      memberResponse.role = 'employer'; // Application-level role: all team members are employers
      memberResponse.userType = 'employer';
      memberResponse.companyRole = teamMember.companyRole; // Company-level role: 'admin' (employer admin) or 'member' (regular employer)
      memberResponse.isEmployerAdmin = teamMember.companyRole === 'admin'; // Clarify employer admin status
      
      return res.status(200).json({
        success: true,
        data: memberResponse,
      });
    }

    // Find as User (student/candidate)
    const user = await User.findOne({ 
      $or: [
        { uid: uid },
        { email: email },
        { _id: userId }
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found in database',
      });
    }

    const userResponse = user.toJSON();
    userResponse.role = 'user'; // Student/candidate role
    userResponse.userType = 'student';

    res.status(200).json({
      success: true,
      data: userResponse,
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get current user',
      error: error.message,
    });
  }
};

/**
 * @desc    Link Firebase account to existing user
 * @route   POST /api/auth/firebase/link
 * @access  Protected (requires existing auth)
 */
const linkFirebaseAccount = async (req, res) => {
  try {
    // Check if Firebase Admin SDK is initialized
    if (!admin.apps.length) {
      return res.status(500).json({
        success: false,
        message: 'Firebase Admin SDK is not initialized. Please configure FIREBASE_SERVICE_ACCOUNT_KEY or FIREBASE_PROJECT_ID',
      });
    }

    const { idToken } = req.body;
    const userId = req.user?.userId || req.user?.uid; // Support both JWT and Firebase auth

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'Firebase ID token is required',
      });
    }

    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, picture } = decodedToken;

    // Try to find as TeamMember (employer) first
    let teamMember = await TeamMember.findOne({
      $or: [
        { _id: userId },
        { email: req.user?.email }
      ]
    });

    if (teamMember) {
      // Check if Firebase UID is already linked to another team member
      const existingMember = await TeamMember.findOne({ 
        uid: uid,
        _id: { $ne: teamMember._id }
      });

      if (existingMember) {
        return res.status(400).json({
          success: false,
          message: 'This Firebase account is already linked to another team member',
        });
      }

      // Link Firebase account to team member
      teamMember.uid = uid;
      teamMember.authProvider = 'google';
      if (picture) teamMember.profilePhoto = { fileUrl: picture };
      teamMember.emailVerified = decodedToken.email_verified || teamMember.emailVerified;
      
      await teamMember.save();

      const memberResponse = teamMember.toJSON();
      memberResponse.role = 'employer'; // Application-level role
      memberResponse.isEmployerAdmin = teamMember.companyRole === 'admin'; // Employer admin status

      return res.status(200).json({
        success: true,
        message: 'Firebase account linked successfully',
        data: memberResponse,
      });
    }

    // Find user by userId (from JWT) or email
    let user = await User.findOne({
      $or: [
        { _id: userId },
        { email: req.user?.email }
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if Firebase UID is already linked to another account
    const existingUser = await User.findOne({ 
      uid: uid,
      _id: { $ne: user._id }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'This Firebase account is already linked to another user',
      });
    }

    // Link Firebase account
    user.uid = uid;
    user.authProvider = 'google';
    if (picture) user.profilePicture = picture;
    user.emailVerified = decodedToken.email_verified || user.emailVerified;
    
    await user.save();

    const userResponse = user.toJSON();
    userResponse.role = 'user'; // Student/candidate role

    res.status(200).json({
      success: true,
      message: 'Firebase account linked successfully',
      data: userResponse,
    });
  } catch (error) {
    console.error('Link Firebase account error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to link Firebase account',
      error: error.message,
    });
  }
};

/**
 * @desc    Student signup with Firebase ID token
 * @route   POST /api/auth/student/signup
 * @access  Public
 */
const studentSignup = async (req, res) => {
  try {
    if (!admin.apps.length) {
      return res.status(500).json({
        success: false,
        message: 'Firebase Admin SDK is not initialized',
      });
    }

    const { idToken, name, university, photoURL } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'Firebase ID token is required',
      });
    }

    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, picture, email_verified } = decodedToken;

    // Use photoURL from request body if provided, otherwise use from token
    const userPhotoURL = photoURL || picture;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required in Firebase token',
      });
    }

    // Check if user already exists as a student
    const existingUser = await User.findOne({
      $or: [{ uid }, { email }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists. Please sign in instead.',
      });
    }

    // Check if user already has an employer account
    const existingEmployer = await TeamMember.findOne({
      $or: [{ uid }, { email }]
    });

    if (existingEmployer) {
      return res.status(400).json({
        success: false,
        message: 'This email is already registered as an employer account. Please use a different email or sign in to your employer account.',
      });
    }

    // Create new student user in MongoDB
    const user = await User.create({
      uid,
      email,
      name: name || decodedToken.name || email.split('@')[0],
      authProvider: 'google',
      profilePicture: userPhotoURL,
      emailVerified: email_verified || false,
      role: 'user',
      university: university || email.split('@')[1]?.split('.')[0]?.toUpperCase(),
      lastLoginAt: new Date(),
    });

    // Generate JWT token
    const appToken = jwt.sign(
      {
        userId: user._id,
        uid: user.uid,
        email: user.email,
        role: 'user',
        userType: 'student',
        authProvider: 'google',
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Student account created successfully',
      data: {
        user: user.toJSON(),
        token: appToken,
        role: 'user',
        userType: 'student',
      },
    });
  } catch (error) {
    console.error('Student signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Student signup failed',
      error: error.message,
    });
  }
};

/**
 * @desc    Employer signup with Firebase ID token
 * @route   POST /api/auth/employer/signup
 * @access  Public
 */
const employerSignup = async (req, res) => {
  try {
    if (!admin.apps.length) {
      return res.status(500).json({
        success: false,
        message: 'Firebase Admin SDK is not initialized',
      });
    }

    const { idToken, companyName, companyWebsite, industry, firstName, lastName, photoURL } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'Firebase ID token is required',
      });
    }

    if (!companyName) {
      return res.status(400).json({
        success: false,
        message: 'Company name is required',
      });
    }

    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, picture, email_verified } = decodedToken;

    // Use photoURL from request body if provided, otherwise use from token
    const userPhotoURL = photoURL || picture;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required in Firebase token',
      });
    }

    // Check if team member already exists as an employer
    const existingMember = await TeamMember.findOne({
      $or: [{ uid }, { email }]
    });

    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: 'Employer account already exists. Please sign in instead.',
      });
    }

    // Check if user already has a student account
    const existingStudent = await User.findOne({
      $or: [{ uid }, { email }]
    });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'This email is already registered as a student account. Please use a different email or sign in to your student account.',
      });
    }

    // Create company in MongoDB
    const company = await Company.create({
      companyId: `comp_${Date.now()}`,
      companyName,
      companyWebsite: companyWebsite || '',
      industry: industry || '',
    });

    // Create team member (employer admin) in MongoDB
    const teamMember = await TeamMember.create({
      uid,
      email,
      firstName: firstName || decodedToken.name?.split(' ')[0] || email.split('@')[0],
      lastName: lastName || decodedToken.name?.split(' ').slice(1).join(' ') || '',
      companyId: company._id,
      companyRole: 'admin',
      authProvider: 'google',
      profilePhoto: userPhotoURL ? { fileUrl: userPhotoURL } : undefined,
      emailVerified: email_verified || false,
      lastLoginAt: new Date(),
    });

    // Generate JWT token
    const appToken = jwt.sign(
      {
        userId: teamMember._id,
        uid: teamMember.uid,
        email: teamMember.email,
        role: 'employer',
        userType: 'employer',
        companyId: company._id,
        companyRole: 'admin',
        isEmployerAdmin: true,
        authProvider: 'google',
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    const memberResponse = teamMember.toJSON();
    memberResponse.role = 'employer';
    memberResponse.isEmployerAdmin = true;

    res.status(201).json({
      success: true,
      message: 'Employer account created successfully',
      data: {
        user: memberResponse,
        company: company.toJSON(),
        token: appToken,
        role: 'employer',
        userType: 'employer',
        companyRole: 'admin',
        isEmployerAdmin: true,
      },
    });
  } catch (error) {
    console.error('Employer signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Employer signup failed',
      error: error.message,
    });
  }
};

module.exports = {
  firebaseSignIn,
  studentSignIn,
  employerSignIn,
  verifyFirebaseToken,
  getCurrentUser,
  linkFirebaseAccount,
  studentSignup,
  employerSignup,
};

