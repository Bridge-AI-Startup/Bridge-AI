# MongoDB Schemas - Quick Reference

## 🎯 Core Concepts

### Authentication Model
- **Students**: Login with User schema (Firebase Authentication or email + password)
- **Company Employees**: Login with TeamMember schema (Firebase Authentication or email + password)
- **Company**: No authentication - just a profile

### Roles (Simplified)
- **admin**: Full access to company resources
- **member**: Limited access, can view and perform basic tasks

## 📋 Schema Files

```
schemas/
├── User.js              - Students/candidates
├── Company.js           - Company profiles
├── TeamMember.js        - Company employees with auth
├── JobListing.js        - Job postings
├── Application.js       - Job applications
├── Assessment.js        - Assessment templates
├── AssessmentResult.js  - Assessment attempts/results
├── Interview.js         - Interview scheduling & feedback
├── Offer.js            - Job offers
├── Communication.js     - Communication logs
├── index.js            - Exports all schemas
├── example.js          - Usage examples
├── package.json        - Dependencies
└── README.md           - Full documentation
```

## 🚀 Quick Setup

### 1. Install dependencies
```bash
npm install mongoose
```

### 2. Import schemas
```javascript
const { User, Company, TeamMember, JobListing, Application } = require('./schemas');
```

### 3. Connect to MongoDB
```javascript
const mongoose = require('mongoose');
await mongoose.connect('mongodb://localhost:27017/hiring_platform');
```

## 📊 Essential Relationships

```
Company (1) ──────── (many) TeamMember
Company (1) ──────── (many) JobListing
Company (1) ──────── (many) Application

JobListing (1) ──── (many) Application
User (1) ───────── (many) Application
Application (1) ─── (many) Interview
Application (1) ─── (1) Offer
```

## 🔑 Key Fields Reference

### User
- `uid` - Unique identifier
- `email` - Login credential
- `resume` - Resume file object
- `projects` - Array of projects
- `jobPreferences` - Job search preferences

### Company
- `companyId` - Unique identifier
- `companyName` - Company name
- `settings.autoMatchEnabled` - AI matching toggle

### TeamMember
- `uid` - Unique identifier (Firebase UID or generated)
- `companyId` - Reference to Company
- `email` - Login credential
- `companyRole` - 'admin' or 'member' (company-level role)
- `status` - 'invited', 'active', 'inactive'

### JobListing
- `listingId` - Unique identifier
- `companyId` - Reference to Company
- `roleTitle` - Job title
- `status` - 'draft', 'active', 'paused', 'closed', 'filled'
- `locationType` - 'remote', 'hybrid', 'in_person'
- `createdBy` - Reference to TeamMember

### Application
- `applicationId` - Unique identifier
- `candidateId` - Reference to User
- `jobListingId` - Reference to JobListing
- `stage` - Pipeline stage
- `matchScore` - AI match score (0-100)
- `stageHistory` - Array of stage changes

### Interview
- `interviewId` - Unique identifier
- `applicationId` - Reference to Application
- `scheduledDate` - Interview date/time
- `status` - 'scheduled', 'completed', 'cancelled'
- `feedback` - Array of interviewer feedback

## 💡 Common Operations

### Create Records
```javascript
// Create company
const company = await Company.create({
  companyId: 'comp_123',
  companyName: 'Acme Corp',
  // ... other fields
});

// Create team member (admin)
const admin = await TeamMember.create({
  uid: 'firebase-uid-or-generated',
  companyId: company._id,
  email: 'admin@acme.com',
  password: hashedPassword, // Optional for Firebase users
  companyRole: 'admin',
  status: 'active'
});

// Create job listing
const job = await JobListing.create({
  listingId: 'job_789',
  companyId: company._id,
  roleTitle: 'Software Engineer',
  status: 'active',
  createdBy: admin._id
});
```

### Query Records
```javascript
// Find active jobs
const jobs = await JobListing.find({
  companyId: companyId,
  status: 'active'
});

// Find applications with populate
const apps = await Application.find({ jobListingId: jobId })
  .populate('candidateId', 'name email')
  .sort({ appliedAt: -1 });

// Find team members
const team = await TeamMember.find({
  companyId: companyId,
  status: 'active'
});
```

### Update Records
```javascript
// Move application to next stage
await Application.findByIdAndUpdate(appId, {
  stage: 'interview_scheduled',
  lastActivityAt: new Date(),
  $push: {
    stageHistory: {
      stage: 'interview_scheduled',
      movedAt: new Date(),
      movedBy: teamMemberId,
      notes: 'Strong candidate'
    }
  }
});

// Update team member login time
await TeamMember.findByIdAndUpdate(teamMemberId, {
  lastLoginAt: new Date()
});
```

