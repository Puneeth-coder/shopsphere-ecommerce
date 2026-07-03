const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel');

dotenv.config();

const emailToMakeAdmin = process.argv[2];

if (!emailToMakeAdmin) {
  console.log("❌ Please provide an email address.");
  console.log("Usage: node make-admin.js <email>");
  process.exit(1);
}

const run = async () => {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
    await mongoose.connect(uri);
    console.log("🔌 Connected to database...");

    const normalizedEmail = emailToMakeAdmin.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      console.log(`❌ User not found with email: ${normalizedEmail}`);
      process.exit(1);
    }

    user.role = 'admin';
    await user.save();

    console.log(`✅ Success! User "${user.name}" (${normalizedEmail}) has been granted ADMIN role.`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Failed to update user role:", err.message);
    process.exit(1);
  }
};

run();
