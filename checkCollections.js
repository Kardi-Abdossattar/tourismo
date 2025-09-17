require('dotenv').config({ path: './backend/.env' });
const mongoose = require('mongoose');

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections in tourismo DB:', collections.map(c => c.name));
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    process.exit();
  }
})();
