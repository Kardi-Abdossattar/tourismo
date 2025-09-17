const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/authMiddleware');

// Public routes
router.post('/', bookingController.createBooking);

// Protected routes (admin only)
router.get('/', auth, bookingController.getAllBookings);
router.get('/:id', auth, bookingController.getBookingById);
router.put('/:id', auth, bookingController.updateBooking);
router.delete('/:id', auth, bookingController.deleteBooking);

module.exports = router;