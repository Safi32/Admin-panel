const express = require('express');
const adminController = require('../controllers/admin.controller');
const router = express.Router();

// Admin login
router.post('/login', adminController.adminLogin);

module.exports = router; 