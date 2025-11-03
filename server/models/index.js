// Refined Models - Using References for Better Data Consistency
// Export all refined models

const User = require('./User.refined');
const Company = require('./Company');
const JobListing = require('./JobListing');
const Application = require('./Application.refined');
const Assessment = require('./Assessment');
const Interview = require('./Interview.refined');

module.exports = {
  User,
  Company,
  JobListing,
  Application,
  Assessment,
  Interview
};

// Usage Examples:
// const { User, Application } = require('./models');
// 
// // Create user
// const user = await User.create({...});
// 
// // Create application with reference
// const app = await Application.create({
//   candidateId: user._id,
//   jobListingId: jobId,
//   ...
// });
// 
// // Get application with candidate data
// const fullApp = await Application.findById(appId)
//   .populate('candidateId', 'name email resume projects skills');
