# Testing Guide for Admin Matching System

## Quick Start

### 1. Generate Test Data

Run the seeding script to create matches with varied scores:

```bash
cd server
node scripts/seedTestMatches.js
```

This will:
- Create a **complete matrix**: 13 students × 8 jobs = 104 matches
- Every student is matched with every job listing
- Generate scores distributed across all ranges (poor to excellent)
- Use decimal precision (e.g., 72.3, 85.7, 91.2)
- Set all matches to `visibleToStudent=false` and `visibleToEmployer=false`

**Score Distribution Created**:
- Excellent (80-100): ~20% of matches
- Good (60-79): ~30% of matches
- Fair (40-59): ~30% of matches
- Poor (0-39): ~20% of matches

### 2. Test the Admin Matching Page

Navigate to `/AdminMatching` to see the 2D grid with all the test data.

**What to test**:
- ✅ Decimal values display correctly in cells
- ✅ Drag across empty cells to select them (blue ring appears)
- ✅ Click selected cells to open rating panel
- ✅ Use the **number input field** next to the slider to enter decimal values (e.g., 87.3)
- ✅ Category sliders also support decimal inputs via number fields
- ✅ Batch rate selected cells with decimal values (e.g., "75.5")
- ✅ AI suggestions generate decimal scores
- ✅ Pending changes show striped pattern
- ✅ Color coding works for all score ranges

**Decimal Input Features**:
1. **Overall Score**:
   - Range slider (0-100, step 0.1)
   - Number input box for precise entry
   - Both are synced in real-time

2. **Category Scores**:
   - Each category has a range slider (step 0.1)
   - Each category has a number input for precision
   - Can enter values like 68.7, 92.3, etc.

3. **Batch Rating**:
   - Prompt now accepts decimal values
   - Example: Enter "83.5" to rate all selected cells

### 3. Test the Send Matches Page

After rating some matches:

1. Click "Publish All" on AdminMatching page
2. Navigate to `/SendMatches`
3. Configure constraints:
   - Max matches per student: 5
   - Max matches per job listing: 10
   - Minimum score: 40
4. Click "Generate Matches"

**What to test**:
- ✅ Matches are sorted by score (highest first)
- ✅ Decimal scores display correctly in match cards
- ✅ Student names are clickable → open `/ApplicantProfile?userId=...` in new tab
- ✅ Job titles are clickable → open `/JobListingDashboard?jobId=...` in new tab
- ✅ View toggle works:
  - **List**: All matches in flat list
  - **By Student**: Grouped by student, shows their matched jobs
  - **By Job**: Grouped by job, shows matched students
- ✅ Statistics calculate correctly
- ✅ Greedy algorithm respects constraints

### 4. Test Publishing Workflow

1. Review proposed matches on SendMatches page
2. Click "Publish X Matches"
3. Confirm in dialog
4. Verify:
   - ✅ Success message appears
   - ✅ Old matches are archived (`visibleToStudent=false`)
   - ✅ New matches are published (`visibleToStudent=true`)
   - ✅ Students see matches in their dashboard
   - ✅ Companies see matches in job listing dashboard

### 5. Test Job Listing Dashboard Match Display

After publishing matches:

1. Navigate to `/JobListingDashboard?id=<jobListingId>` (or click a job listing from employer dashboard)
2. Scroll to "Matched Candidates" section (appears above the Application Pipeline)
3. Verify:
   - ✅ Shows count of matched candidates in heading
   - ✅ Each match shows student name, email, university
   - ✅ Overall match score displays with color coding (green/blue/yellow/red)
   - ✅ Student name is clickable → opens `/ApplicantProfile?userId=...` in new tab
   - ✅ Eye icon button toggles match details
   - ✅ Expanded view shows all category scores with progress bars
   - ✅ Empty state appears when no matches are published
   - ✅ Loading state shows while fetching matches

**Test Different Scenarios:**
- Job listing with no matches: Should show empty state with icon and message
- Job listing with 1 match: Should display single match card
- Job listing with many matches (10+): Should display scrollable list
- Toggle multiple match details: Each should expand/collapse independently
- Click student names: Should open profiles in new tabs

## Testing Different Score Scenarios

### High-Quality Matches (Score ≥ 80)

With `minScore: 80`, you should only see excellent matches. The greedy algorithm will prioritize the best ones first.

**Test**:
```
studentLimit: 3
jobLimit: 5
minScore: 80
```

Expected: Only green matches (score 80-100) appear in proposed list.

### Inclusive Matching (Score ≥ 40)

With `minScore: 40`, you'll see a mix of fair, good, and excellent matches.

