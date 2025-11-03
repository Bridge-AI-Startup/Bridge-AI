# Quick Start Guide - Bridge AI Models

## Step 1: Install Dependencies

```bash
npm install mongoose
```

## Step 2: Setup MongoDB Connection

Create a file `config/database.js`:

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
```

## Step 3: Setup Environment Variables

Create `.env` file:

```
MONGODB_URI=mongodb://localhost:27017/bridge-ai
PORT=5000
JWT_SECRET=your-secret-key
```

## Step 4: Initialize in Server

In your `server.js`:

```javascript
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/companies', require('./routes/companies'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/applications', require('./routes/applications'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

## Step 5: Create Your First Route

Example route file `routes/users.js`:

```javascript
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create new user
router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT update user
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
```

## Step 6: Folder Structure

```
bridge-ai/
├── config/
│   └── database.js
├── models/
│   ├── User.js
│   ├── Company.js
│   ├── JobListing.js
│   ├── Application.js
│   ├── Assessment.js
│   ├── Interview.js
│   └── index.js
├── routes/
│   ├── users.js
│   ├── companies.js
│   ├── jobs.js
│   └── applications.js
├── controllers/
│   └── (optional - for business logic)
├── middleware/
│   └── auth.js
├── .env
├── .gitignore
├── package.json
└── server.js
```

## Step 7: Test with Postman or Thunder Client

### Create a User
```
POST http://localhost:5000/api/users
Content-Type: application/json

{
  "uid": "user_123",
  "name": "John Doe",
  "email": "john@example.com",
  "university": "Stanford University",
  "jobPreferences": {
    "companyStage": "growing",
    "industries": ["ai_ml", "saas"],
    "workStyle": "remote"
  }
}
```

### Create a Company
```
POST http://localhost:5000/api/companies
Content-Type: application/json

{
  "employerId": "emp_123",
  "email": "hiring@startup.com",
  "companyName": "Tech Startup Inc",
  "industry": "ai_ml",
  "companySize": "11-50"
}
```

## Common Issues & Solutions

### Issue 1: Connection Refused
**Solution**: Make sure MongoDB is running
```bash
# For local MongoDB
mongod --dbpath /path/to/data

# Or start MongoDB service
sudo service mongod start
```

### Issue 2: Validation Error
**Solution**: Check that all required fields are provided and enum values are valid

### Issue 3: Duplicate Key Error (E11000)
**Solution**: The unique field (email, uid, etc.) already exists in the database

## Next Steps

1. Add authentication middleware
2. Implement file upload for resumes/documents
3. Add AI matching logic
4. Create frontend React components
5. Set up email notifications
6. Implement real-time updates with Socket.io

## Useful Mongoose Methods

```javascript
// Find
Model.find({ field: value })
Model.findOne({ field: value })
Model.findById(id)

// Create
Model.create({ data })
new Model({ data }).save()

// Update
Model.findByIdAndUpdate(id, update, { new: true })
Model.updateOne({ filter }, update)
Model.updateMany({ filter }, update)

// Delete
Model.findByIdAndDelete(id)
Model.deleteOne({ filter })
Model.deleteMany({ filter })

// Populate (join)
Model.find().populate('relationField')

// Aggregation
Model.aggregate([...pipeline])
```

## Resources

- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
