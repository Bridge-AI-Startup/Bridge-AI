const { v4: uuidv4 } = require('uuid');
const Assessment = require('../models/Assessment');
const JobListing = require('../models/JobListing');
const AssessmentResult = require('../models/AssessmentResult');
const TeamMember = require('../models/TeamMember');
const { generateAssessment, generateBatchAssessments, evaluateCodeSubmission } = require('../services/aiService');

/**
 * @route   POST /api/assessments/ai/generate
 * @desc    Generate an assessment using AI based on job listing
 * @access  Protected (Employer only)
 */
exports.aiGenerateAssessment = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const { jobListingId, assessmentType } = req.body;

    console.log('AI Generate Assessment - userId:', userId);

    // Validate required fields
    if (!jobListingId) {
      return res.status(400).json({
        success: false,
        message: 'Job listing ID is required'
      });
    }

    // Validate assessment type if provided
    const validTypes = ['coding', 'technical_quiz', 'case_study'];
    if (assessmentType && !validTypes.includes(assessmentType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid assessment type. Must be coding, technical_quiz, or case_study'
      });
    }

    // Verify employer/team member
    const teamMember = await TeamMember.findById(userId);
    console.log('AI Generate Assessment - teamMember:', teamMember ? 'Found' : 'Not found');

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    // Get job listing
    const jobListing = await JobListing.findById(jobListingId);
    if (!jobListing) {
      return res.status(404).json({
        success: false,
        message: 'Job listing not found'
      });
    }

    // Verify ownership
    if (jobListing.companyId.toString() !== teamMember.companyId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create assessments for this job listing'
      });
    }

    // Extract required skills as array of strings
    const requiredSkills = jobListing.requiredSkills?.map(skill => skill.skillName) || [];

    // Generate assessment using AI
    const assessmentData = await generateAssessment(
      jobListing.roleTitle,
      jobListing.roleDescription,
      requiredSkills,
      jobListing.keyResponsibilities || [],
      assessmentType
    );

    // Return the generated assessment data
    return res.status(200).json({
      success: true,
      message: 'Assessment generated successfully',
      data: {
        assessment: assessmentData,
        jobListingId: jobListingId
      }
    });

  } catch (error) {
    console.error('Error in aiGenerateAssessment:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate assessment'
    });
  }
};

/**
 * @route   POST /api/assessments/ai/generate-batch
 * @desc    Generate 3 distinct assessments using AI (two-phase approach)
 * @access  Protected (Employer only)
 */
exports.aiGenerateBatchAssessments = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const { jobListingId, previousAssessments } = req.body;

    console.log('AI Generate Batch Assessments - userId:', userId);

    // Validate required fields
    if (!jobListingId) {
      return res.status(400).json({
        success: false,
        message: 'Job listing ID is required'
      });
    }

    // Verify employer/team member
    const teamMember = await TeamMember.findById(userId);
    console.log('AI Generate Batch - teamMember:', teamMember ? 'Found' : 'Not found');

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    // Get job listing
    const jobListing = await JobListing.findById(jobListingId);
    if (!jobListing) {
      return res.status(404).json({
        success: false,
        message: 'Job listing not found'
      });
    }

    // Verify ownership
    if (jobListing.companyId.toString() !== teamMember.companyId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create assessments for this job listing'
      });
    }

    // Extract required skills as array of strings
    const requiredSkills = jobListing.requiredSkills?.map(skill => skill.skillName) || [];

    // Generate 3 distinct assessments using AI (two-phase approach)
    // Pass previous assessments if provided (for refresh functionality)
    const assessments = await generateBatchAssessments(
      jobListing.roleTitle,
      jobListing.roleDescription,
      requiredSkills,
      jobListing.keyResponsibilities || [],
      previousAssessments || []
    );

    // Return all 3 generated assessments
    return res.status(200).json({
      success: true,
      message: '3 distinct assessments generated successfully',
      data: {
        assessments: assessments,
        jobListingId: jobListingId
      }
    });

  } catch (error) {
    console.error('Error in aiGenerateBatchAssessments:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate batch assessments'
    });
  }
};

/**
 * @route   POST /api/assessments
 * @desc    Create a new assessment
 * @access  Protected (Employer only)
 */
