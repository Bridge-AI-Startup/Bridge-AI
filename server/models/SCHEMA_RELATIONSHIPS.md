# Schema Relationships - Visual Diagram

## 📊 High-Level Overview

```
                         ┌─────────────────┐
                         │     Company     │
                         │  (Profile only) │
                         └────────┬────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
                    │ (belongs to)│ (belongs to)│
                    ▼             ▼             ▼
           ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
           │ TeamMember  │ │ JobListing  │ │ Application │
           │    (Auth)   │ │             │ │             │
           └─────────────┘ └──────┬──────┘ └──────┬──────┘
                    │             │                │
                    │(created by) │                │
                    └─────────────┘                │
                                                   │
                         ┌─────────────────────────┼──────────────┐
                         │                         │              │
                         │                         │              │
                    ┌────▼───────┐          ┌─────▼─────┐  ┌─────▼──────┐
                    │ Interview  │          │   Offer   │  │ Assessment │
                    │            │          │           │  │   Result   │
                    └────────────┘          └───────────┘  └────────────┘


                              ┌──────────┐
                              │   User   │
                              │(Student) │
                              └────┬─────┘
                                   │
                                   │ (applies)
                                   │
                              ┌────▼──────┐
                              │Application│
                              └───────────┘
```

---

## 🔗 Detailed Relationships

### 1. Company ↔ TeamMember (1:many)
```
Company._id ────► TeamMember.companyId
```
**Use Case:** Get all team members of a company
```javascript
const members = await TeamMember.find({ companyId: company._id });
```

---

### 2. Company ↔ JobListing (1:many)
```
Company._id ────► JobListing.companyId
```
**Use Case:** Get all jobs posted by a company
```javascript
const jobs = await JobListing.find({ companyId: company._id });
```

---

### 3. TeamMember ↔ JobListing (1:many, created by)
```
TeamMember._id ────► JobListing.createdBy
```
**Use Case:** Get all jobs created by a team member
```javascript
const jobs = await JobListing.find({ createdBy: member._id });
```

---

### 4. JobListing ↔ Application (1:many)
```
JobListing._id ────► Application.jobListingId
```
**Use Case:** Get all applications for a job
```javascript
const apps = await Application.find({ jobListingId: job._id });
```

---

### 5. User ↔ Application (1:many)
```
User._id ────► Application.candidateId
```
**Use Case:** Get all applications by a student
```javascript
const apps = await Application.find({ candidateId: user._id });
```

---

### 6. Application ↔ Interview (1:many)
```
Application._id ────► Interview.applicationId
```
**Use Case:** Get all interviews for an application
```javascript
const interviews = await Interview.find({ applicationId: app._id });
```

---

### 7. Application ↔ Offer (1:1)
```
Application._id ────► Offer.applicationId
```
**Use Case:** Get offer for an application
```javascript
const offer = await Offer.findOne({ applicationId: app._id });
```

---

### 8. Application ↔ AssessmentResult (1:many)
```
Application._id ────► AssessmentResult.applicationId
```
**Use Case:** Get all assessment results for an application
```javascript
const results = await AssessmentResult.find({ applicationId: app._id });
```

---

### 9. Assessment ↔ AssessmentResult (1:many)
```
Assessment._id ────► AssessmentResult.assessmentId
```
**Use Case:** Get all attempts of an assessment
```javascript
const results = await AssessmentResult.find({ assessmentId: assessment._id });
```

---

### 10. JobListing ↔ Assessment (many:many, reference array)
```
JobListing.assessments[] ────► Assessment._id
```
**Use Case:** Get all assessments for a job
```javascript
const job = await JobListing.findById(jobId).populate('assessments');
```

---

## 🎯 Common Query Patterns

### Get Complete Application Details
```javascript
const fullApplication = await Application.findById(appId)
  .populate('candidateId', 'name email university')
  .populate('jobListingId', 'roleTitle companyId')
  .populate({
    path: 'jobListingId',
    populate: { path: 'companyId', select: 'companyName' }
  });
```

### Get Job with Company and Creator Info
```javascript
const job = await JobListing.findById(jobId)
  .populate('companyId', 'companyName companyWebsite')
  .populate('createdBy', 'firstName lastName email');
```

### Get Interview with All Participants
```javascript
const interview = await Interview.findById(interviewId)
  .populate('candidateId', 'name email')
  .populate('applicationId')
  .populate({
    path: 'interviewers.memberId',
    select: 'firstName lastName email title'
  });
```

### Get Company Dashboard Data
```javascript
// Get everything for company dashboard
const [jobs, applications, team, interviews] = await Promise.all([
  JobListing.find({ companyId }).sort({ postedAt: -1 }),
  Application.find({ companyId }).populate('candidateId'),
  TeamMember.find({ companyId, status: 'active' }),
  Interview.find({ companyId, status: 'scheduled' })
]);
```

