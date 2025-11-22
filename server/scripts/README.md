# Server Scripts

This directory contains utility scripts for database management and testing.

## Available Scripts

### seedTestMatches.js

**Purpose**: Creates test match data with varying scores for testing the admin matching system.

**What it does**:
- Fetches all students (users) and job listings from the database
- Deletes all existing matches
- **Creates a complete matrix**: Every student gets matched with EVERY job listing
- For 13 students × 8 jobs = 104 total matches
- Generates varied scores across all ranges (0-100) to test the matching interface
- Uses decimal values (e.g., 72.3, 85.7) to demonstrate precision
- Creates a good distribution across score ranges:
  - Excellent (80-100): ~20%
  - Good (60-79): ~30%
  - Fair (40-59): ~30%
  - Poor (0-39): ~20%

**How to run**:
```bash
cd server
node scripts/seedTestMatches.js
```

**Output**:
- Total matches created (students × jobs)
- Score distribution statistics
- Average overall score
- Number of students and jobs used

**Example Output**:
```
✅ Successfully created test matches!

Score Distribution:
  Excellent (80-100): 20 matches
  Good (60-79): 32 matches
  Fair (40-59): 31 matches
  Poor (0-39): 21 matches

Total: 104 matches created
Students matched: 13
Jobs used: 8
Average overall score: 59.9
```

**Important Notes**:
- All matches are created with `visibleToStudent=false` and `visibleToEmployer=false`
- This means students and companies won't see these matches until you publish them via the Send Matches page
- The script generates realistic variation in category scores (skills, experience, education, etc.)
- Each run clears existing matches, so be careful not to delete production data

**Workflow**:
1. Run this script to create test data: `node scripts/seedTestMatches.js`
2. Navigate to `/AdminMatching` to view and edit the ratings in the 2D grid
3. Make any adjustments to scores using the drag-to-select and rating panel
4. Click "Publish All" to save changes
5. Navigate to `/SendMatches` to generate optimal matches
6. Configure constraints (student limit, company limit, min score)
7. Click "Generate Matches" to see proposed matches
8. Click "Publish X Matches" to make them visible to students and companies

## Adding New Scripts

When adding new scripts to this directory:
1. Create a descriptive filename (e.g., `seedCompanies.js`)
2. Add proper error handling and logging
3. Include a clear console output showing what was done
4. Document the script in this README
5. Make sure to call `process.exit(0)` or `process.exit(1)` at the end
