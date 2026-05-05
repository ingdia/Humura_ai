const express = require('express');
const router = express.Router();
const {
  getPsychologists,
  getPsychologistById,
  updateAvailability,
  approvePsychologist,
} = require('../controllers/psychologistController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.route('/')
  .get(getPsychologists);

router.route('/:id')
  .get(getPsychologistById);

router.route('/:id/availability')
  .put(protect, authorize('PSYCHOLOGIST'), updateAvailability);

router.route('/:id/approve')
  .put(protect, authorize('ADMIN'), approvePsychologist);

module.exports = router;
