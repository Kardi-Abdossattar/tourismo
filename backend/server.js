const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Import routes
const targetRoutes = require('./routes/targetRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const authRoutes = require('./routes/authRoutes');
const pageRoutes = require('./routes/pageRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS with credentials and allowed origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  // Add other allowed origins as needed
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, // This is important for cookies, authorization headers, etc.
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar']
};

// Apply CORS with options
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Parse JSON bodies
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tourismo', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.use('/api/targets', targetRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/upload', uploadRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Tourismo API is running' });
});

// Error handling middleware
app.use(errorHandler);

// Create default admin user
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const Page = require('./models/Page');

const createDefaultAdmin = async () => {
  try {
    // Wait for MongoDB connection before creating admin
    if (mongoose.connection.readyState !== 1) {
      console.log('Waiting for MongoDB connection...');
      return;
    }
    
    const existingAdmin = await User.findOne({ username: 'admin' });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = new User({
        username: 'admin',
        password: hashedPassword,
        role: 'admin'
      });
      await admin.save();
      console.log('Default admin user created: admin/admin123');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  };
}

const createDefaultPages = async () => {
  try {
    if (mongoose.connection.readyState !== 1) return;

    const defaults = [
      {
        slug: 'about',
        title: 'About Tourismo',
        content:
          'Tourismo is your gateway to discovering breathtaking destinations around the world. We combine modern web technologies with crypto payments to make travel simple and secure.',
      },
      {
        slug: 'contact',
        title: 'Contact Us',
        content:
          'Have questions or feedback? Reach out to our support team at support@tourismo.example and we\'ll be happy to help.',
      },
    ];

    for (const p of defaults) {
      const existing = await Page.findOne({ slug: p.slug });
      if (!existing) {
        await Page.create(p);
        console.log(`Seeded default page: ${p.slug}`);
      }
    }
  } catch (error) {
    console.error('Error creating default pages:', error);
  }
};

// Create admin user after MongoDB connection is established
mongoose.connection.once('open', () => {
  console.log('MongoDB connection established');
  createDefaultAdmin();
  createDefaultPages();
});
// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  createDefaultAdmin();
  createDefaultPages();
});