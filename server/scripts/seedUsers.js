const admin = require('../config/firebase');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Company = require('../models/Company');
const TeamMember = require('../models/TeamMember');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bridge-ai', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Student data
const students = [
  {
    firstName: 'Alex',
    lastName: 'Johnson',
    email: 'alex.johnson@student.edu',
    university: 'Stanford University',
    major: 'Computer Science',
    graduationYear: 2025,
    gpa: 3.8,
    linkedinUrl: 'https://linkedin.com/in/alexjohnson',
    githubUrl: 'https://github.com/alexjohnson',
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL']
  },
  {
    firstName: 'Sarah',
    lastName: 'Chen',
    email: 'sarah.chen@student.edu',
    university: 'MIT',
    major: 'Computer Engineering',
    graduationYear: 2024,
    gpa: 3.9,
    linkedinUrl: 'https://linkedin.com/in/sarahchen',
    githubUrl: 'https://github.com/sarahchen',
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'Java', 'C++']
  },
  {
    firstName: 'Marcus',
    lastName: 'Rodriguez',
    email: 'marcus.rodriguez@student.edu',
    university: 'UC Berkeley',
    major: 'Data Science',
    graduationYear: 2025,
    gpa: 3.7,
    linkedinUrl: 'https://linkedin.com/in/marcusrodriguez',
    githubUrl: 'https://github.com/marcusrodriguez',
    skills: ['Python', 'R', 'SQL', 'Tableau', 'Statistics']
  },
  {
    firstName: 'Emily',
    lastName: 'Watson',
    email: 'emily.watson@student.edu',
    university: 'Harvard University',
    major: 'Computer Science',
    graduationYear: 2024,
    gpa: 4.0,
    linkedinUrl: 'https://linkedin.com/in/emilywatson',
    githubUrl: 'https://github.com/emilywatson',
    skills: ['Java', 'Spring Boot', 'Kubernetes', 'Docker', 'AWS']
  },
  {
    firstName: 'David',
    lastName: 'Kim',
    email: 'david.kim@student.edu',
    university: 'Carnegie Mellon',
    major: 'Software Engineering',
    graduationYear: 2025,
    gpa: 3.85,
    linkedinUrl: 'https://linkedin.com/in/davidkim',
    githubUrl: 'https://github.com/davidkim',
    skills: ['TypeScript', 'React', 'GraphQL', 'PostgreSQL', 'Redis']
  },
  {
    firstName: 'Jessica',
    lastName: 'Patel',
    email: 'jessica.patel@student.edu',
    university: 'Georgia Tech',
    major: 'Computer Science',
    graduationYear: 2024,
    gpa: 3.75,
    linkedinUrl: 'https://linkedin.com/in/jessicapatel',
    githubUrl: 'https://github.com/jessicapatel',
    skills: ['Python', 'Django', 'React', 'PostgreSQL', 'Docker']
  },
  {
    firstName: 'Michael',
    lastName: 'Thompson',
    email: 'michael.thompson@student.edu',
    university: 'University of Washington',
    major: 'Information Systems',
    graduationYear: 2025,
    gpa: 3.6,
    linkedinUrl: 'https://linkedin.com/in/michaelthompson',
    githubUrl: 'https://github.com/michaelthompson',
    skills: ['JavaScript', 'Vue.js', 'MongoDB', 'Express', 'Node.js']
  },
  {
    firstName: 'Olivia',
    lastName: 'Martinez',
    email: 'olivia.martinez@student.edu',
    university: 'UCLA',
    major: 'Computer Science',
    graduationYear: 2024,
    gpa: 3.9,
    linkedinUrl: 'https://linkedin.com/in/oliviamartinez',
    githubUrl: 'https://github.com/oliviamartinez',
    skills: ['Go', 'Rust', 'Microservices', 'Kafka', 'Elasticsearch']
  },
  {
    firstName: 'James',
    lastName: 'Lee',
    email: 'james.lee@student.edu',
    university: 'Cornell University',
    major: 'Software Engineering',
    graduationYear: 2025,
    gpa: 3.8,
    linkedinUrl: 'https://linkedin.com/in/jameslee',
    githubUrl: 'https://github.com/jameslee',
    skills: ['C#', '.NET', 'Azure', 'SQL Server', 'Angular']
  },
  {
    firstName: 'Sophia',
    lastName: 'Anderson',
    email: 'sophia.anderson@student.edu',
    university: 'Princeton University',
    major: 'Computer Science',
    graduationYear: 2024,
    gpa: 3.95,
    linkedinUrl: 'https://linkedin.com/in/sophiaanderson',
    githubUrl: 'https://github.com/sophiaanderson',
    skills: ['Python', 'FastAPI', 'React', 'AWS', 'Terraform']
  }
];

