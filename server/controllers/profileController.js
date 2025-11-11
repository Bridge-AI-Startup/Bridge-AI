const User = require('../models/User');
const TeamMember = require('../models/TeamMember');
const Company = require('../models/Company');

/**
 * @desc    Get student profile data
 * @route   GET /api/profile/student
 * @access  Protected (requires JWT - student role)
 */
const getStudentProfile = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;

    const user = await User.findById(userId).select('-__v');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }

    // Calculate profile completion
    const completionSections = {
      resume: !!(user.resume && user.resume.fileUrl),
      projects: !!(user.projects && user.projects.length > 0),
      preferences: !!(
        user.jobPreferences &&
        user.jobPreferences.industries &&
        user.jobPreferences.industries.length > 0
      )
    };

    const completedCount = Object.values(completionSections).filter(Boolean).length;
    const completionPercentage = Math.round((completedCount / 3) * 100);

    res.status(200).json({
      success: true,
      data: {
        user: user.toJSON(),
        completion: {
          sections: completionSections,
          completedCount,
          completionPercentage
        }
      }
    });
  } catch (error) {
    console.error('Get student profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student profile',
      error: error.message
    });
  }
};

/**
 * @desc    Update student profile data
 * @route   PUT /api/profile/student
 * @access  Protected (requires JWT - student role)
 */
const updateStudentProfile = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const { name, university, major, gradYear, linkedinUrl, githubUrl } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }

    // Update fields if provided
    if (name !== undefined) user.name = name;
    if (university !== undefined) user.university = university;
    if (major !== undefined) user.major = major;
    if (gradYear !== undefined) user.gradYear = gradYear;
    if (linkedinUrl !== undefined) user.linkedinUrl = linkedinUrl;
    if (githubUrl !== undefined) user.githubUrl = githubUrl;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: user.toJSON()
      }
    });
  } catch (error) {
    console.error('Update student profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update student profile',
      error: error.message
    });
  }
};

/**
 * @desc    Get employer profile data (company + team member info)
 * @route   GET /api/profile/employer
 * @access  Protected (requires JWT - employer role)
 */
const getEmployerProfile = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;

    const teamMember = await TeamMember.findById(userId)
      .populate('companyId')
      .select('-password -__v');

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Employer profile not found'
      });
    }

    const company = teamMember.companyId;

    res.status(200).json({
      success: true,
      data: {
        teamMember: {
          _id: teamMember._id,
          firstName: teamMember.firstName,
          lastName: teamMember.lastName,
          email: teamMember.email,
          companyRole: teamMember.companyRole
        },
        company: company ? company.toJSON() : null
      }
    });
  } catch (error) {
    console.error('Get employer profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employer profile',
      error: error.message
    });
  }
};

/**
 * @desc    Update employer profile (team member info)
 * @route   PUT /api/profile/employer
 * @access  Protected (requires JWT - employer role)
 */
const updateEmployerProfile = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const { firstName, lastName, companyRole } = req.body;

    const teamMember = await TeamMember.findById(userId);

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Employer profile not found'
      });
    }

    // Update fields if provided
    if (firstName !== undefined) teamMember.firstName = firstName;
    if (lastName !== undefined) teamMember.lastName = lastName;
    if (companyRole !== undefined) teamMember.companyRole = companyRole;

    await teamMember.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        teamMember: {
          _id: teamMember._id,
          firstName: teamMember.firstName,
          lastName: teamMember.lastName,
          email: teamMember.email,
          companyRole: teamMember.companyRole
        }
      }
    });
  } catch (error) {
    console.error('Update employer profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update employer profile',
      error: error.message
    });
  }
};

module.exports = {
  getStudentProfile,
  updateStudentProfile,
  getEmployerProfile,
  updateEmployerProfile
};
