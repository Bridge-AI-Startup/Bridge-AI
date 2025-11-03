# Refined Schema Usage Guide - References & Population

This guide shows how to use the refined schemas that leverage MongoDB references instead of duplicating data.

## Key Improvements

### ✅ Single Source of Truth
- Resume data lives ONLY in User model
- Application references User for candidate info
- Interview references Application (which references User)

### ✅ Data Consistency
- Update user's resume once, reflects everywhere
- No duplicate/stale data across documents
- Easier maintenance and updates

### ✅ Normalized Design
- Follows MongoDB best practices
- Minimal denormalization (only for performance)
- Clear data ownership

---

## 1. User Model - Complete Profile

The User model now contains ALL candidate information:

```javascript
const User = require('./models/User.refined');

// Create user with complete profile
const newUser = await User.create({
  uid: 'user_123',
  name: 'John Doe',
  email: 'john@stanford.edu',
  
  profile: {
    university: 'Stanford University',
    graduationDate: new Date('2025-06-15'),
    major: 'Computer Science',
    gpa: 3.8,
    location: {
      city: 'Palo Alto',
      state: 'CA',
      country: 'USA'
    }
  },
  
  socialLinks: {
    linkedin: 'https://linkedin.com/in/johndoe',
    github: 'https://github.com/johndoe',
    portfolio: 'https://johndoe.dev'
  },
  
  resume: {
    fileName: 'john_doe_resume.pdf',
    fileUrl: 'https://s3.amazonaws.com/.../resume.pdf',
    fileSize: 245760,
    mimeType: 'application/pdf',
    uploadedAt: new Date(),
    s3Key: 'resumes/user_123/resume.pdf'
  },
  
  skills: [
    { name: 'React.js', category: 'framework', proficiency: 'advanced' },
    { name: 'Node.js', category: 'programming', proficiency: 'intermediate' },
    { name: 'Python', category: 'programming', proficiency: 'advanced' }
  ],
  
  projects: [{
    title: 'E-commerce Platform',
    description: 'Full-stack online store',
    technologies: ['React', 'Node.js', 'MongoDB'],
    githubUrl: 'https://github.com/johndoe/ecommerce',
    highlights: [
      'Built scalable REST API',
      'Implemented payment processing'
    ]
  }]
});

// Calculate profile completion
const completionScore = newUser.calculateProfileCompletion();
await newUser.save();
```

---

## 2. Application Model - References User

Applications now reference the User model instead of duplicating data:

```javascript
const Application = require('./models/Application.refined');

// Create application - only store application-specific data
const newApplication = await Application.create({
  applicationId: 'app_123',
  
  // REFERENCES - Not duplicating data
  candidateId: userId,
  jobListingId: jobId,
  companyId: companyId,
  
  // Minimal denormalization for list views
  candidateName: 'John Doe',
  candidateEmail: 'john@stanford.edu',
  
  // Application-specific materials (if different from profile)
  applicationMaterials: {
    coverLetter: 'I am excited to apply...',
    // Only include customResume if they submit a different version
    customResume: null
  },
  
  customResponses: [{
    questionId: questionId,
    question: 'Why do you want to work here?',
    answer: 'I am passionate about...'
  }],
  
  matchScore: 94,
  matchBreakdown: {
    technicalSkills: 95,
    experienceLevel: 92,
    cultureFit: 84,
    projectCompatibility: 98
  },
  
  stage: 'new',
  source: 'direct_apply'
});

// ✅ Get full candidate info WITH populated data
const fullInfo = await Application.findById(applicationId)
  .populate({
    path: 'candidateId',
    select: 'name email profile resume socialLinks projects skills experience'
  })
  .populate('jobListingId')
  .exec();

console.log(fullInfo.candidateId.resume); // Resume from User model
console.log(fullInfo.candidateId.projects); // Projects from User model
console.log(fullInfo.candidateId.skills); // Skills from User model

// ✅ Or use the built-in method
const candidateData = await newApplication.getFullCandidateInfo();
console.log(candidateData.resume); // Returns custom resume OR user's resume
console.log(candidateData.projects); // User's projects
```

---

## 3. Getting Candidate Resume

**OLD WAY (Duplicated):**
```javascript
// ❌ Resume stored in both User AND Application
const application = await Application.findById(appId);
const resume = application.resume; // Duplicate data!
```

**NEW WAY (Referenced):**
```javascript
// ✅ Resume stored ONLY in User, referenced by Application
const application = await Application.findById(appId)
  .populate('candidateId', 'resume');

const resume = application.applicationMaterials.customResume || 
               application.candidateId.resume;
// Uses custom resume if provided, otherwise uses profile resume
```

