const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const resetAdminPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const admin = await User.findOne({ username: 'admin' });
    if (!admin) {
      console.log('Admin user not found');
      return process.exit();
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);
    admin.password = hashedPassword;
    await admin.save();

    console.log('Admin password reset to: admin123');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

resetAdminPassword();
