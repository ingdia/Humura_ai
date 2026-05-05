const express = require('express');
const router = express.Router();
const {
  bookAppointment,
  getAppointments,
  updateAppointmentStatus,
  deleteAppointment,
  getVideoLink,
} = require('../controllers/appointmentController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
  .post(protect, bookAppointment)
  .get(protect, getAppointments);

router.route('/:id')
  .delete(protect, deleteAppointment);

router.route('/:id/status')
  .put(protect, updateAppointmentStatus);

router.route('/:id/video-link')
  .get(protect, getVideoLink);

module.exports = router;
