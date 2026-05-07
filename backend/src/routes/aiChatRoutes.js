const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getHistory,
  deleteHistory,
} = require('../controllers/aiChatController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/message', protect, sendMessage);
router.route('/history')
  .get(protect, getHistory)
  .delete(protect, deleteHistory);

module.exports = router;
