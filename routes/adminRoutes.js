const express = require('express');
const { auth, isAdmin } = require('../middleware/auth'); // Import both auth and isAdmin middleware
const adminController = require('../controllers/adminController');
const router = express.Router();

// Protect all admin routes with both auth and isAdmin middleware
router.get('/users', auth, isAdmin, adminController.getAllUsers);
router.get('/goals', auth, isAdmin, adminController.getAllGoals);
router.delete('/users/:id', auth, isAdmin, adminController.deleteUser);

module.exports = router;