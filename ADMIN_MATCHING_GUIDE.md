# Admin Matching System Guide

## Overview

The Bridge AI matching system allows admins to manually rate student-job matches and then algorithmically publish the best matches to students and companies. The system consists of two main pages:

1. **Admin Matching** (`/AdminMatching`) - Manual rating grid interface
2. **Send Matches** (`/SendMatches`) - Optimal match generation and publishing

---

## Table of Contents

1. [Admin Matching Page - Rating Grid](#admin-matching-page---rating-grid)
2. [Send Matches Page - Publishing](#send-matches-page---publishing)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [Workflows](#workflows)
6. [Best Practices](#best-practices)

---

## Admin Matching Page - Rating Grid

**Route:** `/AdminMatching`

### Purpose
Create and manage ratings for all possible student-job combinations using a 2D grid interface where students are on rows and job postings are on columns.

### Features

#### 1. **2D Grid Interface**
- **Rows:** Students (with name and email)
- **Columns:** Job postings (with role title and company)
- **Cells:** Match ratings (0-100 score)

#### 2. **Color Coding**
- **White:** Not rated (score = 0)
- **Green (80-100):** Excellent match
- **Blue (60-79):** Good match
- **Yellow (40-59):** Fair match
- **Red (0-39):** Poor match
- **Striped pattern:** Pending changes (not yet published)
- **Blue ring:** Selected for editing
- **Red strikethrough:** Marked for deletion

#### 3. **Drag-to-Select Functionality**

**For Empty Cells (No Rating):**
- Drag across empty cells to mark them for editing
- They turn blue with a ring
- Click individual blue cells to open rating panel
- OR use "Batch Rate All" to assign same score to all selected

**For Filled Cells (Has Rating):**
- Drag across filled cells to mark them for deletion
- They turn red with strikethrough
- Changes are pending until published

**Important:** Cells don't auto-assign values when dragged. You must rate them after selection.

#### 4. **Individual Cell Rating**

Click any cell to open the rating panel:

**Overall Score Slider:**
- Main rating from 0-100
- Adjustable in steps of 5

**Category Sliders (Optional):**
- Skills Match
- Experience Match
- Education Match
- Cultural Fit
- Location Match
- Compensation Match

Click "Show Category Sliders" to expand detailed ratings.

#### 5. **AI Suggestion**

Click "AI Suggest" button when rating a cell:
- Uses OpenAI GPT-3.5-turbo (cheapest model)
- Analyzes student profile vs job requirements
- Generates scores for all categories
- Provides 2-3 sentence explanation
- Automatically shows category sliders
- You can adjust AI suggestions before saving

**AI considers:**
- Student skills vs required skills
- Education level and major
- Location preferences
- Salary expectations
- Experience level
- Cultural fit indicators

#### 6. **Batch Actions**

When cells are selected (blue ring):

**Batch Rate All:**
- Opens prompt for score input (0-100)
- Applies same score to all selected cells
- Sets all category sliders to that score

**Batch Delete All:**
- Marks all selected cells for deletion
- Only works on cells that have ratings

**Clear Selection:**
- Deselects all currently selected cells

#### 7. **Pending/Publish Workflow**

**All changes are pending until published:**
- New ratings show striped pattern
- Deletions show red strikethrough
- Counter shows total pending changes
- Click "Publish All" to commit changes to database

**Warning:** If you try to publish with selected but unrated cells, you'll get a confirmation dialog.

#### 8. **Hover Tooltips**

Hover over student names or job titles to see:
- **Students:** Email, university, top skills
- **Jobs:** Company name, location, required skills, salary range

#### 9. **Search**

Search bar filters students by name or email in real-time.

#### 10. **Rating Rubric**

Scroll down to see the comprehensive rubric with:
- Score range definitions
- Category-specific guidance
- Best practices
- Drag-and-drop instructions

---

## Send Matches Page - Publishing

**Route:** `/SendMatches`

### Purpose
Generate optimal matches using constraints and publish them to students and companies.

### How It Works

#### 1. **Configuration Panel**

Set three constraints:

**Max Matches per Student (default: 5)**
- Each student receives at most this many job matches
- Range: 1-20
- Example: If set to 5, a student will see their top 5 best matches

**Max Matches per Job Listing (default: 10)**
- Each job listing receives at most this many student matches
- Range: 1-50
- Example: If set to 10, each job posting gets up to 10 student matches

**Minimum Match Score (default: 40)**
- Only matches with this score or higher are considered
- Range: 0-100
- Example: If set to 40, all matches below 40 are excluded

#### 2. **Generate Matches**

Click "Generate Matches" button:

**Algorithm (Greedy):**
1. Fetches all matches from Admin Matching grid with score ≥ minimum
2. Sorts matches by score (highest to lowest)
3. Iterates through sorted list:
   - If student has fewer than max student matches AND
   - Job listing has fewer than max job matches
   - Then: Include this match
   - Else: Skip this match
4. Returns proposed matches

**Why Greedy?**
- Prioritizes highest-quality matches first
- Simple and fast
- Guarantees constraints are met
- Ensures fairest distribution

#### 3. **Review Proposed Matches**

After generation, you'll see:

**Statistics:**
- Total Matches: Number of matches generated
- Students Matched: Number of unique students with at least one match
- Jobs Matched: Number of unique job listings with at least one match
- Average Score: Mean score of all proposed matches

**Match List:**
Each match shows:
- Student name → Job title @ Company name
- Student email and job location
- Match score (color-coded)
- Eye icon to toggle detailed category scores

#### 4. **Publish Matches**

Click "Publish X Matches" button:

**What Happens:**
1. **Confirmation dialog** appears
2. If confirmed:
   - **Archives all existing matches** (sets `visibleToStudent` and `visibleToEmployer` to `false`)
   - **Publishes selected matches** (sets visibility flags to `true`)
   - **Updates status** to `active`
   - **Marks as AI-generated** (`matchType: 'ai_generated'`)

**Important:** Publishing is destructive! It hides all previous matches and only shows the new optimal set.

#### 5. **Students See Matches**

After publishing:
- Students navigate to their dashboard
- See matches in "New Matches" section
- Can view job details, apply, schedule assessments
- Only see matches where `visibleToStudent = true`

#### 6. **Companies See Matches**

After publishing:
- Companies view their job listings dashboard
- See matched students for each job
- Can review student profiles, schedule interviews
- Only see matches where `visibleToEmployer = true`

---

## Database Schema

### Match Model

```javascript
{
  // References
  studentId: ObjectId (ref: 'User'),
  companyId: ObjectId (ref: 'Company'),
  jobListingId: ObjectId (ref: 'JobListing'),

  // Scores
  overallScore: Number (0-100),
  matchFactors: {
    skillsMatch: Number (0-100),
    experienceMatch: Number (0-100),
    educationMatch: Number (0-100),
    culturalFit: Number (0-100),
    locationMatch: Number (0-100),
    compensationMatch: Number (0-100)
  },

  // Status
  status: String ('pending', 'active', 'archived', etc.),
  matchType: String ('manual', 'ai_generated', 'hybrid'),

  // Visibility (KEY FOR PUBLISHING)
  visibleToStudent: Boolean,
  visibleToEmployer: Boolean,

  // Metadata
  createdBy: String,
  lastModifiedBy: String,
  adminNotes: String,
  matchReason: String,

  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

### Key Fields for Admins

**visibleToStudent:**
- `true` = Student sees this match in their dashboard
- `false` = Hidden from student (archived)

**visibleToEmployer:**
- `true` = Company sees this match in job listing
- `false` = Hidden from company (archived)

**status:**
- `'active'` = Currently live match
- `'archived'` = Old/hidden match
- `'pending'` = Not yet published

**matchType:**
- `'manual'` = Created via Admin Matching grid
- `'ai_generated'` = Published via Send Matches
- `'hybrid'` = Mix of both

---

## API Endpoints

### Admin Matching Endpoints

#### 1. Get All Matches
```
GET /api/admin/matching
```
Returns all matches with populated student, company, and job data.

#### 2. Batch Create/Update Matches
```
POST /api/admin/matching/batch
Body: {
  matches: [
    {
      studentId: String,
      companyId: String,
      jobListingId: String,
      overallScore: Number,
      matchFactors: Object,
      adminNotes: String,
      matchReason: String
    },
    ...
  ]
}
```
Creates new matches or updates existing ones.

#### 3. Delete Match
```
DELETE /api/admin/matching/delete
Body: {
  studentId: String,
  companyId: String,
  jobListingId: String
}
```
Deletes a specific match by query.

#### 4. AI Suggestion
```
POST /api/admin/matching/ai-suggest
Body: {
  student: Object (full student profile),
  job: Object (full job listing)
}
```
Returns AI-generated ratings and explanation using GPT-3.5-turbo.

### Send Matches Endpoints

#### 5. Generate Optimal Matches
```
POST /api/admin/matching/generate-optimal
Body: {
  studentLimit: Number,
  companyLimit: Number,
  minScore: Number
}
```
Returns proposed matches based on greedy algorithm.

#### 6. Publish Final Matches
```
POST /api/admin/matching/publish-final
Body: {
  matches: [
    {
      studentId: String,
      companyId: String,
      jobListingId: String,
      overallScore: Number,
      matchFactors: Object
    },
    ...
  ]
}
```
Archives all existing matches and publishes selected ones.

---

## Workflows

### Workflow 1: Create Matches from Scratch

1. Navigate to `/AdminMatching`
2. Drag across empty cells to select multiple student-job pairs
3. Options:
   - **Option A:** Click "Batch Rate All" → Enter score → All selected cells get that score
   - **Option B:** Click individual blue cells → Use AI Suggest or manual sliders → Save each
4. Click "Publish All" to save ratings to database
5. Navigate to `/SendMatches`
6. Configure constraints (student limit, company limit, min score)
7. Click "Generate Matches"
8. Review proposed matches and statistics
9. Click "Publish X Matches"
10. Confirm in dialog
11. Done! Students and companies can now see their matches

### Workflow 2: Update Existing Matches

1. Navigate to `/AdminMatching`
2. Click on filled cells to edit ratings
3. Adjust sliders or use AI Suggest
4. Click "Publish All" to update database
5. Navigate to `/SendMatches`
6. Re-run "Generate Matches" with new scores
7. Publish updated matches

### Workflow 3: Delete Bad Matches

1. Navigate to `/AdminMatching`
2. Drag across filled cells you want to remove
3. They turn red with strikethrough
4. Click "Publish All" to delete from database
5. Navigate to `/SendMatches`
6. Generate and publish fresh matches without deleted ones

### Workflow 4: Use AI for Bulk Rating

1. Navigate to `/AdminMatching`
2. Drag to select many empty cells
3. Click individual blue cells one by one
4. For each cell, click "AI Suggest"
5. Review AI's explanation and scores
6. Adjust if needed using category sliders
7. Move to next cell
8. When done, click "Publish All"
9. Proceed to `/SendMatches` to publish

---

## Best Practices

### Rating Strategy

**1. Start with AI Suggestions**
- Use AI as a baseline for unfamiliar matches
- Always review and adjust based on your expertise
- AI doesn't know company culture details you might have

**2. Be Consistent**
- Use the same rating methodology across all matches
- If you rate one Java developer at 80, rate similar ones similarly
- Document your reasoning in admin notes if needed

**3. Focus on Potential**
- Don't just look at current state
- Consider growth trajectory
- Weight recent achievements more than old ones

**4. Use Category Sliders**
- Don't rely solely on overall score
- Break down ratings by category
- Helps identify specific strengths/weaknesses

**5. Batch Strategically**
- Use batch rating for clearly similar matches
- Use individual rating for nuanced cases
- Don't batch-rate if candidates vary significantly

### Publishing Strategy

**1. Set Appropriate Constraints**

**Student Limit:**
- Too low (1-3): Students have few options, may miss good fits
- Sweet spot (5-10): Enough variety without overwhelming
- Too high (15+): Students get choice paralysis

**Job Listing Limit:**
- Too low (1-5): Job listings miss good candidates
- Sweet spot (10-20): Manageable pipeline for each role
- Too high (30+): Too many candidates per job, hard to review everyone

**Minimum Score:**
- Too low (0-30): Include poor matches, waste everyone's time
- Sweet spot (40-60): Good quality threshold
- Too high (80+): May exclude good matches, too restrictive

**2. Test Before Publishing**
- Review proposed matches carefully
- Check that top students got matched
- Check that top companies got candidates
- Verify average score is reasonable

**3. Communicate to Users**
- Tell students when new matches are published
- Tell companies to check for new candidates
- Set expectations on match quality and quantity

**4. Iterate Based on Feedback**
- Monitor which matches lead to interviews
- Adjust minimum score threshold based on outcomes
- Refine AI prompts if suggestions are consistently off

### Maintenance

**Weekly Tasks:**
1. Review new student signups and create ratings
2. Review new job postings and create ratings
3. Archive old matches (students who accepted offers)
4. Update ratings based on new student achievements

**Monthly Tasks:**
1. Analyze match quality (interview rate, offer rate)
2. Adjust constraints based on feedback
3. Re-train yourself on rating rubric
4. Clean up test/demo data

**Quarterly Tasks:**
1. Review overall matching strategy
2. Update AI prompt if needed
3. Analyze which categories matter most
4. Optimize constraint defaults

### Troubleshooting

**Issue: No matches generated**
- Check if minimum score is too high
- Verify matches exist in Admin Matching grid
- Ensure constraints aren't too restrictive

**Issue: Too few students matched**
- Increase student limit
- Lower minimum score
- Create more ratings in grid

**Issue: Too few job listings matched**
- Increase job listing limit
- Lower minimum score
- Create ratings for more job postings

**Issue: Matches seem poor quality**
- Review individual ratings in grid
- Use AI Suggest to re-evaluate
- Raise minimum score threshold

**Issue: AI suggestions are bad**
- Check student/job data completeness
- Verify OpenAI API key is set
- Review AI explanation to understand reasoning
- Adjust manually after AI suggests

### Security Notes

**Access Control:**
- Only dev/admin users can access these pages
- Protected by `devOnly` middleware
- Regular students/companies cannot see admin routes

**Data Integrity:**
- Publishing is atomic (all or nothing)
- Old matches are archived, not deleted
- Can recover by re-publishing previous set
- All changes are logged with timestamps

**API Keys:**
- OpenAI API key must be in `.env` file
- Uses GPT-3.5-turbo (cheapest model ~$0.0005/1K tokens)
- Typical match costs <$0.01
- Monitor usage in OpenAI dashboard

---

## Advanced Tips

### Keyboard Shortcuts
- Click + drag cells faster than clicking individually
- Use search to quickly find specific students
- Hover previews save time on full profile views

### Data Export
- All matches are in MongoDB `matches` collection
- Can export for analysis in Excel/Sheets
- Query by `matchType`, `status`, visibility flags

### Bulk Operations
- Can use MongoDB Compass for bulk edits
- Can write scripts using `/api/admin/matching/batch`
- Can archive entire cohorts at once

### Custom Algorithms
- Greedy algorithm is simple but effective
- Could implement Hungarian algorithm for optimal bipartite matching
- Could weight categories differently (skills > location)
- Could add diversity constraints (ensure variety of companies)

### Integration Points
- Matches feed into student dashboard (`StudentNewMatches.jsx`)
- Matches feed into job listing dashboard (`JobListingDashboard.jsx`) - displays all published matches for the specific job listing
- Can trigger emails when matches are published
- Can integrate with interview scheduling system

### Job Listing Dashboard Match Display

When matches are published via the Send Matches page, they become visible to employers on the Job Listing Dashboard:

**Features:**
- Displays all matched candidates for the specific job listing
- Shows overall match score with color coding (green 80+, blue 60-79, yellow 40-59, red 0-39)
- Student names are clickable links to ApplicantProfile (opens in new tab)
- Expandable match breakdown showing all category scores with progress bars
- Empty state when no matches are published yet
- Real-time loading states

**API Endpoint:**
- `GET /api/admin/matching/job/:jobListingId` - Fetches all matches where `visibleToEmployer=true` for the specified job listing

---

## FAQs

**Q: What happens to old matches when I publish new ones?**
A: They are archived (visibility flags set to `false`) but not deleted. Students and companies no longer see them.

**Q: Can I un-publish matches?**
A: Yes, you can manually update the database to set visibility flags back to `true`, or re-run the publishing workflow with a different set.

**Q: Do I have to rate every single student-job combination?**
A: No! Only rate combinations that make sense. The algorithm only considers matches you've created.

**Q: Can students see their match scores?**
A: Currently no, but you could modify `StudentNewMatches.jsx` to display scores if desired.

**Q: How often should I re-publish matches?**
A: Depends on your cohort cycle. Common cadences: weekly for rolling admissions, monthly for batches, once per semester.

**Q: What if I make a mistake while rating?**
A: Changes are pending until you click "Publish All", so you can undo by refreshing the page. After publishing, just edit the cell again and re-publish.

**Q: Can I export the rating grid?**
A: Not directly from the UI, but you can query the database via Compass or write a script using the API.

**Q: Why use a greedy algorithm instead of optimal matching?**
A: Greedy is fast, simple, and "good enough" for most cases. Optimal algorithms are complex and may not significantly improve outcomes.

---

## Conclusion

The Admin Matching System provides powerful tools for creating high-quality student-job matches at scale. By combining manual expertise with AI suggestions and algorithmic optimization, you can efficiently connect students with the best opportunities.

**Remember:**
- Manual rating gives you full control
- AI suggestions save time and provide consistency
- Batch actions enable scaling
- Publishing workflow prevents mistakes
- Constraints ensure fairness

For questions or issues, contact the development team or check the codebase:
- Frontend: `/client/src/pages/AdminMatching.jsx`, `/client/src/pages/SendMatches.jsx`
- Backend: `/server/routes/adminRoutes.js`
- Models: `/server/models/Match.js`

Happy matching! 🎯
