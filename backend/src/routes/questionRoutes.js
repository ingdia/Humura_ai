const express = require('express');
const router = express.Router();
const {
  getProfessionals,
  submitQuestion,
  getMyQuestions,
  answerQuestion,
} = require('../controllers/questionController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/professionals', protect, getProfessionals);
router.post('/', protect, submitQuestion);
router.get('/my', protect, getMyQuestions);
router.put('/:id/answer', protect, answerQuestion);

module.exports = router;
