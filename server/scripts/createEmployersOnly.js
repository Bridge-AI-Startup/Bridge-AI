const admin = require('../config/firebase');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Company = require('../models/Company');
const TeamMember = require('../models/TeamMember');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bridge-ai', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const defaultPassword = 'Password123!';

// Employer emails that already exist in Firebase
const employerEmails = [
  'jennifer.williams@techcorp.com',
  'robert.brown@innovate.io',
  'amanda.davis@cloudify.com',
  'chris.garcia@fintech.co',
  'michelle.wilson@datastream.com',
  'daniel.moore@cybersec.io',
  'lisa.taylor@healthtech.com',
  'kevin.anderson@gamestudio.com',
  'rachel.thomas@ecommerce.io',
  'brian.jackson@robotics.com'
];

const companies = [
  {
    name: 'TechCorp Solutions',
    industry: 'Software Development',
    size: '501+',
    website: 'https://techcorp.com',
    description: 'Leading provider of enterprise software solutions'
  },
  {
    name: 'Innovate Labs',
    industry: 'AI/Machine Learning',
    size: '51-200',
    website: 'https://innovatelabs.io',
    description: 'Cutting-edge AI research and development'
  },
  {
    name: 'Cloudify Inc',
    industry: 'Cloud Services',
    size: '501+',
    website: 'https://cloudify.com',
    description: 'Cloud infrastructure and DevOps solutions'
  },
  {
    name: 'FinTech Innovations',
    industry: 'Financial Technology',
    size: '11-50',
    website: 'https://fintechinnovations.co',
    description: 'Revolutionary payment and banking solutions'
  },
  {
    name: 'DataStream Analytics',
    industry: 'Data Analytics',
    size: '51-200',
    website: 'https://datastream.com',
    description: 'Big data analytics and business intelligence'
  },
  {
    name: 'CyberSecure Systems',
    industry: 'Cybersecurity',
    size: '501+',
    website: 'https://cybersec.io',
    description: 'Enterprise cybersecurity and threat protection'
  },
  {
    name: 'HealthTech Solutions',
    industry: 'Healthcare Technology',
    size: '51-200',
    website: 'https://healthtech.com',
    description: 'Digital health and telemedicine platforms'
  },
  {
    name: 'GameStudio Interactive',
    industry: 'Gaming',
    size: '11-50',
    website: 'https://gamestudio.com',
    description: 'Mobile and console game development'
  },
  {
    name: 'E-Commerce Plus',
    industry: 'E-Commerce',
    size: '501+',
    website: 'https://ecommerceplus.io',
    description: 'Next-generation online marketplace platform'
  },
  {
    name: 'Robotics Frontier',
    industry: 'Robotics/Automation',
    size: '201-500',
    website: 'https://roboticsfrontier.com',
    description: 'Advanced robotics and automation solutions'
  }
];

async function createEmployerRecords() {
  console.log('\n🌱 Creating Employer MongoDB Records...\n');
  console.log('='.repeat(60));

  const createdEmployers = [];

  for (let i = 0; i < employerEmails.length; i++) {
    const email = employerEmails[i];
    const companyData = companies[i];

    try {
      // Get Firebase user by email
      const firebaseUser = await admin.auth().getUserByEmail(email);
      const [firstName, lastName] = firebaseUser.displayName.split(' ');

      console.log(`\n✅ Found Firebase user: ${email}`);

      // Create Company
      const companyId = `company_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const company = new Company({
        companyId: companyId,
        companyName: companyData.name,
        companyWebsite: companyData.website,
        companyDescription: companyData.description,
        industry: companyData.industry,
        companySize: companyData.size,
        foundedYear: new Date().getFullYear() - Math.floor(Math.random() * 10) - 5,
        isActive: true,
        onboardingCompleted: true
      });

      await company.save();
      console.log(`✅ Created Company: ${company.companyName}`);

      // Hash password
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);

      // Create TeamMember
      const teamMember = new TeamMember({
        uid: firebaseUser.uid,
        email: email,
        password: hashedPassword,
        firstName: firstName,
        lastName: lastName,
        companyId: company._id,
        role: 'admin',
        permissions: ['manage_team', 'manage_jobs', 'view_applications', 'manage_assessments'],
        isActive: true,
        emailVerified: true
      });

      await teamMember.save();
      console.log(`✅ Created TeamMember: ${email}`);

      createdEmployers.push({
        email: email,
        password: defaultPassword,
        name: firebaseUser.displayName,
        company: companyData.name,
        uid: firebaseUser.uid
      });

    } catch (error) {
      console.error(`❌ Error creating employer records for ${email}:`, error.message);
    }
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('\n✨ Employer Creation Complete!\n');
  console.log('='.repeat(60));

  console.log('\n🏢 EMPLOYERS (10 total):');
  console.log('='.repeat(60));
  createdEmployers.forEach((employer, i) => {
    console.log(`\n${i + 1}. ${employer.name}`);
    console.log(`   Email: ${employer.email}`);
    console.log(`   Password: ${employer.password}`);
    console.log(`   Company: ${employer.company}`);
    console.log(`   Firebase UID: ${employer.uid}`);
  });

  console.log('\n' + '='.repeat(60));
  console.log(`\n📝 Employers created: ${createdEmployers.length}/10`);
  console.log(`   Default password: ${defaultPassword}`);
  console.log('\n' + '='.repeat(60) + '\n');

  // Close connections
  await mongoose.connection.close();
  process.exit(0);
}

// Run the function
createEmployerRecords().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
