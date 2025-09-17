require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User'); // use correct relative path

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const newPassword = 'Admin123!'; // <-- put your new desired password here
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const result = await User.findOneAndUpdate(
      { username: 'admin' },
      { password: hashedPassword },
      { new: true }
    );

    if (!result) {
      console.log('❌ Admin user not found');
    } else {
      console.log('✅ Admin password updated successfully');
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit();
  }
})();
