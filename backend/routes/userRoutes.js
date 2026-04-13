const express = require('express');
const router = express.Router();
const { verifyAdminAndGetUsers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/admin-fetch', protect, verifyAdminAndGetUsers);

module.exports = router;
