const User = require('../models/User');
const multer = require('multer');
const storageService = require('../services/storage');

// Configure multer for memory storage (files will be handled by storage service)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Accept PDFs and common document formats for resume
  if (file.fieldname === 'resume') {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and Word documents are allowed for resume'), false);
    }
  }
  // Accept various file types for projects
  else if (file.fieldname === 'projectFiles') {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'image/jpeg',
      'image/png',
      'image/gif',
      'text/plain',
      'application/zip',
      'application/x-zip-compressed'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('File type not allowed for project files'), false);
    }
  } else {
    cb(new Error('Unexpected field'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

/**
 * @desc    Upload resume for student onboarding
 * @route   POST /api/onboarding/resume
 * @access  Protected (requires JWT)
 */
const uploadResume = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No resume file provided'
      });
    }

    // Find the user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete old resume file if exists
    if (user.resume && user.resume.s3Key) {
      await storageService.deleteFile(user.resume.s3Key);
    }

    // Upload file using storage service
    const uploadResult = await storageService.uploadFile(req.file, 'resumes');

    // Update user with resume info
    user.resume = {
      fileName: uploadResult.fileName,
      fileUrl: uploadResult.fileUrl,
      fileSize: uploadResult.fileSize,
      mimeType: uploadResult.mimeType,
      uploadedAt: uploadResult.uploadedAt,
      s3Key: uploadResult.s3Key || uploadResult.filePath // Works for both S3 and local
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Resume uploaded successfully',
      data: {
        resume: user.resume
      }
    });
  } catch (error) {
    console.error('Resume upload error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to upload resume',
      error: error.message
    });
  }
};

/**
 * @desc    Update LinkedIn URL for student onboarding
 * @route   POST /api/onboarding/linkedin
 * @access  Protected (requires JWT)
 */
const updateLinkedIn = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const { linkedinUrl } = req.body;

    if (!linkedinUrl) {
      return res.status(400).json({
        success: false,
        message: 'LinkedIn URL is required'
      });
    }

    // Validate LinkedIn URL format
    if (!linkedinUrl.includes('linkedin.com/in/')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid LinkedIn URL format. Must be a linkedin.com/in/ profile URL'
      });
    }

    // Find and update user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.linkedinUrl = linkedinUrl;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'LinkedIn URL updated successfully',
      data: {
        linkedinUrl: user.linkedinUrl
      }
    });
  } catch (error) {
    console.error('LinkedIn update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update LinkedIn URL',
      error: error.message
    });
  }
};

/**
 * @desc    Update GitHub URL for student onboarding
 * @route   POST /api/onboarding/github
 * @access  Protected (requires JWT)
 */
const updateGitHub = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const { githubUrl } = req.body;

    if (!githubUrl) {
      return res.status(400).json({
        success: false,
        message: 'GitHub URL is required'
      });
    }

    // Validate GitHub URL format
    if (!githubUrl.includes('github.com/')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid GitHub URL format. Must be a github.com profile URL'
      });
    }

    // Find and update user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.githubUrl = githubUrl;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'GitHub URL updated successfully',
      data: {
        githubUrl: user.githubUrl
      }
    });
  } catch (error) {
    console.error('GitHub update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update GitHub URL',
      error: error.message
    });
  }
};

/**
 * @desc    Upload project files for student onboarding
 * @route   POST /api/onboarding/projects
 * @access  Protected (requires JWT)
 */
const uploadProject = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Project title is required'
      });
    }

    // Find the user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Create project object
    const project = {
      title,
      description: description || '',
      files: []
    };

    // Upload files if provided
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file =>
        storageService.uploadFile(file, `projects/${userId}`)
      );

      const uploadResults = await Promise.all(uploadPromises);

      project.files = uploadResults.map(result => ({
        fileName: result.fileName,
        fileUrl: result.fileUrl,
        fileSize: result.fileSize,
        mimeType: result.mimeType,
        uploadedAt: result.uploadedAt,
        s3Key: result.s3Key || result.filePath
      }));
    }

    // Initialize projects array if doesn't exist
    if (!user.projects) {
      user.projects = [];
    }

    // Add project to user's projects
    user.projects.push(project);
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Project uploaded successfully',
      data: {
        project: project
      }
    });
  } catch (error) {
    console.error('Project upload error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to upload project',
      error: error.message
    });
  }
};

