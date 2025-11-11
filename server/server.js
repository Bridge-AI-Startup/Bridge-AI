const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/database');
const { Company } = require('./models');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Hiring Platform API' });
});

// Test route - Create a company
app.post('/api/companies', async (req, res) => {
  try {
    const company = await Company.create({
      companyId: `comp_${Date.now()}`,
      companyName: req.body.name,
      companyWebsite: req.body.website,
      industry: req.body.industry
    });
    res.status(201).json(company);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Import routes here
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/waitlist', require('./routes/waitlistRoutes'));
app.use('/api/onboarding', require('./routes/onboardingRoutes'));
app.use('/api/employer-onboarding', require('./routes/employerOnboardingRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
