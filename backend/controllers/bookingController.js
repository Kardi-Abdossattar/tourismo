const Booking = require('../models/Booking');
const Target = require('../models/Target');

// Create new booking
exports.createBooking = async (req, res) => {
  try {
    const { targetId, guestName, email, walletAddress, txHash, amount, checkIn, checkOut } = req.body;

    // Verify target exists
    const target = await Target.findById(targetId);
    if (!target) {
      return res.status(404).json({ message: 'Target not found' });
    }

    // Check if transaction hash already exists
    const existingBooking = await Booking.findOne({ txHash });
    if (existingBooking) {
      return res.status(400).json({ message: 'Transaction already processed' });
    }

    const newBooking = new Booking({
      targetId,
      guestName,
      email,
      walletAddress,
      txHash,
      amount,
      checkIn: checkIn ? new Date(checkIn) : undefined,
      checkOut: checkOut ? new Date(checkOut) : undefined
    });

    const savedBooking = await newBooking.save();
    
    // Populate target details
    await savedBooking.populate('targetId');
    
    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(400).json({ message: 'Error creating booking', error: error.message });
  }
};

// Get all bookings (admin only)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('targetId')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('targetId');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking', error: error.message });
  }
};

// Update booking
exports.updateBooking = async (req, res) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('targetId');

    if (!updatedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(updatedBooking);
  } catch (error) {
    res.status(400).json({ message: 'Error updating booking', error: error.message });
  }
};

// Delete booking
exports.deleteBooking = async (req, res) => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
    
    if (!deletedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting booking', error: error.message });
  }
};