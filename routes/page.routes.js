const express = require('express');
const pageController = require('../controllers/page.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/', protect, authorize('superadmin', 'editor'), pageController.addPage);
router.get('/', pageController.getPages);
router.get('/:slug', pageController.getPageBySlug);
router.put('/:id', protect, authorize('superadmin', 'editor'), pageController.updatePage);
router.delete('/:id', protect, authorize('superadmin', 'editor'), pageController.deletePage);

module.exports = router; 