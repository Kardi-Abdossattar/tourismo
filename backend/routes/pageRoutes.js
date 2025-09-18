const express = require('express');
const router = express.Router();
const { getPageBySlug, updatePageBySlug } = require('../controllers/pageController');
const auth = require('../middleware/authMiddleware');

// Public: Get page by slug
router.get('/:slug', getPageBySlug);

// Admin only: Update page by slug
router.put('/:slug', auth, updatePageBySlug);

module.exports = router;
