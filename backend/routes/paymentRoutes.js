const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Create payment payload for MetaMask/ethers.js
router.post('/create', paymentController.createPayment);

// Get payment status from blockchain
router.get('/status/:bookingId', paymentController.getStatus);

module.exports = router;