exports.createAssessment = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const {
      title,
      description,
      assessmentType,
      codingChallenge,
      questions,
      timeLimit,
      totalPoints,
      passingScore,
      jobListingId
    } = req.body;

    // Validate required fields
    if (!title || !assessmentType) {
      return res.status(400).json({
        success: false,
        message: 'Title and assessment type are required'
      });
    }

    // Verify employer/team member
    const teamMember = await TeamMember.findById(userId);
    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    // Create new assessment
    const assessment = new Assessment({
      assessmentId: uuidv4(),
      title,
      description,
      assessmentType,
      codingChallenge,
      questions,
      timeLimit,
      totalPoints,
      passingScore,
      createdBy: teamMember._id,
      isPublic: false
    });

    await assessment.save();

    // If jobListingId provided, link assessment to job listing
    if (jobListingId) {
      const jobListing = await JobListing.findById(jobListingId);
      if (jobListing) {
        // Verify ownership
        if (jobListing.companyId.toString() === teamMember.companyId.toString()) {
          jobListing.assessments.push(assessment._id);
          await jobListing.save();
        }
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Assessment created successfully',
      data: { assessment }
    });

  } catch (error) {
    console.error('Error in createAssessment:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create assessment'
    });
  }
};

/**
 * @route   GET /api/assessments/:id
 * @desc    Get assessment by ID
 * @access  Protected
 */
exports.getAssessmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const assessment = await Assessment.findById(id)
      .populate('createdBy', 'name email');

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: { assessment }
    });

  } catch (error) {
    console.error('Error in getAssessmentById:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch assessment'
    });
  }
};

/**
 * @route   GET /api/assessments/job-listing/:jobListingId
 * @desc    Get all assessments for a job listing
 * @access  Protected (Employer only)
 */
exports.getAssessmentsByJobListing = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const { jobListingId } = req.params;

    // Verify employer/team member
    const teamMember = await TeamMember.findById(userId);
    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    // Get job listing with assessments
    const jobListing = await JobListing.findById(jobListingId)
      .populate({
        path: 'assessments',
        populate: {
          path: 'createdBy',
          select: 'name email'
        }
      });

    if (!jobListing) {
      return res.status(404).json({
        success: false,
        message: 'Job listing not found'
      });
    }

    // Verify ownership
    if (jobListing.companyId.toString() !== teamMember.companyId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access these assessments'
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        assessments: jobListing.assessments || []
      }
    });

  } catch (error) {
    console.error('Error in getAssessmentsByJobListing:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch assessments'
    });
  }
};

/**
 * @route   PUT /api/assessments/:id
 * @desc    Update an assessment
 * @access  Protected (Employer only)
 */
exports.updateAssessment = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const { id } = req.params;
    const updateData = req.body;

    // Verify employer/team member
    const teamMember = await TeamMember.findById(userId);
    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    // Find assessment
    const assessment = await Assessment.findById(id);
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    // Verify ownership (creator can edit)
    if (assessment.createdBy.toString() !== teamMember._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this assessment'
      });
    }

    // Update assessment
    const updatedAssessment = await Assessment.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Assessment updated successfully',
      data: { assessment: updatedAssessment }
    });

  } catch (error) {
    console.error('Error in updateAssessment:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update assessment'
    });
  }
};

/**
 * @route   DELETE /api/assessments/:id
 * @desc    Delete an assessment
 * @access  Protected (Employer only)
 */
exports.deleteAssessment = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const { id } = req.params;

    // Verify employer/team member
    const teamMember = await TeamMember.findById(userId);
    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    // Find assessment
    const assessment = await Assessment.findById(id);
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    // Verify ownership
    if (assessment.createdBy.toString() !== teamMember._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this assessment'
      });
    }

    // Remove from any job listings
    await JobListing.updateMany(
      { assessments: id },
      { $pull: { assessments: id } }
    );

    // Delete assessment
    await Assessment.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Assessment deleted successfully'
    });

  } catch (error) {
    console.error('Error in deleteAssessment:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete assessment'
    });
  }
};

/**
 * @route   POST /api/assessments/results/evaluate
 * @desc    Evaluate a code submission using AI
 * @access  Protected (Employer only)
 */
