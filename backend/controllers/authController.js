const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

// User Login with credentials
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide both username and password' });
    }

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token with user data
    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        email: user.email
      },
      message: 'Login successful'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Register (for creating additional admin users)
exports.register = async (req, res) => {
  try {
    const { username, password, role = 'user' } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const newUser = new User({
      username,
      password,
      role
    });

    const savedUser = await newUser.save();

    // Generate token
    const token = generateToken(savedUser._id);

    res.status(201).json({
      token,
      user: {
        id: savedUser._id,
        username: savedUser.username,
        role: savedUser.role
      }
    });
  } catch (error) {
    res.status(400).json({ message: 'Error creating user', error: error.message });
  }
};