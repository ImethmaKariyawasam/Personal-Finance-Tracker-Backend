const express = require('express');
const { auth, isAdmin } = require('../middleware/auth');
const dashboardController = require('../controllers/dashboardController');
const router = express.Router();

// Admin dashboard
router.get('/admin', auth, isAdmin, dashboardController.getAdminDashboard);

// User dashboard
router.get('/user', auth, dashboardController.getUserDashboard);

module.exports = router;