### Get Student Dashboard Data
```javascript
// Get everything for student dashboard
const [applications, interviews] = await Promise.all([
  Application.find({ candidateId: userId })
    .populate('jobListingId')
    .populate({ path: 'jobListingId', populate: 'companyId' }),
  Interview.find({ candidateId: userId })
    .populate('jobListingId', 'roleTitle')
]);
```

---

## 📈 Data Flow Examples

### Example 1: Student Applies to Job

```
1. User (Student)
   ↓
2. JobListing (Find job)
   ↓
3. Application (Create application)
   ├─→ candidateId: User._id
   ├─→ jobListingId: JobListing._id
   └─→ companyId: JobListing.companyId
```

### Example 2: Company Reviews Application

```
1. TeamMember (Login)
   ↓
2. Company (Get companyId from TeamMember)
   ↓
3. JobListing (Find company's jobs)
   ↓
4. Application (Find applications for jobs)
   ├─→ with User data (populate candidateId)
   └─→ with Job data (populate jobListingId)
```

### Example 3: Schedule Interview

```
1. Application (Get application details)
   ├─→ populate candidateId (User)
   ├─→ populate jobListingId (JobListing)
   └─→ populate companyId (Company)
   ↓
2. Interview (Create interview)
   ├─→ applicationId: Application._id
   ├─→ candidateId: Application.candidateId
   ├─→ jobListingId: Application.jobListingId
   ├─→ companyId: Application.companyId
   └─→ interviewers: [{ memberId: TeamMember._id }]
   ↓
3. Application (Update stage to 'interview_scheduled')
```

### Example 4: Send Offer

```
1. Interview (Check if completed with good feedback)
   ↓
2. Offer (Create offer)
   ├─→ applicationId: Application._id
   ├─→ candidateId: Application.candidateId
   ├─→ jobListingId: Application.jobListingId
   └─→ companyId: Application.companyId
   ↓
3. Application (Update stage to 'offer_extended')
   ↓
4. Communication (Log offer email)
```

---

## 🔐 Access Control Patterns

### Team Member Access
```javascript
// Verify team member belongs to company
const member = await TeamMember.findById(teamMemberId);
const job = await JobListing.findById(jobId);

if (job.companyId.toString() !== member.companyId.toString()) {
  throw new Error('Access denied');
}
```

### Student Access
```javascript
// Verify application belongs to student
const application = await Application.findById(appId);

if (application.candidateId.toString() !== userId.toString()) {
  throw new Error('Access denied');
}
```

### Employer Admin vs Member
```javascript
const member = await TeamMember.findById(teamMemberId);

if (member.companyRole !== 'admin') {
  throw new Error('Employer admin access required');
}
```

---

## 🎨 Index Strategy

### Primary Indexes (Unique)
```
User.email
User.uid
Company.companyId
TeamMember.email
TeamMember.uid
JobListing.listingId
Application.applicationId
```

### Foreign Key Indexes
```
TeamMember.companyId
JobListing.companyId
JobListing.createdBy
Application.candidateId
Application.jobListingId
Application.companyId
Interview.applicationId
Offer.applicationId
AssessmentResult.applicationId
AssessmentResult.assessmentId
```

### Compound Indexes
```
Application: (jobListingId, candidateId) - Unique
Application: (companyId, stage)
TeamMember: (companyId, status)
```

### Sort Indexes (Descending)
```
JobListing.postedAt
Application.appliedAt
Application.matchScore
Communication.sentAt
```

### Text Search Indexes
```
Company.companyName
JobListing.roleTitle
JobListing.roleDescription
```

---

## 💡 Pro Tips

### Use Aggregation for Stats
```javascript
// Get application stats
const stats = await Application.aggregate([
  { $match: { companyId: mongoose.Types.ObjectId(id) } },
  { $group: {
    _id: '$stage',
    count: { $sum: 1 },
    avgScore: { $avg: '$matchScore' }
  }},
  { $sort: { count: -1 } }
]);
```

### Use Lean for Read-Only
```javascript
// 3x faster for read-only operations
const jobs = await JobListing.find({ companyId }).lean();
```

### Use Select to Limit Fields
```javascript
// Only get needed fields
const users = await User.find({})
  .select('name email university')
  .lean();
```

### Use Projection in Populate
```javascript
// Limit populated fields
const app = await Application.findById(id)
  .populate('candidateId', 'name email -_id');
```

---

## 🚀 Performance Tips

1. **Always use indexes** for queries on foreign keys
2. **Use lean()** for read-only operations
3. **Use select()** to limit fields returned
4. **Avoid populating in loops** - use aggregation instead
5. **Cache frequently accessed data** (Redis)
6. **Use compound indexes** for multi-field queries
7. **Add pagination** for large result sets
8. **Monitor slow queries** with MongoDB profiler

---

**Visual diagrams help! Reference this when building your queries. 📊**
