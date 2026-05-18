const pool = require('../config/db');

exports.sendMessage = async (req, res) => {
  try {
    const { receiver_id, content } = req.body;
    const sender_id = req.user.id;
    const result = await pool.query(
      'INSERT INTO messages (sender_id, receiver_id, content) VALUES ($1, $2, $3) RETURNING *',
      [sender_id, receiver_id, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getInbox = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(`
      WITH RankedMessages AS (
        SELECT 
          m.*,
          CASE WHEN sender_id = $1 THEN receiver_id ELSE sender_id END as other_user_id,
          ROW_NUMBER() OVER(PARTITION BY CASE WHEN sender_id = $1 THEN receiver_id ELSE sender_id END ORDER BY created_at DESC) as rn
        FROM messages m
        WHERE sender_id = $1 OR receiver_id = $1
      )
      SELECT 
        rm.*, 
        u.name as other_user_name,
        u.role as other_user_role,
        u.profile_picture_url,
        (SELECT COUNT(*) FROM messages WHERE receiver_id = $1 AND sender_id = rm.other_user_id AND is_read = false) as unread_count
      FROM RankedMessages rm
      JOIN users u ON u.id = rm.other_user_id
      JOIN psychologist_profiles pp ON u.id = pp.user_id
      WHERE rn = 1
      ORDER BY created_at DESC
    `, [userId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching inbox:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getThread = async (req, res) => {
  try {
    const userId = req.user.id;
    const { specialistId } = req.params;
    const result = await pool.query(`
      SELECT m.*, u.name as sender_name 
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)
      ORDER BY created_at ASC
    `, [userId, specialistId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching thread:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query('SELECT COUNT(*) as count FROM messages WHERE receiver_id = $1 AND is_read = false', [userId]);
    res.json({ count: parseInt(result.rows[0].count) });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const result = await pool.query('UPDATE messages SET is_read = true WHERE id = $1 AND receiver_id = $2 RETURNING *', [id, userId]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error marking as read:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
