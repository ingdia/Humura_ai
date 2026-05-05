const pool = require('../config/db');

// @desc    Get available calm/VR scenes
// @route   GET /api/calm/scenes
// @access  Private
const getScenes = async (req, res) => {
  // In a real app, this might come from a DB table or external service
  const scenes = [
    { id: 1, name: 'Ocean Beach', description: 'A relaxing sunset at the beach', type: 'VR' },
    { id: 2, name: 'Forest Retreat', description: 'Peaceful sounds of a lush forest', type: 'AR' },
    { id: 3, name: 'Mountain Peak', description: 'Serene view from above the clouds', type: 'VR' },
  ];
  
  res.json(scenes);
};

// @desc    Start a calm session
// @route   POST /api/calm/session/start
// @access  Private
const startSession = async (req, res) => {
  const { scene_name } = req.body;
  const userId = req.user.id;

  if (!scene_name) {
    return res.status(400).json({ error: 'Scene name is required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO calm_sessions (user_id, scene_name, started_at) VALUES ($1, $2, CURRENT_TIMESTAMP) RETURNING *',
      [userId, scene_name]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error starting calm session:', error);
    res.status(500).json({ error: 'Server error starting calm session' });
  }
};

// @desc    End a calm session
// @route   POST /api/calm/session/end
// @access  Private
const endSession = async (req, res) => {
  const { session_id, duration_seconds } = req.body;
  const userId = req.user.id;

  if (!session_id || duration_seconds === undefined) {
    return res.status(400).json({ error: 'Session ID and duration_seconds are required' });
  }

  try {
    const sessionRes = await pool.query('SELECT * FROM calm_sessions WHERE id = $1', [session_id]);
    if (sessionRes.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (sessionRes.rows[0].user_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to end this session' });
    }

    const result = await pool.query(`
      UPDATE calm_sessions 
      SET ended_at = CURRENT_TIMESTAMP, duration_seconds = $1 
      WHERE id = $2 
      RETURNING *
    `, [duration_seconds, session_id]);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error ending calm session:', error);
    res.status(500).json({ error: 'Server error ending calm session' });
  }
};

module.exports = {
  getScenes,
  startSession,
  endSession,
};