/**
 * @desc    Delete a project
 * @route   DELETE /api/onboarding/projects/:projectId
 * @access  Protected (requires JWT)
 */
const deleteProject = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const { projectId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Find the project
    const projectIndex = user.projects.findIndex(
      p => p._id.toString() === projectId
    );

    if (projectIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Delete all project files from storage
    const project = user.projects[projectIndex];
    if (project.files && project.files.length > 0) {
      const deletePromises = project.files.map(file =>
        storageService.deleteFile(file.s3Key)
      );
      await Promise.all(deletePromises);
    }

    // Remove project from array
    user.projects.splice(projectIndex, 1);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Project delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete project',
      error: error.message
    });
  }
};

/**
 * @desc    Get user's onboarding status and data
 * @route   GET /api/onboarding/status
 * @access  Protected (requires JWT)
 */
const getOnboardingStatus = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Calculate onboarding completion status
    const onboardingStatus = {
      hasResume: !!user.resume && !!user.resume.fileUrl,
      hasLinkedIn: !!user.linkedinUrl,
      hasGitHub: !!user.githubUrl,
      hasProjects: user.projects && user.projects.length > 0,
      projectCount: user.projects ? user.projects.length : 0,
      completionPercentage: 0
    };

    // Calculate completion percentage
    const steps = [
      onboardingStatus.hasResume,
      onboardingStatus.hasLinkedIn,
      onboardingStatus.hasGitHub,
      onboardingStatus.hasProjects
    ];
    const completedSteps = steps.filter(Boolean).length;
    onboardingStatus.completionPercentage = Math.round((completedSteps / steps.length) * 100);

    res.status(200).json({
      success: true,
      data: {
        user: user.toJSON(),
        onboardingStatus
      }
    });
  } catch (error) {
    console.error('Get onboarding status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get onboarding status',
      error: error.message
    });
  }
};

/**
 * @desc    Update company preferences for student onboarding
 * @route   POST /api/onboarding/preferences
 * @access  Protected (requires JWT)
 */
const updatePreferences = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const { companyStages, industries, workStyles, needsVisa } = req.body;

    // Validate required fields
    if (!companyStages || !industries || !workStyles || needsVisa === undefined) {
      return res.status(400).json({
        success: false,
        message: 'All preference fields are required (companyStages, industries, workStyles, needsVisa)'
      });
    }

    // Validate companyStages is array
    if (!Array.isArray(companyStages) || companyStages.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Company stages must be a non-empty array'
      });
    }

    // Validate companyStages enum values
    const validStages = ['early', 'growing', 'established', 'no-preference'];
    const invalidStages = companyStages.filter(stage => !validStages.includes(stage));
    if (invalidStages.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid company stage values: ${invalidStages.join(', ')}`
      });
    }

    // Validate workStyles is array
    if (!Array.isArray(workStyles) || workStyles.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Work styles must be a non-empty array'
      });
    }

    // Validate workStyles enum values
    const validWorkStyles = ['in-person', 'hybrid', 'remote', 'no-preference'];
    const invalidWorkStyles = workStyles.filter(style => !validWorkStyles.includes(style));
    if (invalidWorkStyles.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid work style values: ${invalidWorkStyles.join(', ')}`
      });
    }

    // Validate industries is array
    if (!Array.isArray(industries) || industries.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Industries must be a non-empty array'
      });
    }

    // If "no-preference" is selected, it should be the only selection
    if (companyStages.includes('no-preference') && companyStages.length > 1) {
      return res.status(400).json({
        success: false,
        message: 'Cannot select "no-preference" with other company stages'
      });
    }

    if (workStyles.includes('no-preference') && workStyles.length > 1) {
      return res.status(400).json({
        success: false,
        message: 'Cannot select "no-preference" with other work styles'
      });
    }

    // Find and update user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update job preferences

    // console.log(companyStages);
    // console.log(workStyles);
    user.jobPreferences = {
      companyStages,
      industries,
      workStyles,
      needsVisa
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Preferences updated successfully',
      data: {
        jobPreferences: user.jobPreferences
      }
    });
  } catch (error) {
    console.error('Preferences update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update preferences',
      error: error.message
    });
  }
};

module.exports = {
  upload,
  uploadResume,
  updateLinkedIn,
  updateGitHub,
  uploadProject,
  deleteProject,
  getOnboardingStatus,
  updatePreferences
};
