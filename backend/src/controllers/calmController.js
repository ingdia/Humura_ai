const pool = require('../config/db');

// @desc    Log a calm session
// @route   POST /api/calm/sessions
// @access  Private
const logCalmSession = async (req, res) => {
  const { sceneName, durationSeconds, moodAfterScore } = req.body;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `INSERT INTO calm_sessions (user_id, scene_name, duration_seconds, mood_after_score) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [userId, sceneName, durationSeconds, moodAfterScore]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error logging calm session:', error);
    res.status(500).json({ error: 'Server error logging calm session' });
  }
};

// @desc    Get my calm history
// @route   GET /api/calm/my
// @access  Private
const getMyCalmHistory = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      'SELECT * FROM calm_sessions WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching calm history:', error);
    res.status(500).json({ error: 'Server error fetching calm history' });
  }
};

module.exports = {
  logCalmSession,
  getMyCalmHistory,
};
