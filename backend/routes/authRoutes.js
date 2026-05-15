const express = require('express');
const router = express.Router();
const { register, login, googleLogin, getMe, updateProfile, changePassword, logout } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.get('/logout', protect, logout);

module.exports = router;
