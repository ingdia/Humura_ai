const pool = require('../config/db');

// @desc    Log a new mood
// @route   POST /api/mood/log
// @access  Private
const logMood = async (req, res) => {
  const { mood_score, notes } = req.body;
  const userId = req.user.id;

  if (mood_score === undefined || mood_score < 1 || mood_score > 5) {
    return res.status(400).json({ error: 'Valid mood_score (1-5) is required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO mood_logs (user_id, mood_score, notes) VALUES ($1, $2, $3) RETURNING *',
      [userId, mood_score, notes]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error logging mood:', error);
    res.status(500).json({ error: 'Server error logging mood' });
  }
};

// @desc    Get user's mood history
// @route   GET /api/mood/history
// @access  Private
const getMoodHistory = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      'SELECT id, mood_score, notes, created_at FROM mood_logs WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching mood history:', error);
    res.status(500).json({ error: 'Server error fetching mood history' });
  }
};

// @desc    Get user's mood trends (e.g., average mood past 7 days)
// @route   GET /api/mood/trends
// @access  Private
const getMoodTrends = async (req, res) => {
  const userId = req.user.id;

  try {
    // Simple trend analysis: average mood for the last 7 days grouped by day
    const result = await pool.query(`
      SELECT DATE(created_at) as date, ROUND(AVG(mood_score), 2) as average_score, COUNT(*) as logs_count
      FROM mood_logs 
      WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `, [userId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching mood trends:', error);
    res.status(500).json({ error: 'Server error fetching mood trends' });
  }
};

module.exports = {
  logMood,
  getMoodHistory,
  getMoodTrends,
};
