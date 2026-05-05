const express = require('express');
const router = express.Router();
const {
  triggerEscalation,
  getEmergencyResources,
} = require('../controllers/escalateController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, triggerEscalation);
router.get('/resources/emergency', getEmergencyResources);

module.exports = router;
