# Bridge AI MongoDB Models - File Guide

## 📦 Two Versions Available

You now have TWO complete sets of models to choose from:

---

## ✅ **REFINED MODELS** (⭐ RECOMMENDED)

**Use these files for better data consistency and single source of truth:**

### Main Files:
- **User.refined.js** - Complete user profile with resume, projects, skills
- **Application.refined.js** - References User model, no data duplication
- **Interview.refined.js** - References Application and User models
- **index.refined.js** - Export file for refined models

### Supporting Files (No changes needed):
- **Company.js** - Company/employer model
- **JobListing.js** - Job posting model
- **Assessment.js** - Assessment/test model

### Documentation:
- **REFINED_USAGE_GUIDE.md** - How to use refined models with populate
- **SCHEMA_COMPARISON.md** - Original vs Refined comparison

---

## ⚠️ **ORIGINAL MODELS** (For reference)

**Original models with duplicated data:**

- **User.js** - Basic user model
- **Application.js** - Duplicates user data (resume, profile, etc.)
- **Interview.js** - Duplicates application data
- **index.js** - Export file for original models

### Documentation:
- **README.md** - Original usage guide
- **QUICKSTART.md** - Quick start guide

---

## 🎯 Which Should You Use?

### Use REFINED Models If:
- ✅ You want data consistency
- ✅ Users can update their profiles
- ✅ You want single source of truth
- ✅ You want to save storage
- ✅ You're building a scalable app
- **👉 THIS IS RECOMMENDED FOR BRIDGE AI**

### Use ORIGINAL Models If:
- You need point-in-time snapshots
- You never update user data
- You need extreme read performance
- You're building a simple prototype

---

## 📂 File Structure for Your Project

### Option 1: Refined Models (Recommended)

```
your-project/
├── models/
│   ├── User.js            (rename User.refined.js → User.js)
│   ├── Company.js
│   ├── JobListing.js
│   ├── Application.js     (rename Application.refined.js → Application.js)
│   ├── Assessment.js
│   ├── Interview.js       (rename Interview.refined.js → Interview.js)
│   └── index.js           (rename index.refined.js → index.js)
└── ...
```

### Option 2: Original Models

```
your-project/
├── models/
│   ├── User.js
│   ├── Company.js
│   ├── JobListing.js
│   ├── Application.js
│   ├── Assessment.js
│   ├── Interview.js
│   └── index.js
└── ...
```

---

## 🚀 Quick Setup Guide

### Step 1: Choose Your Version

**For Refined Models (Recommended):**
```bash
# Rename refined files
mv User.refined.js User.js
mv Application.refined.js Application.js
mv Interview.refined.js Interview.js
mv index.refined.js index.js
```

**For Original Models:**
```bash
# Files are already named correctly
# Just copy User.js, Application.js, Interview.js, index.js
```

### Step 2: Install Dependencies

```bash
npm install mongoose
```

### Step 3: Connect to MongoDB

```javascript
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('Error:', err));
```

### Step 4: Use the Models

**Refined Models:**
```javascript
const { User, Application } = require('./models');

// Create user with full profile
const user = await User.create({
  uid: 'user_123',
  name: 'John Doe',
  email: 'john@example.com',
  profile: { university: 'Stanford' },
  resume: { fileUrl: 'https://...' }
});

// Create application (references user)
const app = await Application.create({
  applicationId: 'app_123',
  candidateId: user._id,
  jobListingId: jobId,
  companyId: companyId
});

// Get application with candidate data
const fullApp = await Application.findById(app._id)
  .populate('candidateId', 'name email resume projects');

console.log(fullApp.candidateId.resume); // From User model
```

**Original Models:**
```javascript
const { User, Application } = require('./models');

// Create user
const user = await User.create({
  uid: 'user_123',
  name: 'John Doe',
  email: 'john@example.com',
  resume: { fileUrl: 'https://...' }
});

// Create application (duplicates user data)
const app = await Application.create({
  applicationId: 'app_123',
  candidateId: user._id,
  candidateName: user.name,
  candidateEmail: user.email,
  resume: user.resume, // Duplicated
  jobListingId: jobId,
  companyId: companyId
});

console.log(app.resume); // Directly in application
```

---

## 📖 Documentation Files

### For Refined Models:
1. **REFINED_USAGE_GUIDE.md** - Complete guide with examples
2. **SCHEMA_COMPARISON.md** - Why refined is better

### For Original Models:
1. **README.md** - Original documentation
2. **QUICKSTART.md** - Quick start guide

### For Both:
- **package.json** - NPM configuration
- **THIS FILE** - File guide and selection help

---

## 🔄 Key Differences Summary

| Feature | Original | Refined |
|---------|----------|---------|
| Resume Storage | In Application | In User (referenced) |
| Data Updates | Must update everywhere | Update once |
| Storage | More (duplicated) | Less (referenced) |
| Consistency | Risk of stale data | Always current |
| Query Method | Direct access | Use populate() |
| Complexity | Simpler queries | Slightly more complex queries |
| Recommendation | ⚠️ Basic apps | ✅ Production apps |

---

## 💡 Quick Decision

**Not sure which to use?**

Answer this question: *"Will users update their profiles (resume, projects, etc.)?"*

- **YES** → Use **REFINED Models** ✅
- **NO** → Either works, but Refined is still better for future

**For Bridge AI:** Use **REFINED Models** 🎯

---

## 📞 Need Help?

### Common Questions:

**Q: Can I mix original and refined?**
A: No, choose one approach for consistency.

**Q: Is populate() slow?**
A: No, with proper indexes it's fast. See REFINED_USAGE_GUIDE.md

**Q: Can I switch later?**
A: Yes, but requires data migration. Start with refined to avoid this.

**Q: Which files do I actually need?**
A: See "File Structure" section above - you need 7 model files total.

---

## ✅ Recommended: Refined Models

For Bridge AI, we recommend using the **REFINED models** because:

1. ✅ Users will update their profiles/resumes
2. ✅ You want consistent data across applications
3. ✅ You're building a production application
4. ✅ You want to scale efficiently
5. ✅ Single source of truth is important

**Start with refined models to avoid migration headaches later!**

---

## 📦 What's Included

### Refined Models Package:
- ✅ User.refined.js (complete profile)
- ✅ Application.refined.js (references User)
- ✅ Interview.refined.js (references Application)
- ✅ Company.js (unchanged)
- ✅ JobListing.js (unchanged)
- ✅ Assessment.js (unchanged)
- ✅ index.refined.js (exports)
- ✅ REFINED_USAGE_GUIDE.md
- ✅ SCHEMA_COMPARISON.md

### Original Models Package:
- ✅ User.js
- ✅ Application.js
- ✅ Interview.js
- ✅ Company.js
- ✅ JobListing.js
- ✅ Assessment.js
- ✅ index.js
- ✅ README.md
- ✅ QUICKSTART.md

### Bonus Files:
- ✅ package.json
- ✅ FILE_GUIDE.md (this file)

---

## 🎉 You're All Set!

1. Choose your version (refined recommended)
2. Copy files to your `models/` folder
3. Rename `.refined.js` files if using refined version
4. Follow the appropriate usage guide
5. Start building!

Good luck with Bridge AI! 🚀