**Test**:
```
studentLimit: 5
jobLimit: 10
minScore: 40
```

Expected: Yellow, blue, and green matches appear. Students get up to 5 jobs.

### Constrained Matching

Test that constraints work correctly:

**Test**:
```
studentLimit: 1
jobLimit: 1
minScore: 0
```

Expected: Each student gets at most 1 match, each job listing gets at most 1 student.

## Decimal Value Testing

### Manual Entry Tests

1. Open AdminMatching, select a cell
2. **Slider Test**: Drag slider and observe decimal changes (e.g., 67.1, 67.2)
3. **Number Input Test**: Click in number field, type "83.7", press Enter
4. **Category Test**: Show category sliders, type "91.2" in Skills Match
5. Verify pending rating shows "83.7" not "84"

### Batch Entry Tests

1. Drag to select 5-10 cells
2. Click "Batch Rate All"
3. Enter "72.5" in prompt
4. Verify all selected cells show "72.5" with striped pattern

### AI Suggestion Tests

1. Select a cell with student-job data
2. Click "AI Suggest"
3. Wait for response
4. Verify:
   - Overall score is decimal (e.g., 76.3)
   - All category scores are decimals
   - Explanation appears in purple box
   - Values are accurate to 1 decimal place

## Edge Cases to Test

### Empty State
- Delete all matches from database
- Visit AdminMatching → should see empty grid
- Visit SendMatches → should see "No matches generated yet"

### No Viable Matches
- Set `minScore: 95` with test data
- Generate matches
- If no matches meet criteria, should see empty proposed list

### Constraint Conflicts
- Set `studentLimit: 1` and `companyLimit: 1`
- Generate matches
- Each entity gets exactly 1 match, many high-scoring matches are skipped

### Decimal Precision
- Enter "87.123456789" in number input
- Verify it rounds to 1 decimal place (87.1)
- Check database to ensure it stores as Number, not String

## Database Verification

Check that decimal values are stored correctly:

```javascript
// In MongoDB shell or Compass
db.matches.find({ overallScore: { $gte: 80 } }).forEach(m => {
  print(`Score: ${m.overallScore} (Type: ${typeof m.overallScore})`);
});
```

Expected: All scores are `number` type, not `string`.

## Performance Testing

With test data:
- Grid should load in < 2 seconds
- Drag selection should be smooth (no lag)
- Publishing 46 matches should take < 3 seconds
- Generating optimal matches should take < 1 second

## Known Limitations

1. **Slider precision**: While sliders support 0.1 steps, dragging may be imprecise. Use number input for exact values.
2. **Rounding**: All scores are rounded to 1 decimal place (e.g., 87.123 → 87.1)
3. **Grid size**: Very large grids (100+ students × 50+ jobs) may be slow. Use search to filter.

## Troubleshooting

**Issue**: Matches don't appear on AdminMatching page
- **Fix**: Check browser console for errors, verify server is running

**Issue**: Decimal values show as integers
- **Fix**: Clear browser cache, verify you're using updated code

**Issue**: Publishing fails
- **Fix**: Check that job listings have valid `companyId` references

**Issue**: "Generate Matches" returns 0 matches
- **Fix**: Lower `minScore` or check that matches exist in database

**Issue**: Links don't open in new tab
- **Fix**: Verify `target="_blank"` and `rel="noopener noreferrer"` are present

## Success Criteria

All of the following should work smoothly:

- ✅ Seed script creates complete N×M matrix (students × jobs) with varied decimal scores
- ✅ AdminMatching grid displays all matches with color coding
- ✅ Every cell in the grid has a rating (no empty cells after seeding)
- ✅ Decimal values can be entered via number inputs and sliders
- ✅ Batch rating accepts and applies decimal values
- ✅ AI suggestions generate decimal scores with explanations
- ✅ Pending workflow works (changes don't save until "Publish All")
- ✅ SendMatches page generates optimal matches using greedy algorithm
- ✅ View toggle switches between List/By Student/By Job
- ✅ Student and job links open profiles in new tabs (on SendMatches page)
- ✅ Publishing marks matches as visible to students and companies
- ✅ All decimal values persist correctly in database
- ✅ JobListingDashboard displays matched candidates with scores
- ✅ Student names on JobListingDashboard are clickable links
- ✅ Match details expand/collapse correctly on JobListingDashboard
- ✅ Empty state displays when no matches are published for a job

## Next Steps

After testing:
1. Delete test matches: Re-run seed script or manually delete via MongoDB
2. Create real matches using actual student/job data
3. Adjust constraints based on your cohort size
4. Monitor which matches lead to interviews/offers
5. Refine rating methodology based on outcomes
