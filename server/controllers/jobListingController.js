const JobListing = require('../models/JobListing');
const Company = require('../models/Company');
const TeamMember = require('../models/TeamMember');
const { v4: uuidv4 } = require('uuid');
const {
  importJobListingFromUrl,
  generateResponsibilities,
  generateQualifications,
  generateSkills
} = require('../services/aiService');

/**
 * @desc    Create a new job listing
 * @route   POST /api/job-listings
 * @access  Protected (requires JWT - employer role)
 */
const createJobListing = async (req, res) => {
  try {
    console.log('Create job listing - req.user:', JSON.stringify(req.user, null, 2));
    const userId = req.user.userId || req.user._id;
    console.log('Create job listing - userId:', userId);

    // Get team member to find their company
    const teamMember = await TeamMember.findById(userId);
    console.log('Create job listing - teamMember:', teamMember ? 'Found' : 'Not found');

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    const {
      roleTitle,
      department,
      roleDescription,
      keyResponsibilities,
      qualifications,
      requiredSkills,
      preferredSkills,
      locationType,
      officeLocation,
      startDate,
      duration,
      hoursPerWeek,
      schedule,
      compensation,
      applicationSettings,
      status,
      visibility,
      applicationDeadline
    } = req.body;

    // Validation
    if (!roleTitle || !roleDescription || !locationType) {
      return res.status(400).json({
        success: false,
        message: 'Please provide roleTitle, roleDescription, and locationType'
      });
    }

    // Create job listing
    const jobListing = new JobListing({
      listingId: uuidv4(),
      companyId: teamMember.companyId,
      createdBy: userId,
      roleTitle,
      department,
      roleDescription,
      keyResponsibilities: keyResponsibilities || [],
      qualifications: qualifications || [],
      requiredSkills: requiredSkills || [],
      preferredSkills: preferredSkills || [],
      locationType,
      officeLocation,
      startDate,
      duration,
      hoursPerWeek,
      schedule,
      compensation: compensation || {},
      applicationSettings: applicationSettings || {
        requireResume: true,
        requireCoverLetter: false,
        customQuestions: []
      },
      status: status || 'draft',
      visibility: visibility || 'public',
      applicationDeadline
    });

    // If status is 'active', set postedAt date
    if (jobListing.status === 'active' && !jobListing.postedAt) {
      jobListing.postedAt = new Date();
    }

    await jobListing.save();

    // Populate company info before returning
    await jobListing.populate('companyId', 'companyName companyLogo industry companySize');

    res.status(201).json({
      success: true,
      message: 'Job listing created successfully',
      data: {
        jobListing: jobListing.toJSON()
      }
    });
  } catch (error) {
    console.error('Create job listing error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create job listing',
      error: error.message
    });
  }
};

/**
 * @desc    Get all job listings for the employer's company
 * @route   GET /api/job-listings
 * @access  Protected (requires JWT - employer role)
 */
const getCompanyJobListings = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;

    // Get team member to find their company
    const teamMember = await TeamMember.findById(userId);

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    const jobListings = await JobListing.find({ companyId: teamMember.companyId })
      .populate('companyId', 'companyName companyLogo industry companySize')
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        jobListings
      }
    });
  } catch (error) {
    console.error('Get job listings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job listings',
      error: error.message
    });
  }
};

/**
 * @desc    Get a single job listing by ID
 * @route   GET /api/job-listings/:id
 * @access  Protected (requires JWT - employer role)
 */
const getJobListingById = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const listingId = req.params.id;

    // Get team member to find their company
    const teamMember = await TeamMember.findById(userId);

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    const jobListing = await JobListing.findOne({
      _id: listingId,
      companyId: teamMember.companyId
    })
      .populate('companyId', 'companyName companyLogo industry companySize')
      .populate('createdBy', 'firstName lastName');

    if (!jobListing) {
      return res.status(404).json({
        success: false,
        message: 'Job listing not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        jobListing
      }
    });
  } catch (error) {
    console.error('Get job listing error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job listing',
      error: error.message
    });
  }
};

/**
 * @desc    Update a job listing
 * @route   PUT /api/job-listings/:id
 * @access  Protected (requires JWT - employer role)
 */