---

## 4. Interview Model - References Application

Interviews reference Application (which references User):

```javascript
const Interview = require('./models/Interview.refined');

// Create interview - flows from Application
const newInterview = await Interview.create({
  interviewId: 'int_123',
  
  // Primary reference - everything flows from here
  applicationId: applicationId,
  
  // Denormalized for quick queries
  candidateId: candidateId,
  jobListingId: jobId,
  companyId: companyId,
  candidateName: 'John Doe',
  roleName: 'Full-Stack Engineer Intern',
  
  scheduledDate: new Date('2025-12-15T14:00:00Z'),
  duration: 60,
  type: 'technical',
  
  location: {
    type: 'virtual',
    meetingLink: 'https://zoom.us/j/123'
  },
  
  interviewers: [{
    memberId: interviewerId,
    name: 'Sarah Johnson',
    email: 'sarah@company.com',
    role: 'Senior Engineer',
    isLeadInterviewer: true
  }]
});

// ✅ Get full interview details with all related data
const fullInterview = await Interview.findById(interviewId)
  .populate({
    path: 'applicationId',
    populate: [
      {
        path: 'candidateId',
        select: 'name email profile resume socialLinks projects skills'
      },
      {
        path: 'jobListingId',
        select: 'roleTitle department requiredSkills'
      }
    ]
  })
  .exec();

// Access nested data
console.log(fullInterview.applicationId.candidateId.resume); // User's resume
console.log(fullInterview.applicationId.candidateId.projects); // User's projects
console.log(fullInterview.applicationId.jobListingId.roleTitle); // Job title
console.log(fullInterview.applicationId.matchScore); // Match score

// ✅ Or use the built-in method
const detailedInterview = await newInterview.getFullDetails();
```

---

## 5. Complex Queries with Population

### Get Application with Full Candidate Profile

```javascript
const application = await Application.findById(appId)
  .populate({
    path: 'candidateId',
    select: 'name email profile resume socialLinks projects skills experience education'
  })
  .populate({
    path: 'jobListingId',
    select: 'roleTitle department requiredSkills workDetails compensation'
  })
  .populate({
    path: 'interviews',
    populate: {
      path: 'interviewers.memberId',
      select: 'name email'
    }
  })
  .exec();

// Now you have everything
const candidateResume = application.candidateId.resume;
const candidateProjects = application.candidateId.projects;
const candidateSkills = application.candidateId.skills;
const jobDetails = application.jobListingId;
const interviews = application.interviews;
```

### Get All Applications for a Job with Candidate Data

```javascript
const applications = await Application.find({ jobListingId: jobId })
  .populate('candidateId', 'name email profile resume skills')
  .sort({ matchScore: -1 })
  .limit(20)
  .exec();

// Use in list view
applications.forEach(app => {
  console.log({
    name: app.candidateId.name,
    email: app.candidateId.email,
    university: app.candidateId.profile.university,
    hasResume: !!app.candidateId.resume?.fileUrl,
    matchScore: app.matchScore
  });
});
```

### Get Candidate's All Applications

```javascript
const myApplications = await Application.find({ candidateId: userId })
  .populate('jobListingId', 'roleTitle companyName workDetails')
  .populate('companyId', 'companyName companyLogo')
  .sort({ appliedAt: -1 })
  .exec();

// Use in candidate dashboard
myApplications.forEach(app => {
  console.log({
    company: app.companyId.companyName,
    role: app.jobListingId.roleTitle,
    stage: app.stage,
    appliedAt: app.appliedAt,
    matchScore: app.matchScore
  });
});
```

---

## 6. Updating User Data (Single Source of Truth)

```javascript
// ✅ Update resume - automatically reflects in all applications
await User.findByIdAndUpdate(userId, {
  'resume.fileUrl': 'https://s3.amazonaws.com/.../new_resume.pdf',
  'resume.fileName': 'updated_resume.pdf',
  'resume.uploadedAt': new Date()
});

// All applications will show the updated resume when populated!

// ✅ Add new project
await User.findByIdAndUpdate(userId, {
  $push: {
    projects: {
      title: 'New Project',
      description: 'Latest work',
      technologies: ['React', 'TypeScript']
    }
  }
});

// ✅ Update skills
await User.findByIdAndUpdate(userId, {
  $push: {
    skills: {
      name: 'TypeScript',
      category: 'programming',
      proficiency: 'intermediate'
    }
  }
});
```

---

## 7. Denormalized Fields (Performance)

Some fields ARE duplicated for performance:

