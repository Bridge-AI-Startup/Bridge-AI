# Bridge AI Setup Guide

This guide will help you set up test data for the matching system.

## Prerequisites

- MongoDB running
- Firebase configured
- Both server and client running

## Step-by-Step Setup

### 1. Create Users and Companies

Run the seed script to create 10 students and 10 employers with companies:

```bash
cd server
node scripts/seedUsers.js
```

This creates:
- **10 Students** from various universities (Stanford, MIT, Berkeley, etc.)
- **10 Employers** with companies across different industries
- **Default password for all users**: `Password123!`

**Example student login**:
- Email: `alex.johnson@student.edu`
- Password: `Password123!`

**Example employer login**:
- Email: `jennifer.williams@techcorp.com`
- Password: `Password123!`

### 2. Create Job Listings

Log in as each employer and create job listings:

1. Go to `/EmployerSignIn`
2. Sign in with an employer account (e.g., `jennifer.williams@techcorp.com`)
3. Navigate to your dashboard
4. Click "Create Job Listing" or "Post New Job"
5. Fill in the job details:
   - Role Title (e.g., "Software Engineer Intern")
   - Description
   - Required skills
   - Work location
   - Salary range
   - etc.
6. Save the job listing
7. Repeat for other employers

**Tip**: Create at least 5-8 job listings across different companies for good test data.

### 3. Populate Random Matches

Once you have students and job listings, you can generate test match data:

#### Option A: Via Admin Portal (Recommended)
1. Go to `/AdminPortal`
2. Scroll to the "Matching System" section
3. Find "Populate Random Matches"
4. Click "Execute"
5. Review the results showing how many matches were created

#### Option B: Via API Call
```bash
curl -X POST http://localhost:5000/api/admin/matching/populate-random
```

This will:
- Create a complete N×M matrix (all students × all job listings)
- Generate scores with realistic distribution:
  - 20% poor matches (0-39)
  - 30% fair matches (40-59)
  - 30% good matches (60-79)
  - 20% excellent matches (80-100)
- All scores have decimal precision (e.g., 72.3, 85.7)
- All matches start as `visibleToStudent: false` and `visibleToEmployer: false`

### 4. Rate Matches (Optional)

Use the Admin Matching Grid to manually adjust ratings:

1. Go to `/AdminMatching`
2. View the 2D grid of all student-job combinations
3. Drag to select cells
4. Use the rating panel to adjust scores
5. Click "Publish All" to save changes

### 5. Generate Optimal Matches

Create optimized matches using the greedy algorithm:

1. Go to `/SendMatches`
2. Configure constraints:
   - **Max matches per student**: e.g., 5
   - **Max matches per job listing**: e.g., 10
   - **Minimum score**: e.g., 40
3. Click "Generate Matches"
4. Review the proposed matches
5. Click "Publish X Matches" to make them visible

### 6. Publish Matches to Dashboards

After publishing matches:
- **Students** will see matches on their StudentPipeline
- **Employers** will see matched candidates on their JobListingDashboard
- Assessment results are automatically created for students

## Testing the Student Flow

1. Sign out and sign in as a student
2. Go to `/StudentPipeline`
3. You should see matched job listings
4. Click on a match to view details
5. Click "Start Assessment" to begin the assessment

## Testing the Employer Flow

1. Sign in as an employer
2. Go to your job listing dashboard
3. You should see matched candidates with scores
4. View match details to see category breakdowns

## Clearing Test Data

### Clear All Matches
Via Admin Portal:
1. Go to `/AdminPortal`
2. Find "Clear All Matches" in Matching System section
3. Click "Execute" and confirm (requires double confirmation)

Or via SendMatches page:
1. Go to `/SendMatches`
2. Click "Clear All Matches" button (if visible)

### Clear All Users and Companies
```bash
# Use with caution - deletes everything!
curl -X POST http://localhost:5000/api/admin/clear/auth
```

## Quick Reference

| User Type | Example Email | Password |
|-----------|--------------|----------|
| Student | alex.johnson@student.edu | Password123! |
| Student | sarah.chen@student.edu | Password123! |
| Employer | jennifer.williams@techcorp.com | Password123! |
| Employer | robert.brown@innovate.io | Password123! |

## Troubleshooting

### "Need at least one student and one job listing"
- Run step 1 to create users
- Complete step 2 to create job listings
- Then retry step 3

### "No matches found"
- Ensure you've run "Populate Random Matches"
- Check that matches exist in `/AdminMatching`

### Students don't see matches
- Matches must be published via `/SendMatches`
- Check that `visibleToStudent: true` for the match

### Employers don't see candidates
- Matches must be published via `/SendMatches`
- Check that `visibleToEmployer: true` for the match

## Admin Portal Features

The Admin Portal (`/AdminPortal`) provides:

- **Admin Pages**: Quick navigation to matching, assessments, reviews
- **Statistics**: System-wide counts of users, companies, jobs, matches
- **API Routes**: Execute admin operations directly
- **Data Management**: Populate test data, clear databases
- **Search**: Find routes by name, description, or path

## Next Steps

After setup:
1. Test the complete matching workflow
2. Create assessments for job listings
3. Have students take assessments
4. Review assessment submissions
5. Schedule interviews
6. Make offers
