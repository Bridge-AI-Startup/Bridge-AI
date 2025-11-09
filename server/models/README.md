# MongoDB Schemas for Hiring Platform

## 📦 Installation

```bash
npm install mongoose
```

## 🚀 Quick Start

### 1. Connect to MongoDB

```javascript
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/your-database-name', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));
```

### 2. Import Schemas

```javascript
// Import all schemas
const { User, Company, TeamMember, JobListing, Application } = require('./schemas');

// Or import individually
const User = require('./schemas/User');
```

## 📊 Schema Overview

### Core Collections

1. **User** - Students/candidates looking for opportunities
2. **Company** - Company profiles (no authentication)
3. **TeamMember** - Company employees with authentication (admin/member roles)
4. **JobListing** - Job postings created by companies
5. **Application** - Candidate applications to jobs
6. **Assessment** - Assessment templates (coding challenges, quizzes)
7. **AssessmentResult** - Individual assessment attempts/results
8. **Interview** - Scheduled interviews with feedback
9. **Offer** - Job offers extended to candidates
10. **Communication** - Communication logs (emails, messages, notes)

## 💡 Usage Examples

### Create a User (Student/Candidate)

```javascript
const User = require('./schemas/User');

const newUser = await User.create({
  uid: 'user_123',
  name: 'John Doe',
  email: 'john@example.com',
  password: 'hashed_password', // Remember to hash passwords!
  university: 'Stanford University',
  linkedinUrl: 'https://linkedin.com/in/johndoe',
  emailVerified: false
});
```

### Create a Company

```javascript
const Company = require('./schemas/Company');

const newCompany = await Company.create({
  companyId: 'comp_456',
  companyName: 'TechCorp',
  companyWebsite: 'https://techcorp.com',
  oneSentencePitch: 'Building the future of AI',
  industry: 'Technology',
  companySize: '51-200',
  headquarters: {
    city: 'San Francisco',
    state: 'CA',
    country: 'USA',
    timezone: 'America/Los_Angeles'
  }
});
```

### Create a Team Member (with authentication)

```javascript
const TeamMember = require('./schemas/TeamMember');

const newTeamMember = await TeamMember.create({
  uid: 'firebase-uid-or-generated', // Firebase UID or generated unique ID
  companyId: newCompany._id,
  email: 'sarah@techcorp.com',
  password: 'hashed_password', // Optional - not needed for Firebase users
  firstName: 'Sarah',
  lastName: 'Johnson',
  title: 'Recruiting Manager',
  companyRole: 'admin', // 'admin' or 'member' (company-level role)
  status: 'active',
  emailVerified: true
});
```

### Create a Job Listing

```javascript
const JobListing = require('./schemas/JobListing');

const newJob = await JobListing.create({
  listingId: 'job_101',
  companyId: newCompany._id,
  roleTitle: 'Software Engineering Intern',
  department: 'Engineering',
  roleDescription: 'Join our team to build amazing products...',
  keyResponsibilities: [
    'Write clean, maintainable code',
    'Collaborate with senior engineers',
    'Participate in code reviews'
  ],
  requiredSkills: [
    { skillName: 'JavaScript', proficiencyLevel: 'intermediate' },
    { skillName: 'React', proficiencyLevel: 'beginner' }
  ],
  locationType: 'hybrid',
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
  createdBy: newTeamMember._id
});
```

### Create an Application

```javascript
const Application = require('./schemas/Application');

const newApplication = await Application.create({
  applicationId: 'app_202',
  candidateId: newUser._id,
  jobListingId: newJob._id,
  companyId: newCompany._id,
  resume: {
    fileName: 'john_doe_resume.pdf',
    fileUrl: 'https://s3.amazonaws.com/bucket/resumes/john_doe.pdf',
    s3Key: 'resumes/john_doe.pdf'
  },
  coverLetter: 'I am very interested in this position...',
  stage: 'new',
  appliedAt: new Date(),
  source: 'direct_apply'
});
```

### Query Examples

```javascript
// Find all active jobs for a company
const activeJobs = await JobListing.find({
  companyId: companyId,
  status: 'active'
}).sort({ postedAt: -1 });

// Find all applications for a job
const applications = await Application.find({
  jobListingId: jobId
})
.populate('candidateId', 'name email university')
.sort({ appliedAt: -1 });

// Find applications with high match scores
const topMatches = await Application.find({
  jobListingId: jobId,
  matchScore: { $gte: 80 }
})
.sort({ matchScore: -1 })
.limit(10);

// Get company team members
const teamMembers = await TeamMember.find({
  companyId: companyId,
  status: 'active'
});

// Find interviews for a specific date
const todayInterviews = await Interview.find({
  companyId: companyId,
  scheduledDate: {
    $gte: new Date().setHours(0,0,0,0),
    $lt: new Date().setHours(23,59,59,999)
  },
  status: 'scheduled'
}).populate('candidateId', 'name email');
```

### Update Examples