## 🎨 Customization Tips

### Adding Fields
```javascript
// Just add to schema
const userSchema = new mongoose.Schema({
  // ... existing fields
  phoneNumber: String,  // Add this
  linkedinVerified: Boolean  // Add this
});
```

### Adding Enum Values
```javascript
// Extend existing enums
stage: {
  type: String,
  enum: [
    'new',
    'phone_screen',  // Add this
    // ... other values
  ]
}
```

### Adding Methods
```javascript
// Add to schema
userSchema.methods.getDisplayName = function() {
  return this.name;
};

// Use it
const user = await User.findById(userId);
console.log(user.getDisplayName());
```

### Adding Indexes
```javascript
// Add to schema or create programmatically
await User.collection.createIndex({ university: 1 });
```

## ⚠️ Important Notes

1. **Hash passwords** before storing:
   ```javascript
   const bcrypt = require('bcrypt');
   const hashedPassword = await bcrypt.hash(password, 10);
   ```

2. **Never return passwords** in API responses:
   ```javascript
   userSchema.methods.toJSON = function() {
     const obj = this.toObject();
     delete obj.password;
     return obj;
   };
   ```

3. **Use compound indexes** for common queries:
   ```javascript
   applicationSchema.index({ jobListingId: 1, candidateId: 1 }, { unique: true });
   ```

4. **Store files in S3/cloud** - Only store URLs in database:
   ```javascript
   resume: {
     fileUrl: 'https://s3.amazonaws.com/bucket/file.pdf',
     s3Key: 'resumes/file.pdf'  // For deletion
   }
   ```

5. **Use transactions** for critical operations:
   ```javascript
   const session = await mongoose.startSession();
   session.startTransaction();
   try {
     // ... operations
     await session.commitTransaction();
   } catch (error) {
     await session.abortTransaction();
   }
   ```

## 🔍 Search Patterns

### Text Search
```javascript
// Find jobs by keywords
const jobs = await JobListing.find({
  $text: { $search: 'engineer software' }
});
```

### Range Queries
```javascript
// Find high-scoring applications
const topApps = await Application.find({
  matchScore: { $gte: 80, $lte: 100 }
});
```

### Date Queries
```javascript
// Find applications from last 7 days
const recentApps = await Application.find({
  appliedAt: {
    $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  }
});
```

### Aggregation
```javascript
// Get stats by stage
const stats = await Application.aggregate([
  { $match: { companyId: mongoose.Types.ObjectId(id) } },
  { $group: {
    _id: '$stage',
    count: { $sum: 1 },
    avgScore: { $avg: '$matchScore' }
  }}
]);
```

## 📦 File Structure for Your Backend

```
your-backend/
├── models/
│   ├── User.js
│   ├── Company.js
│   ├── TeamMember.js
│   ├── JobListing.js
│   ├── Application.js
│   ├── Assessment.js
│   ├── AssessmentResult.js
│   ├── Interview.js
│   ├── Offer.js
│   ├── Communication.js
│   └── index.js
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── companies.js
│   ├── jobs.js
│   └── applications.js
├── middleware/
│   ├── auth.js
│   └── validation.js
├── config/
│   └── database.js
└── server.js
```

## 🎯 Next Steps

1. ✅ Copy schemas to your project
2. ✅ Install mongoose: `npm install mongoose`
3. ✅ Connect to MongoDB
4. ✅ Create authentication middleware
5. ✅ Build API routes
6. ✅ Add validation
7. ✅ Set up file uploads (S3/CloudFlare)
8. ✅ Add email notifications
9. ✅ Implement search
10. ✅ Add tests

## 🆘 Common Issues

### Issue: Duplicate key error
**Solution**: Check for unique indexes, ensure IDs are unique

### Issue: Cast to ObjectId failed
**Solution**: Validate ObjectId format before queries
```javascript
if (!mongoose.Types.ObjectId.isValid(id)) {
  return res.status(400).json({ error: 'Invalid ID' });
}
```

### Issue: Path not populated
**Solution**: Use `.populate()` in queries
```javascript
.populate('candidateId', 'name email')
```

### Issue: Validation error
**Solution**: Check required fields and enum values match schema

## 📚 Resources

- [Mongoose Docs](https://mongoosejs.com/docs/)
- [MongoDB Best Practices](https://docs.mongodb.com/manual/administration/production-notes/)
- Example file: `example.js` - Complete working examples
- README.md - Full documentation

---

**Remember**: This is a modular design - add, remove, or modify any schema as your requirements change!
