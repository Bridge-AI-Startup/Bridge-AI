const mongoose = require('mongoose');
const {
  User,
  Company,
  TeamMember,
  JobListing,
  Application,
  Interview
} = require('./index');

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect('mongodb://localhost:27017/hiring_platform', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

// Example: Complete company onboarding flow
async function exampleCompanyOnboarding() {
  try {
    // 1. Create a company
    const company = await Company.create({
      companyId: `comp_${Date.now()}`,
      companyName: 'Acme Corp',
      companyWebsite: 'https://acmecorp.com',
      oneSentencePitch: 'Building the future of work',
      industry: 'Technology',
      companySize: '51-200',
      headquarters: {
        city: 'San Francisco',
        state: 'CA',
        country: 'USA'
      }
    });
    console.log('✅ Company created:', company.companyName);

    // 2. Create first team member (admin)
    const admin = await TeamMember.create({
      memberId: `member_${Date.now()}`,
      companyId: company._id,
      email: 'admin@acmecorp.com',
      password: 'secure_password_123', // Will be automatically hashed
      firstName: 'Admin',
      lastName: 'User',
      title: 'Hiring Manager',
      role: 'admin',
      status: 'active',
      emailVerified: true
    });
    console.log('✅ Admin created:', admin.email);

    // 3. Create a job listing
    const job = await JobListing.create({
      listingId: `job_${Date.now()}`,
      companyId: company._id,
      roleTitle: 'Software Engineering Intern',
      department: 'Engineering',
      roleDescription: 'We are looking for a talented software engineering intern...',
      requiredSkills: [
        { skillName: 'JavaScript', proficiencyLevel: 'intermediate' },
        { skillName: 'React', proficiencyLevel: 'beginner' }
      ],
      locationType: 'hybrid',
      hoursPerWeek: 40,
      compensation: {
        type: 'paid',
        salary: {
          min: 25,
          max: 35,
          currency: 'USD',
          period: 'hourly'
        }
      },
      status: 'active',
      postedAt: new Date(),
      createdBy: admin._id
    });
    console.log('✅ Job listing created:', job.roleTitle);

    return { company, admin, job };
  } catch (error) {
    console.error('❌ Error in company onboarding:', error);
    throw error;
  }
}

// Example: Student application flow
async function exampleStudentApplication(jobId) {
  try {
    // 1. Create a student user
    const student = await User.create({
      uid: `user_${Date.now()}`,
      name: 'Jane Smith',
      email: 'jane@university.edu',
      password: 'secure_password_456', // Will be automatically hashed
      university: 'Stanford University',
      linkedinUrl: 'https://linkedin.com/in/janesmith',
      githubUrl: 'https://github.com/janesmith',
      jobPreferences: {
        workStyle: 'hybrid',
        industries: ['Technology', 'AI/ML']
      }
    });
    console.log('✅ Student created:', student.name);

    // 2. Submit application
    const application = await Application.create({
      applicationId: `app_${Date.now()}`,
      candidateId: student._id,
      jobListingId: jobId,
      companyId: (await JobListing.findById(jobId)).companyId,
      resume: {
        fileName: 'jane_smith_resume.pdf',
        fileUrl: 'https://storage.example.com/resumes/jane_smith.pdf',
        s3Key: 'resumes/jane_smith.pdf'
      },
      coverLetter: 'I am excited to apply for this position...',
      portfolio: {
        githubUrl: 'https://github.com/janesmith',
        linkedinUrl: 'https://linkedin.com/in/janesmith'
      },
      stage: 'new',
      appliedAt: new Date(),
      source: 'direct_apply',
      matchScore: 85
    });
    console.log('✅ Application submitted:', application.applicationId);

    return { student, application };
  } catch (error) {
    console.error('❌ Error in student application:', error);
    throw error;
  }
}

// Example: Moving application through pipeline
async function exampleApplicationPipeline(applicationId, teamMemberId) {
  try {
    // Move to "in_review" stage
    const application = await Application.findByIdAndUpdate(
      applicationId,
      {
        stage: 'in_review',
        lastActivityAt: new Date(),
        $push: {
          stageHistory: {
            stage: 'in_review',
            movedAt: new Date(),
            movedBy: teamMemberId,
            notes: 'Moving to review based on strong resume'
          },
          internalNotes: {
            note: 'Candidate has great projects on GitHub',
            addedBy: teamMemberId,
            addedAt: new Date(),
            visibility: 'team'
          }
        }
      },
      { new: true }
    );
    console.log('✅ Application moved to:', application.stage);

    return application;
  } catch (error) {
    console.error('❌ Error updating application:', error);
    throw error;
  }
}

// Example: Schedule an interview
async function exampleScheduleInterview(applicationId) {
  try {
    const application = await Application.findById(applicationId)
      .populate('candidateId')
      .populate('jobListingId')
      .populate('companyId');

    const interview = await Interview.create({
      interviewId: `interview_${Date.now()}`,
      applicationId: application._id,
      candidateId: application.candidateId._id,
      jobListingId: application.jobListingId._id,
      companyId: application.companyId._id,
      scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      duration: 60,
      timezone: 'America/Los_Angeles',
      type: 'video',
      locationType: 'virtual',
      meetingLink: 'https://zoom.us/j/123456789',
      status: 'scheduled',
      interviewers: [
        {
          memberId: application.jobListingId.createdBy,
          isLeadInterviewer: true
        }
      ]
    });
    console.log('✅ Interview scheduled for:', interview.scheduledDate);

    // Update application stage
    await Application.findByIdAndUpdate(applicationId, {
      stage: 'interview_scheduled',
      lastActivityAt: new Date()
    });

    return interview;
  } catch (error) {
    console.error('❌ Error scheduling interview:', error);
    throw error;
  }
}

// Example: Query patterns
async function exampleQueries(companyId) {
  try {
    console.log('\n📊 Running example queries...\n');

    // Get all active jobs
    const activeJobs = await JobListing.find({
      companyId: companyId,
      status: 'active'
    }).sort({ postedAt: -1 });
    console.log(`✅ Found ${activeJobs.length} active jobs`);

    // Get applications with high match scores
    const topApplications = await Application.find({
      companyId: companyId,
      matchScore: { $gte: 80 }
    })
      .populate('candidateId', 'name email university')
      .populate('jobListingId', 'roleTitle')
      .sort({ matchScore: -1 })
      .limit(5);
    console.log(`✅ Found ${topApplications.length} top-matched applications`);

    // Get team members
    const team = await TeamMember.find({
      companyId: companyId,
      status: 'active'
    });
    console.log(`✅ Found ${team.length} active team members`);

    // Aggregate application stats by stage
    const stats = await Application.aggregate([
      { $match: { companyId: mongoose.Types.ObjectId(companyId) } },
      {
        $group: {
          _id: '$stage',
          count: { $sum: 1 },
          avgMatchScore: { $avg: '$matchScore' }
        }
      },
      { $sort: { count: -1 } }
    ]);
    console.log('✅ Application stats by stage:', stats);

    return { activeJobs, topApplications, team, stats };
  } catch (error) {
    console.error('❌ Error running queries:', error);
    throw error;
  }
}

// Main function to run all examples
async function main() {
  await connectDB();

  console.log('\n🚀 Starting example flows...\n');

  // 1. Company onboarding
  const { company, admin, job } = await exampleCompanyOnboarding();

  // 2. Student applies
  const { student, application } = await exampleStudentApplication(job._id);

  // 3. Move application through pipeline
  await exampleApplicationPipeline(application._id, admin._id);

  // 4. Schedule interview
  await exampleScheduleInterview(application._id);

  // 5. Run various queries
  await exampleQueries(company._id);

  console.log('\n✅ All examples completed successfully!\n');

  // Close connection
  await mongoose.connection.close();
  console.log('👋 MongoDB connection closed');
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

module.exports = {
  connectDB,
  exampleCompanyOnboarding,
  exampleStudentApplication,
  exampleApplicationPipeline,
  exampleScheduleInterview,
  exampleQueries
};