// Employer/Company data
const employers = [
  {
    firstName: 'Jennifer',
    lastName: 'Williams',
    email: 'jennifer.williams@techcorp.com',
    company: {
      companyName: 'TechCorp Solutions',
      industry: 'Software Development',
      companySize: '501+',
      website: 'https://techcorp.com',
      description: 'Leading provider of enterprise software solutions'
    }
  },
  {
    firstName: 'Robert',
    lastName: 'Brown',
    email: 'robert.brown@innovate.io',
    company: {
      companyName: 'Innovate Labs',
      industry: 'AI/Machine Learning',
      companySize: '51-200',
      website: 'https://innovatelabs.io',
      description: 'Cutting-edge AI research and development'
    }
  },
  {
    firstName: 'Amanda',
    lastName: 'Davis',
    email: 'amanda.davis@cloudify.com',
    company: {
      companyName: 'Cloudify Inc',
      industry: 'Cloud Services',
      companySize: '501+',
      website: 'https://cloudify.com',
      description: 'Cloud infrastructure and DevOps solutions'
    }
  },
  {
    firstName: 'Christopher',
    lastName: 'Garcia',
    email: 'chris.garcia@fintech.co',
    company: {
      companyName: 'FinTech Innovations',
      industry: 'Financial Technology',
      companySize: '11-50',
      website: 'https://fintechinnovations.co',
      description: 'Revolutionary payment and banking solutions'
    }
  },
  {
    firstName: 'Michelle',
    lastName: 'Wilson',
    email: 'michelle.wilson@datastream.com',
    company: {
      companyName: 'DataStream Analytics',
      industry: 'Data Analytics',
      companySize: '51-200',
      website: 'https://datastream.com',
      description: 'Big data analytics and business intelligence'
    }
  },
  {
    firstName: 'Daniel',
    lastName: 'Moore',
    email: 'daniel.moore@cybersec.io',
    company: {
      companyName: 'CyberSecure Systems',
      industry: 'Cybersecurity',
      companySize: '501+',
      website: 'https://cybersec.io',
      description: 'Enterprise cybersecurity and threat protection'
    }
  },
  {
    firstName: 'Lisa',
    lastName: 'Taylor',
    email: 'lisa.taylor@healthtech.com',
    company: {
      companyName: 'HealthTech Solutions',
      industry: 'Healthcare Technology',
      companySize: '51-200',
      website: 'https://healthtech.com',
      description: 'Digital health and telemedicine platforms'
    }
  },
  {
    firstName: 'Kevin',
    lastName: 'Anderson',
    email: 'kevin.anderson@gamestudio.com',
    company: {
      companyName: 'GameStudio Interactive',
      industry: 'Gaming',
      companySize: '11-50',
      website: 'https://gamestudio.com',
      description: 'Mobile and console game development'
    }
  },
  {
    firstName: 'Rachel',
    lastName: 'Thomas',
    email: 'rachel.thomas@ecommerce.io',
    company: {
      companyName: 'E-Commerce Plus',
      industry: 'E-Commerce',
      companySize: '501+',
      website: 'https://ecommerceplus.io',
      description: 'Next-generation online marketplace platform'
    }
  },
  {
    firstName: 'Brian',
    lastName: 'Jackson',
    email: 'brian.jackson@robotics.com',
    company: {
      companyName: 'Robotics Frontier',
      industry: 'Robotics/Automation',
      companySize: '201-500',
      website: 'https://roboticsfrontier.com',
      description: 'Advanced robotics and automation solutions'
    }
  }
];

const defaultPassword = 'Password123!';

