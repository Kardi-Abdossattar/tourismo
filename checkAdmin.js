require('dotenv').config({ path: './backend/.env' });
const mongoose = require('mongoose');

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const admin = await mongoose.connection.db
      .collection('users')
      .findOne({ username: 'admin' });

    console.log('Admin user:', admin);
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    process.exit();
  }
})();