exports.aiEvaluateSubmission = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const { assessmentResultId } = req.body;

    // Validate required fields
    if (!assessmentResultId) {
      return res.status(400).json({
        success: false,
        message: 'Assessment result ID is required'
      });
    }

    // Verify employer/team member
    const teamMember = await TeamMember.findById(userId);
    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    // Get assessment result
    const assessmentResult = await AssessmentResult.findById(assessmentResultId)
      .populate('assessmentId');

    if (!assessmentResult) {
      return res.status(404).json({
        success: false,
        message: 'Assessment result not found'
      });
    }

    // Get assessment details
    const assessment = assessmentResult.assessmentId;
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    // Ensure it's a coding challenge
    if (assessment.assessmentType !== 'coding') {
      return res.status(400).json({
        success: false,
        message: 'AI evaluation is only available for coding assessments'
      });
    }

    // Get code submission
    const codeSubmission = assessmentResult.results?.codeSubmission;
    if (!codeSubmission) {
      return res.status(400).json({
        success: false,
        message: 'No code submission found'
      });
    }

    // Evaluate using AI
    const evaluation = await evaluateCodeSubmission(
      assessment.codingChallenge.problemStatement,
      codeSubmission,
      assessment.codingChallenge.testCases || [],
      assessment.codingChallenge.requirements || []
    );

    // Update assessment result with AI evaluation
    assessmentResult.score = evaluation.overallScore;
    assessmentResult.results = {
      ...assessmentResult.results,
      correctAnswers: evaluation.testCaseResults?.filter(tc => tc.passed).length || 0,
      totalQuestions: evaluation.testCaseResults?.length || 0,
      detailedFeedback: evaluation.detailedFeedback,
      aiEvaluation: {
        functionalCorrectness: evaluation.functionalCorrectness,
        codeQuality: evaluation.codeQuality,
        problemSolving: evaluation.problemSolving,
        efficiency: evaluation.efficiency,
        strengths: evaluation.strengths,
        weaknesses: evaluation.weaknesses,
        suggestions: evaluation.suggestions,
        estimatedExperienceLevel: evaluation.estimatedExperienceLevel,
        recommendForInterview: evaluation.recommendForInterview,
        testCaseResults: evaluation.testCaseResults
      }
    };

    await assessmentResult.save();

    return res.status(200).json({
      success: true,
      message: 'Submission evaluated successfully',
      data: {
        evaluation: evaluation,
        assessmentResult: assessmentResult
      }
    });

  } catch (error) {
    console.error('Error in aiEvaluateSubmission:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to evaluate submission'
    });
  }
};

/**
 * @route   POST /api/assessments/submit
 * @desc    Submit an assessment (student side)
 * @access  Protected (Student only)
 */
exports.submitAssessment = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const { assessmentId, projectLinks, timeTaken } = req.body;

    console.log('Submit Assessment - userId:', userId, 'assessmentId:', assessmentId);

    // Validate required fields
    if (!assessmentId) {
      return res.status(400).json({
        success: false,
        message: 'Assessment ID is required'
      });
    }

    // Get assessment
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    // Create assessment result
    const assessmentResult = new AssessmentResult({
      assessmentResultId: `result_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      assessmentId: assessment._id,
      candidateId: userId,
      applicationId: req.body.applicationId || null, // Optional - may not have application context
      jobListingId: assessment.jobListingId || null,
      status: 'completed',
      startedAt: new Date(Date.now() - (timeTaken || 0) * 60 * 1000), // Calculate start time
      completedAt: new Date(),
      timeAllowed: assessment.timeLimit,
      timeTaken: timeTaken || 0,
      results: {
        codeSubmission: projectLinks || '',
        detailedFeedback: 'Submitted - awaiting evaluation'
      }
    });

    await assessmentResult.save();

    // TODO: Store uploaded files if any (would need file upload middleware)

    return res.status(201).json({
      success: true,
      message: 'Assessment submitted successfully',
      data: {
        assessmentResult: assessmentResult
      }
    });

  } catch (error) {
    console.error('Error in submitAssessment:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit assessment'
    });
  }
};
