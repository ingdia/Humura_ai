const express = require('express');
const router = express.Router();
const {
  logCalmSession,
  getMyCalmHistory,
} = require('../controllers/calmController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/sessions', protect, logCalmSession);
router.get('/my', protect, getMyCalmHistory);

module.exports = router;
