const express = require('express');
const userController = require('../controllers/user.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

// Simple public route to get all users
router.get('/', userController.getUsers);

// Route to get total referrals
router.get('/total-referrals', userController.getTotalReferrals);

// Ban user (Super Admin only)
router.post('/:id/ban', protect, authorize('superadmin'), userController.banUser);
// Unban user (Super Admin only)
router.post('/:id/unban', protect, authorize('superadmin'), userController.unbanUser);
// Manual coin transfer (Super Admin only)
router.post('/:id/coin-transfer', protect, authorize('superadmin'), userController.manualCoinTransfer);

module.exports = router; 