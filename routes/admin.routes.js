const express = require('express');
const adminController = require('../controllers/admin.controller');
const router = express.Router();

// Admin register
router.post('/register', adminController.adminRegister);
// Admin login
router.post('/login', adminController.adminLogin);

module.exports = router; 