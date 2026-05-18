const express = require('express');
const router = express.Router();
const clinicsController = require('../controllers/clinicsController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, clinicsController.getAllClinics);
router.get('/nearby', protect, clinicsController.getNearbyClinics);
router.get('/:id', protect, clinicsController.getClinicDetails);
router.get('/:id/specialists', protect, clinicsController.getClinicSpecialists);
router.post('/register', protect, clinicsController.registerClinic);
router.put('/:id/approve', protect, clinicsController.approveClinic); // Admin only ideal

module.exports = router;