async function createStudent(studentData) {
  try {
    // Create Firebase user
    const firebaseUser = await admin.auth().createUser({
      email: studentData.email,
      password: defaultPassword,
      displayName: `${studentData.firstName} ${studentData.lastName}`,
      emailVerified: true
    });

    console.log(`✅ Created Firebase student: ${studentData.email}`);

    // Hash password for MongoDB
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // Create MongoDB user
    const mongoUser = new User({
      uid: firebaseUser.uid,
      name: `${studentData.firstName} ${studentData.lastName}`,
      firstName: studentData.firstName,
      lastName: studentData.lastName,
      email: studentData.email,
      password: hashedPassword,
      authProvider: 'email',
      university: studentData.university,
      linkedinUrl: studentData.linkedinUrl,
      githubUrl: studentData.githubUrl,
      education: [{
        institution: studentData.university,
        degree: `Bachelor's in ${studentData.major}`,
        fieldOfStudy: studentData.major,
        startDate: new Date(studentData.graduationYear - 4, 8, 1),
        endDate: new Date(studentData.graduationYear, 5, 1),
        grade: studentData.gpa.toString(),
        isCurrent: studentData.graduationYear >= new Date().getFullYear()
      }],
      skills: studentData.skills.map(skill => ({
        skillName: skill,
        proficiencyLevel: 'Intermediate',
        yearsOfExperience: Math.floor(Math.random() * 3) + 1
      })),
      onboardingCompleted: true,
      profileCompleteness: 85,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await mongoUser.save();
    console.log(`✅ Created MongoDB student: ${studentData.email}`);

    return { firebase: firebaseUser, mongo: mongoUser };
  } catch (error) {
    console.error(`❌ Error creating student ${studentData.email}:`, error.message);
    return null;
  }
}

async function createEmployer(employerData) {
  try {
    // Create Firebase user
    const firebaseUser = await admin.auth().createUser({
      email: employerData.email,
      password: defaultPassword,
      displayName: `${employerData.firstName} ${employerData.lastName}`,
      emailVerified: true
    });

    console.log(`✅ Created Firebase employer: ${employerData.email}`);

    // Create Company in MongoDB
    const companyId = `company_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const company = new Company({
      companyId: companyId,
      companyName: employerData.company.companyName,
      companyWebsite: employerData.company.website,
      companyDescription: employerData.company.description,
      industry: employerData.company.industry,
      companySize: employerData.company.companySize,
      foundedYear: new Date().getFullYear() - Math.floor(Math.random() * 10) - 5,
      isActive: true,
      onboardingCompleted: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await company.save();
    console.log(`✅ Created Company: ${company.companyName}`);

    // Hash password
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // Create TeamMember in MongoDB
    const teamMember = new TeamMember({
      uid: firebaseUser.uid,
      email: employerData.email,
      password: hashedPassword,
      firstName: employerData.firstName,
      lastName: employerData.lastName,
      companyId: company._id,
      role: 'admin',
      permissions: ['manage_team', 'manage_jobs', 'view_applications', 'manage_assessments'],
      isActive: true,
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await teamMember.save();
    console.log(`✅ Created TeamMember: ${employerData.email}`);

    return { firebase: firebaseUser, company: company, teamMember: teamMember };
  } catch (error) {
    console.error(`❌ Error creating employer ${employerData.email}:`, error.message);
    return null;
  }
}

async function seedDatabase() {
  console.log('\n🌱 Starting database seeding...\n');
  console.log('='.repeat(60));

  const createdStudents = [];
  const createdEmployers = [];

  // Create students
  console.log('\n📚 Creating Students...\n');
  for (const studentData of students) {
    const result = await createStudent(studentData);
    if (result) {
      createdStudents.push({
        email: studentData.email,
        password: defaultPassword,
        name: `${studentData.firstName} ${studentData.lastName}`,
        university: studentData.university,
        uid: result.firebase.uid
      });
    }
  }

  // Create employers
  console.log('\n🏢 Creating Employers...\n');
  for (const employerData of employers) {
    const result = await createEmployer(employerData);
    if (result) {
      createdEmployers.push({
        email: employerData.email,
        password: defaultPassword,
        name: `${employerData.firstName} ${employerData.lastName}`,
        company: employerData.company.companyName,
        uid: result.firebase.uid
      });
    }
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('\n✨ Database Seeding Complete!\n');
  console.log('='.repeat(60));

  console.log('\n📚 STUDENTS (10 total):');
  console.log('='.repeat(60));
  createdStudents.forEach((student, i) => {
    console.log(`\n${i + 1}. ${student.name}`);
    console.log(`   Email: ${student.email}`);
    console.log(`   Password: ${student.password}`);
    console.log(`   University: ${student.university}`);
    console.log(`   Firebase UID: ${student.uid}`);
  });

  console.log('\n\n🏢 EMPLOYERS (10 total):');
  console.log('='.repeat(60));
  createdEmployers.forEach((employer, i) => {
    console.log(`\n${i + 1}. ${employer.name}`);
    console.log(`   Email: ${employer.email}`);
    console.log(`   Password: ${employer.password}`);
    console.log(`   Company: ${employer.company}`);
    console.log(`   Firebase UID: ${employer.uid}`);
  });

  console.log('\n' + '='.repeat(60));
  console.log('\n📝 Summary:');
  console.log(`   Students created: ${createdStudents.length}/10`);
  console.log(`   Employers created: ${createdEmployers.length}/10`);
  console.log(`   Default password for all users: ${defaultPassword}`);
  console.log('\n' + '='.repeat(60) + '\n');

  // Close connections
  await mongoose.connection.close();
  process.exit(0);
}

// Run the seed function
seedDatabase().catch(error => {
  console.error('\n❌ Fatal error during seeding:', error);
  process.exit(1);
});
