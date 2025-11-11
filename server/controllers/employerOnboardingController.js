const Company = require('../models/Company');
const TeamMember = require('../models/TeamMember');
const multer = require('multer');
const storageService = require('../services/storage');
const { generateCompanyProfile } = require('../services/aiService');


// Configure multer for memory storage (files will be handled by storage service)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Accept image files for company logo
  if (file.fieldname === 'logo') {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for company logo'), false);
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
 * @desc    Create or update company profile during employer onboarding
 * @route   POST /api/employer-onboarding/company-profile
 * @access  Protected (requires JWT - employer role)
 */
const createCompanyProfile = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const {
      companyName,
      companyWebsite,
      pitch,
      description,
      headquarters,
      foundedYear,
      industry,
      companySize,
      fundingStage,
      teamMembers,
      setupMethod
    } = req.body;

    // Validate required fields
    if (!companyName || !pitch || !description) {
      return res.status(400).json({
        success: false,
        message: 'Company name, pitch, and description are required'
      });
    }

    // Check if user is an employer (TeamMember)
    const teamMember = await TeamMember.findById(userId);

    if (!teamMember) {
      return res.status(403).json({
        success: false,
        message: 'Only employers can create company profiles'
      });
    }

    // Check if company already exists
    let company;
    if (teamMember.companyId) {
      // Update existing company
      company = await Company.findById(teamMember.companyId);
      if (!company) {
        return res.status(404).json({
          success: false,
          message: 'Company not found'
        });
      }
    } else {
      // Create new company
      company = new Company({
        companyId: `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        companyName
      });
    }

    // Parse headquarters (expecting format: "City, State" or custom string)
    if (headquarters) {
      const parts = headquarters.split(',').map(p => p.trim());
      if (parts.length >= 2) {
        company.headquarters = {
          city: parts[0],
          state: parts[1],
          country: parts[2] || 'USA'
        };
      } else {
        company.headquarters = {
          city: headquarters,
          state: '',
          country: ''
        };
      }
    }

    // Update company fields
    company.companyName = companyName;
    company.companyWebsite = companyWebsite || '';
    company.oneSentencePitch = pitch;
    company.companyDescription = description;
    company.foundedYear = foundedYear ? parseInt(foundedYear) : null;
    company.industry = industry || '';
    company.companySize = companySize || '';
    company.fundingStage = fundingStage ? fundingStage.replace(/-/g, '_') : '';
    company.onboardingCompleted = true;
    company.setupMethod = setupMethod || 'manual';

    // Handle logo upload if provided
    if (req.file) {
      // Delete old logo if exists
      if (company.companyLogo && company.companyLogo.s3Key) {
        await storageService.deleteFile(company.companyLogo.s3Key);
      }

      // Upload new logo
      const uploadResult = await storageService.uploadFile(req.file, 'company-logos');
      company.companyLogo = {
        fileName: uploadResult.fileName,
        fileUrl: uploadResult.fileUrl,
        fileSize: uploadResult.fileSize,
        uploadedAt: uploadResult.uploadedAt,
        s3Key: uploadResult.s3Key || uploadResult.filePath
      };
    }

    await company.save();

    // Link company to team member if not already linked
    if (!teamMember.companyId) {
      teamMember.companyId = company._id;
      await teamMember.save();
    }

    // TODO: Send invitations to team members (if teamMembers array provided)
    // This will be implemented in a future update with email service

    res.status(200).json({
      success: true,
      message: 'Company profile created successfully',
      data: {
        company: company.toJSON()
      }
    });
  } catch (error) {
    console.error('Company profile creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create company profile',
      error: error.message
    });
  }
};

/**
 * @desc    Upload company logo
 * @route   POST /api/employer-onboarding/logo
 * @access  Protected (requires JWT - employer role)
 */
const uploadLogo = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No logo file provided'
      });
    }

    // Check if user is an employer
    const teamMember = await TeamMember.findById(userId);

    if (!teamMember || !teamMember.companyId) {
      return res.status(403).json({
        success: false,
        message: 'Employer must have a company to upload logo'
      });
    }

    // Find the company
    const company = await Company.findById(teamMember.companyId);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Delete old logo if exists
    if (company.companyLogo && company.companyLogo.s3Key) {
      await storageService.deleteFile(company.companyLogo.s3Key);
    }

    // Upload new logo
    const uploadResult = await storageService.uploadFile(req.file, 'company-logos');

    company.companyLogo = {
      fileName: uploadResult.fileName,
      fileUrl: uploadResult.fileUrl,
      fileSize: uploadResult.fileSize,
      uploadedAt: uploadResult.uploadedAt,
      s3Key: uploadResult.s3Key || uploadResult.filePath
    };

    await company.save();

    res.status(200).json({
      success: true,
      message: 'Logo uploaded successfully',
      data: {
        logo: company.companyLogo
      }
    });
  } catch (error) {
    console.error('Logo upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload logo',
      error: error.message
    });
  }
};

/**
 * @desc    Get employer's company profile and onboarding status
 * @route   GET /api/employer-onboarding/status
 * @access  Protected (requires JWT - employer role)
 */
const getOnboardingStatus = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;

    // Get team member info
    const teamMember = await TeamMember.findById(userId).select('-password');

    if (!teamMember) {
      return res.status(403).json({
        success: false,
        message: 'Only employers can access this endpoint'
      });
    }

    let company = null;
    let onboardingStatus = {
      hasCompanyProfile: false,
      hasCompanyLogo: false,
      onboardingCompleted: false
    };

    // Get company info if exists
    if (teamMember.companyId) {
      company = await Company.findById(teamMember.companyId);

      if (company) {
        onboardingStatus.hasCompanyProfile = !!(
          company.companyName &&
          company.oneSentencePitch &&
          company.companyDescription
        );
        onboardingStatus.hasCompanyLogo = !!(company.companyLogo && company.companyLogo.fileUrl);
        onboardingStatus.onboardingCompleted = company.onboardingCompleted || false;
      }
    }

    res.status(200).json({
      success: true,
      data: {
        teamMember: teamMember.toJSON(),
        company: company ? company.toJSON() : null,
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
 * @desc    Generate company profile using AI
 * @route   POST /api/ai/generate-company-profile
 * @access  Private (requires authentication)
 */
const generateProfile = async (req, res) => {
  try {
    const { companyName, website } = req.body;

    // Validation
    console.log(req)
    if (!companyName || !website) {
      return res.status(400).json({
        success: false,
        message: 'Company name and website are required'
      });
    }

    // Validate website URL format
    try {
      new URL(website);
    } catch (urlError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid website URL format'
      });
    }

    // Generate company profile using AI
    const companyData = await generateCompanyProfile(companyName, website);

    res.json({
      success: true,
      data: companyData,
      message: 'Company profile generated successfully'
    });

  } catch (error) {
    console.error('Error in generateProfile controller:', error);

    // Return appropriate error response
    const statusCode = error.message?.includes('quota') ? 429 : 500;

    res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to generate company profile',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

module.exports = {
  upload,
  createCompanyProfile,
  uploadLogo,
  getOnboardingStatus,
  generateProfile
};
