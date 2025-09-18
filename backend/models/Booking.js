const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Target',
    required: true
  },
  guestName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  walletAddress: {
    type: String,
    required: true,
    trim: true
  },
  txHash: {
    type: String,
    required: true,
    unique: true
  },
  bookingId: {
    type: Number,
    required: false,
    index: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: Date,
    default: Date.now
  },
  checkIn: {
    type: Date
  },
  checkOut: {
    type: Date
  },
  paid: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'confirmed'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);