```javascript
// These are denormalized for quick list views
{
  candidateName: 'John Doe',      // Quick display without populate
  candidateEmail: 'john@email',   // For notifications
  roleName: 'Engineer Intern'     // For interview list view
}
```

**Update denormalized fields when source changes:**

```javascript
// When user updates name
await User.findByIdAndUpdate(userId, { name: 'John Smith' });

// Update denormalized fields in related documents
await Application.updateMany(
  { candidateId: userId },
  { candidateName: 'John Smith' }
);

await Interview.updateMany(
  { candidateId: userId },
  { candidateName: 'John Smith' }
);
```

**Pro Tip:** Use MongoDB change streams or post-save hooks to auto-update:

```javascript
// In User model
userSchema.post('save', async function(doc) {
  if (this.isModified('name')) {
    await mongoose.model('Application').updateMany(
      { candidateId: doc._id },
      { candidateName: doc.name }
    );
  }
});
```

---

## 8. Performance Optimization

### Lean Queries (When You Don't Need Methods)

```javascript
// ❌ Slower - full Mongoose document
const applications = await Application.find({ jobListingId: jobId })
  .populate('candidateId');

// ✅ Faster - plain JavaScript object
const applications = await Application.find({ jobListingId: jobId })
  .populate('candidateId', 'name email resume')
  .lean()
  .exec();
```

### Select Only Needed Fields

```javascript
// ❌ Returns everything
const application = await Application.findById(appId)
  .populate('candidateId');

// ✅ Returns only what you need
const application = await Application.findById(appId)
  .select('candidateId matchScore stage')
  .populate('candidateId', 'name email resume');
```

### Virtual Populate for Reverse Relationships

```javascript
// In User model, add virtual for applications
userSchema.virtual('applications', {
  ref: 'Application',
  localField: '_id',
  foreignField: 'candidateId'
});

// Use it
const user = await User.findById(userId)
  .populate('applications');

console.log(user.applications); // All user's applications
```

---

## 9. Best Practices Summary

### ✅ DO:
- Store data in ONE place (single source of truth)
- Use references for related data
- Populate when you need related data
- Denormalize ONLY for critical performance (names, IDs)
- Update denormalized fields when source changes
- Use indexes on reference fields

### ❌ DON'T:
- Duplicate large objects (resume, projects, etc.)
- Populate everything by default
- Forget to update denormalized fields
- Over-denormalize (balance with consistency)

---

## 10. Migration from Old Schema

If you have existing data with duplicated fields:

```javascript
// Script to migrate existing applications
const applications = await Application.find({});

for (const app of applications) {
  // Keep only references, remove duplicated data
  app.candidateUniversity = undefined;
  app.candidateLocation = undefined;
  app.resume = undefined; // Move to applicationMaterials.customResume if needed
  app.portfolio = undefined;
  
  await app.save();
}
```

---

## Complete Example: Job Application Flow

```javascript
// 1. User applies to job
const application = await Application.create({
  applicationId: generateId(),
  candidateId: userId,
  jobListingId: jobId,
  companyId: companyId,
  candidateName: user.name, // Denormalized
  candidateEmail: user.email, // Denormalized
  stage: 'new',
  matchScore: 94
});

// 2. Recruiter views application
const app = await Application.findById(appId)
  .populate({
    path: 'candidateId',
    select: 'name email profile resume socialLinks projects skills experience'
  })
  .populate('jobListingId');

// Access all candidate data through reference
const resume = app.candidateId.resume;
const projects = app.candidateId.projects;
const skills = app.candidateId.skills;

// 3. Schedule interview
const interview = await Interview.create({
  interviewId: generateId(),
  applicationId: app._id,
  candidateId: app.candidateId._id,
  jobListingId: app.jobListingId._id,
  companyId: app.companyId,
  candidateName: app.candidateId.name, // Denormalized
  scheduledDate: new Date('2025-12-15T14:00:00Z'),
  type: 'technical'
});

// 4. View interview with full context
const fullInterview = await Interview.findById(interviewId)
  .populate({
    path: 'applicationId',
    populate: {
      path: 'candidateId',
      select: 'name email profile resume projects skills'
    }
  });

// Everything is accessible through references
const candidateInfo = fullInterview.applicationId.candidateId;
const candidateResume = candidateInfo.resume;
const candidateProjects = candidateInfo.projects;
```

This approach gives you:
- ✅ Clean, normalized data structure
- ✅ Single source of truth
- ✅ Easy updates (change once, reflects everywhere)
- ✅ Better data consistency
- ✅ Flexible querying with populate
