const pool = require('../config/db');
const { scanForCrisis } = require('../services/moderationService');

// @desc    Get all professionals
// @route   GET /api/questions/professionals
// @access  Private
const getProfessionals = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.id, u.name, u.role, p.specialization, p.bio, p.profile_picture_url
      FROM users u
      JOIN psychologist_profiles p ON u.id = p.user_id
      WHERE u.role = 'PSYCHOLOGIST'
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching professionals:', error);
    res.status(500).json({ error: 'Server error fetching professionals' });
  }
};

// @desc    Submit an anonymous question
// @route   POST /api/questions
// @access  Private
const submitQuestion = async (req, res) => {
  const { professionalId, category, questionText } = req.body;
  const userId = req.user.id;

  if (!category || !questionText) {
    return res.status(400).json({ error: 'Category and question text are required' });
  }

  try {
    // AI Moderation Safety Net
    const isCrisis = await scanForCrisis(questionText);
    
    const result = await pool.query(
      `INSERT INTO anonymous_questions (user_id, professional_id, category, question_text) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [userId, professionalId, category, questionText]
    );

    const question = result.rows[0];

    if (isCrisis) {
      console.warn(`CRISIS DETECTED in question ${question.id}: Flagged for immediate professional review.`);
      // In a real app, you'd send an SMS/Email to the professional here
    }

    res.status(201).json(question);
  } catch (error) {
    console.error('Error submitting question:', error);
    res.status(500).json({ error: 'Server error submitting question' });
  }
};

// @desc    Get my questions
// @route   GET /api/questions/my
// @access  Private
const getMyQuestions = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(`
      SELECT q.*, u.name as professional_name
      FROM anonymous_questions q
      LEFT JOIN users u ON q.professional_id = u.id
      WHERE q.user_id = $1
      ORDER BY q.created_at DESC
    `, [userId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Server error fetching questions' });
  }
};

// @desc    Respond to a question (Professional Only)
// @route   PUT /api/questions/:id/answer
// @access  Private (Professional)
const answerQuestion = async (req, res) => {
  const questionId = req.params.id;
  const { answerText } = req.body;
  const professionalId = req.user.id;

  if (req.user.role !== 'PSYCHOLOGIST' && req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Only professionals can answer questions' });
  }

  try {
    const result = await pool.query(`
      UPDATE anonymous_questions 
      SET answer_text = $1, is_answered = true, answered_at = CURRENT_TIMESTAMP, professional_id = $2
      WHERE id = $3
      RETURNING *
    `, [answerText, professionalId, questionId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error answering question:', error);
    res.status(500).json({ error: 'Server error answering question' });
  }
};

module.exports = {
  getProfessionals,
  submitQuestion,
  getMyQuestions,
  answerQuestion,
};
