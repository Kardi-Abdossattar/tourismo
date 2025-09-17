const express = require('express');
const router = express.Router();
const targetController = require('../controllers/targetController');
const auth = require('../middleware/authMiddleware');

// Public routes
router.get('/', targetController.getAllTargets);
router.get('/:id', targetController.getTargetById);

// Protected routes (admin only)
router.post('/', auth, targetController.createTarget);
router.put('/:id', auth, targetController.updateTarget);
router.delete('/:id', auth, targetController.deleteTarget);

module.exports = router;