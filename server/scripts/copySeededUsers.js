const mongoose = require('mongoose');
const User = require('../models/User');
const Company = require('../models/Company');
const TeamMember = require('../models/TeamMember');
require('dotenv').config();

async function copyUsers() {
  try {
    // Connect to source database (bridge-ai)
    const sourceConn = await mongoose.createConnection('mongodb://localhost:27017/bridge-ai');
    console.log('✅ Connected to source database (bridge-ai)');

    // Connect to target database (bridge-db from env)
    const targetConn = await mongoose.createConnection(process.env.MONGODB_URI);
    console.log('✅ Connected to target database:', process.env.MONGODB_URI);

    // Get models from both connections
    const SourceUser = sourceConn.model('User', User.schema);
    const SourceCompany = sourceConn.model('Company', Company.schema);
    const SourceTeamMember = sourceConn.model('TeamMember', TeamMember.schema);

    const TargetUser = targetConn.model('User', User.schema);
    const TargetCompany = targetConn.model('Company', Company.schema);
    const TargetTeamMember = targetConn.model('TeamMember', TeamMember.schema);

    // Copy students (Users)
    const sourceUsers = await SourceUser.find({ email: /@student\.edu$/ });
    console.log(`\nFound ${sourceUsers.length} students in source database`);

    for (const user of sourceUsers) {
      const existing = await TargetUser.findOne({ email: user.email });
      if (!existing) {
        const newUser = new TargetUser(user.toObject());
        delete newUser._id; // Let MongoDB generate new ID
        await newUser.save();
        console.log(`✅ Copied student: ${user.email}`);
      } else {
        console.log(`⏭️  Student already exists: ${user.email}`);
      }
    }

    // Copy companies
    const sourceCompanies = await SourceCompany.find({});
    console.log(`\nFound ${sourceCompanies.length} companies in source database`);

    for (const company of sourceCompanies) {
      const existing = await TargetCompany.findOne({ companyId: company.companyId });
      if (!existing) {
        const newCompany = new TargetCompany(company.toObject());
        delete newCompany._id;
        await newCompany.save();
        console.log(`✅ Copied company: ${company.companyName}`);
      } else {
        console.log(`⏭️  Company already exists: ${company.companyName}`);
      }
    }

    // Copy team members
    const sourceTeamMembers = await SourceTeamMember.find({});
    console.log(`\nFound ${sourceTeamMembers.length} team members in source database`);

    for (const tm of sourceTeamMembers) {
      const existing = await TargetTeamMember.findOne({ uid: tm.uid });
      if (!existing) {
        // Find the corresponding company in target database
        const sourceCompany = await SourceCompany.findById(tm.companyId);
        if (sourceCompany) {
          const targetCompany = await TargetCompany.findOne({ companyId: sourceCompany.companyId });
          if (targetCompany) {
            const newTM = new TargetTeamMember(tm.toObject());
            delete newTM._id;
            newTM.companyId = targetCompany._id; // Update to new company ID
            await newTM.save();
            console.log(`✅ Copied team member: ${tm.email}`);
          }
        }
      } else {
        console.log(`⏭️  Team member already exists: ${tm.email}`);
      }
    }

    console.log('\n✨ Copy complete!');

    await sourceConn.close();
    await targetConn.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

copyUsers();
