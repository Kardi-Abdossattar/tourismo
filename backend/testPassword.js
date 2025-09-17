require('dotenv').config({ path: './.env' }); // make sure path points to backend/.env
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

(async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get the admin user directly from the 'users' collection
    const user = await mongoose.connection.db
      .collection('users')
      .findOne({ username: 'admin' });

    if (!user) {
      console.log('❌ Admin user not found');
      return;
    }

    console.log('DB password hash:', user.password);

    // Test the password
    const plainPassword = 'yourpassword'; // <-- put the password you want to test here
    const isMatch = await bcrypt.compare(plainPassword, user.password);

    console.log('Password matches?', isMatch);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit();
  }
})();
