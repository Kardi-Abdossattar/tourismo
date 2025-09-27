const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Found' : 'Not found');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // List all collections to verify connection
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    // Check if bookings collection exists and count documents
    if (collections.some(c => c.name === 'bookings')) {
      const count = await mongoose.connection.db.collection('bookings').countDocuments();
      console.log(`Found ${count} bookings in the database`);
    } else {
      console.log('Bookings collection does not exist yet');
    }
    
  } catch (error) {
    console.error('Database connection failed:', error.message);
    console.error('Error details:', error);
    process.exit(1);
  }
};

module.exports = connectDB;