const updateJobListing = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const listingId = req.params.id;

    // Get team member to find their company
    const teamMember = await TeamMember.findById(userId);

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    const jobListing = await JobListing.findOne({
      _id: listingId,
      companyId: teamMember.companyId
    });

    if (!jobListing) {
      return res.status(404).json({
        success: false,
        message: 'Job listing not found'
      });
    }

    // Update allowed fields
    const allowedUpdates = [
      'roleTitle', 'department', 'roleDescription', 'keyResponsibilities',
      'qualifications', 'requiredSkills', 'preferredSkills', 'locationType',
      'officeLocation', 'startDate', 'duration', 'hoursPerWeek', 'schedule',
      'compensation', 'applicationSettings', 'status', 'visibility',
      'applicationDeadline'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        jobListing[field] = req.body[field];
      }
    });

    // If status changed to 'active' and postedAt is not set, set it now
    if (req.body.status === 'active' && !jobListing.postedAt) {
      jobListing.postedAt = new Date();
    }

    // If status changed to 'closed' or 'filled', set closedAt
    if ((req.body.status === 'closed' || req.body.status === 'filled') && !jobListing.closedAt) {
      jobListing.closedAt = new Date();
    }

    await jobListing.save();
    await jobListing.populate('companyId', 'companyName companyLogo industry companySize');

    res.status(200).json({
      success: true,
      message: 'Job listing updated successfully',
      data: {
        jobListing
      }
    });
  } catch (error) {
    console.error('Update job listing error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update job listing',
      error: error.message
    });
  }
};

/**
 * @desc    Delete a job listing
 * @route   DELETE /api/job-listings/:id
 * @access  Protected (requires JWT - employer role)
 */
const deleteJobListing = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const listingId = req.params.id;

    // Get team member to find their company
    const teamMember = await TeamMember.findById(userId);

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    const jobListing = await JobListing.findOneAndDelete({
      _id: listingId,
      companyId: teamMember.companyId
    });

    if (!jobListing) {
      return res.status(404).json({
        success: false,
        message: 'Job listing not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job listing deleted successfully'
    });
  } catch (error) {
    console.error('Delete job listing error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete job listing',
      error: error.message
    });
  }
};

/**
 * @desc    Import job listing from URL using AI
 * @route   POST /api/job-listings/ai/import
 * @access  Protected (requires JWT - employer role)
 */
const aiImportJobListing = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a URL'
      });
    }

    const jobData = await importJobListingFromUrl(url);

    res.status(200).json({
      success: true,
      message: 'Job listing imported successfully',
      data: jobData
    });
  } catch (error) {
    console.error('AI import job listing error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to import job listing',
      error: error.message
    });
  }
};

/**
 * @desc    Generate responsibilities using AI
 * @route   POST /api/job-listings/ai/generate-responsibilities
 * @access  Protected (requires JWT - employer role)
 */
const aiGenerateResponsibilities = async (req, res) => {
  try {
    const { roleTitle, roleDescription, department } = req.body;

    if (!roleTitle || !roleDescription) {
      return res.status(400).json({
        success: false,
        message: 'Please provide roleTitle and roleDescription'
      });
    }

    const responsibilities = await generateResponsibilities(roleTitle, roleDescription, department);

    res.status(200).json({
      success: true,
      message: 'Responsibilities generated successfully',
      data: { responsibilities }
    });
  } catch (error) {
    console.error('AI generate responsibilities error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate responsibilities',
      error: error.message
    });
  }
};

/**
 * @desc    Generate qualifications using AI
 * @route   POST /api/job-listings/ai/generate-qualifications
 * @access  Protected (requires JWT - employer role)
 */
const aiGenerateQualifications = async (req, res) => {
  try {
    const { roleTitle, roleDescription, responsibilities } = req.body;

    if (!roleTitle || !roleDescription) {
      return res.status(400).json({
        success: false,
        message: 'Please provide roleTitle and roleDescription'
      });
    }

    const qualifications = await generateQualifications(roleTitle, roleDescription, responsibilities || []);

    res.status(200).json({
      success: true,
      message: 'Qualifications generated successfully',
      data: { qualifications }
    });
  } catch (error) {
    console.error('AI generate qualifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate qualifications',
      error: error.message
    });
  }
};

/**
 * @desc    Generate skills using AI
 * @route   POST /api/job-listings/ai/generate-skills
 * @access  Protected (requires JWT - employer role)
 */
const aiGenerateSkills = async (req, res) => {
  try {
    const { roleTitle, roleDescription, responsibilities } = req.body;

    if (!roleTitle || !roleDescription) {
      return res.status(400).json({
        success: false,
        message: 'Please provide roleTitle and roleDescription'
      });
    }

    const skills = await generateSkills(roleTitle, roleDescription, responsibilities || []);

    res.status(200).json({
      success: true,
      message: 'Skills generated successfully',
      data: { skills }
    });
  } catch (error) {
    console.error('AI generate skills error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate skills',
      error: error.message
    });
  }
};

module.exports = {
  createJobListing,
  getCompanyJobListings,
  getJobListingById,
  updateJobListing,
  deleteJobListing,
  aiImportJobListing,
  aiGenerateResponsibilities,
  aiGenerateQualifications,
  aiGenerateSkills
};
