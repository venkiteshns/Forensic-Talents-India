require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/forensic_talents';

const SEED_ADMIN = {
  name:     'Arun Kumar',
  email:    'adminarunforensic@talents.com', // stored lowercase
  password: 'Admin123@Arun',
};

async function seedAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Check if admin already exists
    const existing = await Admin.findOne({ email: SEED_ADMIN.email });
    if (existing) {
      console.log('ℹ️  Admin already exists — skipping seed.');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(SEED_ADMIN.password, 10);

    const admin = new Admin({
      name:     SEED_ADMIN.name,
      email:    SEED_ADMIN.email,
      password: hashedPassword,
    });

    await admin.save();
    console.log(`✅ Admin seeded successfully:`);
    console.log(`   Name  : ${admin.name}`);
    console.log(`   Email : ${admin.email}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seedAdmin();
