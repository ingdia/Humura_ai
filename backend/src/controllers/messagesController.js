const pool = require('../config/db');

// Room ID is deterministic — same for both users regardless of who sends
const getRoomId = (id1, id2) =>
  `conversation_${Math.min(id1, id2)}_${Math.max(id1, id2)}`;

exports.sendMessage = async (req, res) => {
  try {
    const { receiver_id, content } = req.body;
    const sender_id = req.user.id;

    const result = await pool.query(
      'INSERT INTO messages (sender_id, receiver_id, content) VALUES ($1, $2, $3) RETURNING *',
      [sender_id, receiver_id, content]
    );

    const message = result.rows[0];

    // Emit to both participants in real time
    const io = req.app.get('io');
    if (io) {
      const roomId = getRoomId(sender_id, parseInt(receiver_id));
      io.to(roomId).emit('new_message', message);
    }

    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getInbox = async (req, res) => {
  try {
    const userId = req.user.id;
    // Fixed: removed incorrect JOIN on psychologist_profiles so both
    // patients and doctors can see their full inbox
    const result = await pool.query(
      `WITH RankedMessages AS (
        SELECT
          m.*,
          CASE WHEN sender_id = $1 THEN receiver_id ELSE sender_id END AS other_user_id,
          ROW_NUMBER() OVER(
            PARTITION BY CASE WHEN sender_id = $1 THEN receiver_id ELSE sender_id END
            ORDER BY created_at DESC
          ) AS rn
        FROM messages m
        WHERE sender_id = $1 OR receiver_id = $1
      )
      SELECT
        rm.*,
        CASE WHEN u.is_anonymous THEN 'Anonymous #' || u.id ELSE u.name END AS other_user_name,
        u.role         AS other_user_role,
        u.profile_picture_url,
        (
          SELECT COUNT(*)
          FROM messages
          WHERE receiver_id = $1 AND sender_id = rm.other_user_id AND is_read = false
        ) AS unread_count
      FROM RankedMessages rm
      JOIN users u ON u.id = rm.other_user_id
      WHERE rn = 1
      ORDER BY created_at DESC`,
      [userId]
    );
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
    const result = await pool.query(
      `SELECT m.*, u.name AS sender_name
       FROM messages m
       JOIN users u ON m.sender_id = u.id
       WHERE (sender_id = $1 AND receiver_id = $2)
          OR (sender_id = $2 AND receiver_id = $1)
       ORDER BY created_at ASC`,
      [userId, specialistId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching thread:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      'SELECT COUNT(*) AS count FROM messages WHERE receiver_id = $1 AND is_read = false',
      [userId]
    );
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
    const result = await pool.query(
      'UPDATE messages SET is_read = true WHERE id = $1 AND receiver_id = $2 RETURNING *',
      [id, userId]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error marking as read:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
