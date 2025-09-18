const { ethers } = require('ethers');
const { getPaymentStatus } = require('../config/blockchain');

// POST /api/payment/create
// Body: { bookingId: number, amountEth: string }
// Returns: { to, data, valueWei }
exports.createPayment = async (req, res) => {
  try {
    const { bookingId, amountEth } = req.body;
    if (!bookingId || typeof bookingId !== 'number') {
      return res.status(400).json({ message: 'bookingId (number) is required' });
    }
    if (!amountEth) {
      return res.status(400).json({ message: 'amountEth is required' });
    }

    const valueWei = ethers.parseEther(String(amountEth)).toString();

    const contractAddress = process.env.CONTRACT_ADDRESS;
    if (!contractAddress) {
      return res.status(500).json({ message: 'CONTRACT_ADDRESS not configured' });
    }

    // Encode function call data for payReservation(uint256)
    const iface = new ethers.Interface([
      'function payReservation(uint256 bookingId) payable',
    ]);
    const data = iface.encodeFunctionData('payReservation', [bookingId]);

    return res.json({ to: contractAddress, data, valueWei });
  } catch (err) {
    console.error('createPayment error:', err);
    return res.status(500).json({ message: 'Failed to create payment payload' });
  }
};

// GET /api/payment/status/:bookingId
exports.getStatus = async (req, res) => {
  try {
    const bookingId = Number(req.params.bookingId);
    if (Number.isNaN(bookingId)) {
      return res.status(400).json({ message: 'Invalid bookingId' });
    }

    const status = await getPaymentStatus(bookingId);
    return res.json(status);
  } catch (err) {
    console.error('getStatus error:', err);
    return res.status(500).json({ message: 'Failed to fetch payment status' });
  }
};
