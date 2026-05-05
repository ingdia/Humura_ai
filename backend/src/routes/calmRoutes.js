const express = require('express');
const router = express.Router();
const {
  getScenes,
  startSession,
  endSession,
} = require('../controllers/calmController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/scenes', protect, getScenes);
router.post('/session/start', protect, startSession);
router.post('/session/end', protect, endSession);

module.exports = router;