```javascript
// Update application stage
await Application.findByIdAndUpdate(applicationId, {
  stage: 'interview_scheduled',
  $push: {
    stageHistory: {
      stage: 'interview_scheduled',
      movedAt: new Date(),
      movedBy: teamMemberId,
      notes: 'Candidate looks promising'
    }
  },
  lastActivityAt: new Date()
});

// Add internal note to application
await Application.findByIdAndUpdate(applicationId, {
  $push: {
    internalNotes: {
      note: 'Great technical background',
      addedBy: teamMemberId,
      addedAt: new Date(),
      visibility: 'team'
    }
  }
});

// Update team member last login
await TeamMember.findByIdAndUpdate(teamMemberId, {
  lastLoginAt: new Date(),
  lastActiveAt: new Date()
});
```

### Aggregation Examples

```javascript
// Get application stats by stage for a job
const stats = await Application.aggregate([
  { $match: { jobListingId: mongoose.Types.ObjectId(jobId) } },
  { $group: {
    _id: '$stage',
    count: { $sum: 1 },
    avgMatchScore: { $avg: '$matchScore' }
  }},
  { $sort: { count: -1 } }
]);

// Get top candidates across all jobs
const topCandidates = await Application.aggregate([
  { $match: { companyId: mongoose.Types.ObjectId(companyId) } },
  { $group: {
    _id: '$candidateId',
    avgMatchScore: { $avg: '$matchScore' },
    totalApplications: { $sum: 1 }
  }},
  { $sort: { avgMatchScore: -1 } },
  { $limit: 10 },
  { $lookup: {
    from: 'users',
    localField: '_id',
    foreignField: '_id',
    as: 'candidate'
  }},
  { $unwind: '$candidate' }
]);
```

## 🔒 Security Best Practices

1. **Always hash passwords** before storing:
```javascript
const bcrypt = require('bcrypt');
const hashedPassword = await bcrypt.hash(password, 10);
```

2. **Validate input** before saving to database
3. **Use environment variables** for sensitive data
4. **Implement proper authentication** middleware
5. **Never expose password fields** in API responses:
```javascript
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};
```

## 🎨 Customization Guide

### Adding New Fields

Simply add fields to any schema:

```javascript
// In User.js
const userSchema = new mongoose.Schema({
  // ... existing fields
  phoneNumber: String, // Add this
  graduationYear: Number // Add this
}, {
  timestamps: true
});
```

### Adding New Enums

```javascript
// In Application.js
stage: {
  type: String,
  enum: [
    'new',
    'in_review',
    'phone_screen', // Add this
    'technical_interview', // Add this
    // ... other stages
  ]
}
```

### Creating Custom Methods

```javascript
// In User.js
userSchema.methods.getFullName = function() {
  return this.name;
};

// Usage
const user = await User.findById(userId);
console.log(user.getFullName());
```

### Creating Static Methods

```javascript
// In Application.js
applicationSchema.statics.findByStage = function(jobId, stage) {
  return this.find({ jobListingId: jobId, stage: stage });
};

// Usage
const newApps = await Application.findByStage(jobId, 'new');
```

## 🏗️ Schema Relationships

```
Company (1) ──── (many) TeamMember
Company (1) ──── (many) JobListing
Company (1) ──── (many) Application

TeamMember (1) ──── (many) JobListing (created by)
TeamMember (many) ──── (many) Interview (interviewers)

JobListing (1) ──── (many) Application
JobListing (many) ──── (many) Assessment (references)

User (1) ──── (many) Application
User (1) ──── (many) AssessmentResult

Application (1) ──── (1) Offer
Application (1) ──── (many) Interview
Application (1) ──── (many) Communication
Application (1) ──── (many) AssessmentResult

Assessment (1) ──── (many) AssessmentResult
```

## 📝 Notes

- All schemas use `timestamps: true` for automatic `createdAt` and `updatedAt` fields
- Indexes are set up for common queries - add more as needed
- File uploads (resume, photos, etc.) should store S3/cloud URLs, not binary data
- The `CompanyId` in TeamMember, JobListing, Application, etc. creates the relationship
- Use `.populate()` to join data when needed
- Consider adding pagination for large result sets

## 🔧 Maintenance

### Adding Indexes

If you need to add indexes after deployment:

```javascript
// One-time script
await User.collection.createIndex({ university: 1 });
await Application.collection.createIndex({ appliedAt: -1 });
```

### Schema Migrations

For schema changes in production:
1. Add new optional fields first
2. Run migration script to populate existing documents
3. Make fields required if needed

## 🚀 Next Steps

1. Set up authentication middleware
2. Create API routes for each schema
3. Add validation middleware
4. Implement file upload handling (S3/cloud storage)
5. Set up email notifications
6. Add search functionality (consider text indexes or Elasticsearch)
7. Implement real-time updates (Socket.io)

## 📚 Additional Resources

- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB Best Practices](https://docs.mongodb.com/manual/administration/production-notes/)
- [Schema Design Patterns](https://www.mongodb.com/blog/post/building-with-patterns-a-summary)
