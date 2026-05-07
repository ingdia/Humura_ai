const express = require('express');
const router = express.Router();
const {
  logMood,
  getMoodHistory,
  getMoodTrends,
} = require('../controllers/moodController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/log', protect, logMood);
router.get('/history', protect, getMoodHistory);
router.get('/trends', protect, getMoodTrends);

module.exports = router;
