const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messagesController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, messagesController.sendMessage);
router.get('/inbox', protect, messagesController.getInbox);
router.get('/unread/count', protect, messagesController.getUnreadCount);
router.get('/:specialistId', protect, messagesController.getThread);
router.put('/:id/read', protect, messagesController.markAsRead);

module.exports = router;
