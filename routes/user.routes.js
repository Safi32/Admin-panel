const express = require('express');
const userController = require('../controllers/user.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', userController.getUsers);
router.get('/total-referrals', userController.getTotalReferrals);
router.post('/:id/ban', protect, authorize('superadmin'), userController.banUser);
router.post('/:id/unban', protect, authorize('superadmin'), userController.unbanUser);
router.post('/:id/coin-transfer', protect, authorize('superadmin'), userController.manualCoinTransfer);
router.post('/change-password', protect, userController.changePassword);
router.get('/profile', protect, userController.getProfile);
router.put('/profile', protect, userController.updateProfile);

module.exports = router; 