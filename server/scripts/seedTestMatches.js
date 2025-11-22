const mongoose = require('mongoose');
require('dotenv').config();

const Match = require('../models/Match');
const User = require('../models/User');
const Company = require('../models/Company');
const JobListing = require('../models/JobListing');

async function seedTestMatches() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bridge-ai', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Fetch all students (role could be 'student' or 'user')
    const students = await User.find({ role: { $in: ['student', 'user'] } }).limit(20);
    console.log(`Found ${students.length} students`);

    // Fetch all job listings with company populated
    const jobListings = await JobListing.find({}).populate('companyId').limit(20);
    console.log(`Found ${jobListings.length} job listings`);

    if (students.length === 0 || jobListings.length === 0) {
      console.log('Not enough students or job listings to create test matches');
      process.exit(0);
    }

    // Delete existing matches
    console.log('Clearing existing matches...');
    await Match.deleteMany({});

    const matches = [];
    let matchCount = 0;

    // Create matches for EVERY student-job combination (complete matrix)
    console.log(`Creating matches for all ${students.length} students × ${jobListings.length} jobs...`);

    for (let i = 0; i < students.length; i++) {
      const student = students[i];

      // Match this student with EVERY job listing
      for (let j = 0; j < jobListings.length; j++) {
        const job = jobListings[j];

        if (!job.companyId) continue;

        // Generate varying scores to ensure good distribution
        // Use a combination of student index and job index for variety
        const baseScore = 30 + ((i + j * 3) % 7) * 10; // Cycles: 30, 40, 50, 60, 70, 80, 90
        const randomVariation = Math.random() * 15 - 7.5; // ±7.5
        const overallScore = Math.min(100, Math.max(0, baseScore + randomVariation));

        // Category scores vary around overall score
        const skillsMatch = Math.min(100, Math.max(0, overallScore + (Math.random() * 20 - 10)));
        const experienceMatch = Math.min(100, Math.max(0, overallScore + (Math.random() * 20 - 10)));
        const educationMatch = Math.min(100, Math.max(0, overallScore + (Math.random() * 20 - 10)));
        const culturalFit = Math.min(100, Math.max(0, overallScore + (Math.random() * 20 - 10)));
        const locationMatch = Math.min(100, Math.max(0, overallScore + (Math.random() * 20 - 10)));
        const compensationMatch = Math.min(100, Math.max(0, overallScore + (Math.random() * 20 - 10)));

        matches.push({
          studentId: student._id,
          companyId: job.companyId._id,
          jobListingId: job._id,
          overallScore: Math.round(overallScore * 10) / 10, // Round to 1 decimal
          matchFactors: {
            skillsMatch: Math.round(skillsMatch * 10) / 10,
            experienceMatch: Math.round(experienceMatch * 10) / 10,
            educationMatch: Math.round(educationMatch * 10) / 10,
            culturalFit: Math.round(culturalFit * 10) / 10,
            locationMatch: Math.round(locationMatch * 10) / 10,
            compensationMatch: Math.round(compensationMatch * 10) / 10
          },
          status: 'active',
          matchType: 'manual',
          createdBy: 'seed-script',
          matchReason: 'Test data - complete matrix with varying scores',
          visibleToStudent: false,
          visibleToEmployer: false
        });

        matchCount++;
      }
    }

    // Insert all matches
    console.log(`Creating ${matches.length} test matches...`);
    await Match.insertMany(matches);

    // Show statistics
    const scoreRanges = {
      'Excellent (80-100)': 0,
      'Good (60-79)': 0,
      'Fair (40-59)': 0,
      'Poor (0-39)': 0
    };

    matches.forEach(m => {
      if (m.overallScore >= 80) scoreRanges['Excellent (80-100)']++;
      else if (m.overallScore >= 60) scoreRanges['Good (60-79)']++;
      else if (m.overallScore >= 40) scoreRanges['Fair (40-59)']++;
      else scoreRanges['Poor (0-39)']++;
    });

    console.log('\n✅ Successfully created test matches!');
    console.log('\nScore Distribution:');
    Object.entries(scoreRanges).forEach(([range, count]) => {
      console.log(`  ${range}: ${count} matches`);
    });

    console.log(`\nTotal: ${matches.length} matches created`);
    console.log(`Students matched: ${students.length}`);
    console.log(`Jobs used: ${jobListings.length}`);

    const avgScore = matches.reduce((sum, m) => sum + m.overallScore, 0) / matches.length;
    console.log(`Average overall score: ${avgScore.toFixed(1)}`);

    console.log('\n💡 Note: All matches are created with visibleToStudent=false and visibleToEmployer=false');
    console.log('   Use the Admin Matching page to edit scores, then Send Matches to publish them.');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding test matches:', error);
    process.exit(1);
  }
}

seedTestMatches();
