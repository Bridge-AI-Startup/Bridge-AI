const Application = require('../models/Application');
const User = require('../models/User');
const JobListing = require('../models/JobListing');
const AssessmentResult = require('../models/AssessmentResult');
const TeamMember = require('../models/TeamMember');

/**
 * @route   POST /api/applications
 * @desc    Create a new application
 * @access  Protected (Student only)
 */
exports.createApplication = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const { jobListingId, coverLetter, customResponses } = req.body;

    // Validate required fields
    if (!jobListingId) {
      return res.status(400).json({
        success: false,
        message: 'Job listing ID is required'
      });
    }

    // Get job listing
    const jobListing = await JobListing.findById(jobListingId).populate('company');
    if (!jobListing) {
      return res.status(404).json({
        success: false,
        message: 'Job listing not found'
      });
    }

    // Get student profile
    const student = await User.findById(userId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Check if application already exists
    const existingApplication = await Application.findOne({
      candidateId: userId,
      jobListingId: jobListingId
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied to this job'
      });
    }

    // Create application
    const application = new Application({
      applicationId: `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      candidateId: userId,
      jobListingId: jobListing._id,
      companyId: jobListing.company._id || jobListing.company,
      resume: student.resume,
      coverLetter: coverLetter || '',
      portfolio: {
        githubUrl: student.githubUrl || '',
        linkedinUrl: student.linkedinUrl || '',
        websiteUrl: student.portfolioUrl || ''
      },
      customResponses: customResponses || [],
      stage: 'new',
      appliedAt: new Date(),
      lastActivityAt: new Date(),
      source: 'direct_apply'
    });

    await application.save();

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: {
        application: application
      }
    });

  } catch (error) {
    console.error('Error in createApplication:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create application'
    });
  }
};

/**
 * @route   GET /api/applications
 * @desc    Get applications (for student or employer)
 * @access  Protected
 */
exports.getApplications = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const userType = req.user.userType || req.user.role;
    const { jobListingId, stage, limit = 50 } = req.query;

    let query = {};

    // If student - get their applications
    if (userType === 'student' || userType === 'user') {
      query.candidateId = userId;
    }
    // If employer - get applications for their company's jobs
    else if (userType === 'employer') {
      const teamMember = await TeamMember.findById(userId);
      if (!teamMember) {
        return res.status(404).json({
          success: false,
          message: 'Team member not found'
        });
      }
      query.companyId = teamMember.company;
    }

    // Filter by job listing if provided
    if (jobListingId) {
      query.jobListingId = jobListingId;
    }

    // Filter by stage if provided
    if (stage) {
      query.stage = stage;
    }

    const applications = await Application.find(query)
      .populate('candidateId', 'firstName lastName email profilePicture githubUrl linkedinUrl skills education workExperience')
      .populate('jobListingId', 'roleTitle company locationType compensationType compensation')
      .populate('companyId', 'companyName logo')
      .sort({ appliedAt: -1 })
      .limit(parseInt(limit));

    return res.status(200).json({
      success: true,
      data: {
        applications: applications,
        count: applications.length
      }
    });

  } catch (error) {
    console.error('Error in getApplications:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch applications'
    });
  }
};

/**
 * @route   GET /api/applications/:id
 * @desc    Get single application with full details
 * @access  Protected
 */
exports.getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Application.findById(id)
      .populate('candidateId')
      .populate('jobListingId')
      .populate('companyId');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Get assessment results if any
    const assessmentResults = await AssessmentResult.find({
      candidateId: application.candidateId._id,
      jobListingId: application.jobListingId._id
    }).populate('assessmentId', 'title assessmentType timeLimit');

    return res.status(200).json({
      success: true,
      data: {
        application: application,
        assessmentResults: assessmentResults
      }
    });

  } catch (error) {
    console.error('Error in getApplicationById:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch application'
    });
  }
};

/**
 * @route   PUT /api/applications/:id/stage
 * @desc    Update application stage
 * @access  Protected (Employer only)
 */
exports.updateApplicationStage = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const { id } = req.params;
    const { stage, notes } = req.body;

    // Validate stage
    const validStages = [
      'new', 'in_review', 'assessment_sent', 'assessment_completed',
      'interview_scheduled', 'interviewed', 'offer_extended',
      'accepted', 'rejected', 'withdrawn'
    ];

    if (!validStages.includes(stage)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid stage'
      });
    }

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Update stage
    application.stage = stage;
    application.lastActivityAt = new Date();

    // Add to stage history
    application.stageHistory.push({
      stage: stage,
      movedAt: new Date(),
      movedBy: userId,
      notes: notes || ''
    });

    await application.save();

    return res.status(200).json({
      success: true,
      message: 'Application stage updated',
      data: {
        application: application
      }
    });

  } catch (error) {
    console.error('Error in updateApplicationStage:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update application stage'
    });
  }
};

/**
 * @route   PUT /api/applications/:id
 * @desc    Update application (rating, notes, tags, etc.)
 * @access  Protected (Employer only)
 */
exports.updateApplication = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const { id } = req.params;
    const { rating, tags, isStarred, note } = req.body;

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Update fields
    if (rating !== undefined) application.rating = rating;
    if (tags !== undefined) application.tags = tags;
    if (isStarred !== undefined) application.isStarred = isStarred;

    // Add internal note if provided
    if (note) {
      application.internalNotes.push({
        note: note,
        addedBy: userId,
        addedAt: new Date(),
        visibility: 'team'
      });
    }

    application.lastActivityAt = new Date();
    await application.save();

    return res.status(200).json({
      success: true,
      message: 'Application updated',
      data: {
        application: application
      }
    });

  } catch (error) {
    console.error('Error in updateApplication:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update application'
    });
  }
};

/**
 * @route   GET /api/applications/assessments/pending
 * @desc    Get all pending assessments to grade (employer view)
 * @access  Protected (Employer only)
 */
exports.getPendingAssessments = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;

    // Get employer's company
    const teamMember = await TeamMember.findById(userId);
    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    // Find all applications with completed assessments for this company
    const applications = await Application.find({
      companyId: teamMember.company,
      stage: 'assessment_completed'
    })
      .populate('candidateId', 'firstName lastName email profilePicture')
      .populate('jobListingId', 'roleTitle')
      .sort({ lastActivityAt: -1 });

    // Get assessment results for these applications
    const applicationsWithAssessments = await Promise.all(
      applications.map(async (app) => {
        const assessmentResults = await AssessmentResult.find({
          candidateId: app.candidateId._id,
          jobListingId: app.jobListingId._id,
          status: 'completed'
        }).populate('assessmentId', 'title assessmentType timeLimit');

        return {
          application: app,
          assessmentResults: assessmentResults
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: {
        pendingAssessments: applicationsWithAssessments,
        count: applicationsWithAssessments.length
      }
    });

  } catch (error) {
    console.error('Error in getPendingAssessments:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch pending assessments'
    });
  }
};

/**
 * @route   POST /api/applications/:id/grade-assessment
 * @desc    Manually grade an assessment (no AI)
 * @access  Protected (Employer only)
 */
exports.gradeAssessment = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const { id } = req.params;
    const { assessmentResultId, score, feedback, moveToInterview } = req.body;

    // Find assessment result
    const assessmentResult = await AssessmentResult.findById(assessmentResultId);
    if (!assessmentResult) {
      return res.status(404).json({
        success: false,
        message: 'Assessment result not found'
      });
    }

    // Update assessment result with manual grade
    assessmentResult.score = score;
    assessmentResult.results.detailedFeedback = feedback || '';
    assessmentResult.results.evaluatorNotes = `Manually graded by employer`;
    await assessmentResult.save();

    // Update application
    const application = await Application.findById(id);
    if (application && moveToInterview) {
      application.stage = 'interview_scheduled';
      application.lastActivityAt = new Date();
      application.stageHistory.push({
        stage: 'interview_scheduled',
        movedAt: new Date(),
        movedBy: userId,
        notes: `Passed assessment with score ${score}`
      });
      await application.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Assessment graded successfully',
      data: {
        assessmentResult: assessmentResult,
        application: application
      }
    });

  } catch (error) {
    console.error('Error in gradeAssessment:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to grade assessment'
    });
  }
};
