const express = require('express');
const router = express.Router();
const {
  getCourses,
  getLessons,
  getHealthCenters,
} = require('../controllers/resourceController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/courses', protect, getCourses);
router.get('/courses/:id/lessons', protect, getLessons);
router.get('/health-centers', protect, getHealthCenters);

module.exports = router;
