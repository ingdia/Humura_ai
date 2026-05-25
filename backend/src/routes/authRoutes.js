const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, registerAnonymous, loginAnonymous } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/anonymous', registerAnonymous);
router.post('/anonymous-login', loginAnonymous);
router.get('/me', protect, getMe);

module.exports = router;
