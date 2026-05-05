const pool = require('../config/db');

// @desc    Get all community posts
// @route   GET /api/community/posts
// @access  Private
const getPosts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, u.name as author_name, u.profile_picture_url,
             (SELECT count(*) FROM post_reactions r WHERE r.post_id = p.id) as reaction_count
      FROM community_posts p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Server error fetching posts' });
  }
};

// @desc    Create a new post
// @route   POST /api/community/posts
// @access  Private
const createPost = async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO community_posts (user_id, title, content) VALUES ($1, $2, $3) RETURNING *',
      [userId, title, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Server error creating post' });
  }
};

// @desc    React to a post
// @route   POST /api/community/posts/:id/react
// @access  Private
const reactToPost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;
  const { reaction_type } = req.body; // e.g., 'LIKE', 'SUPPORT'

  if (!reaction_type) {
    return res.status(400).json({ error: 'Reaction type is required' });
  }

  try {
    // Check if post exists
    const postRes = await pool.query('SELECT id FROM community_posts WHERE id = $1', [postId]);
    if (postRes.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Upsert reaction
    await pool.query(`
      INSERT INTO post_reactions (post_id, user_id, reaction_type) 
      VALUES ($1, $2, $3)
      ON CONFLICT (post_id, user_id, reaction_type) DO NOTHING
    `, [postId, userId, reaction_type]);

    res.json({ message: 'Reaction added' });
  } catch (error) {
    console.error('Error reacting to post:', error);
    res.status(500).json({ error: 'Server error reacting to post' });
  }
};

// @desc    Delete a post
// @route   DELETE /api/community/posts/:id
// @access  Private
const deletePost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;

  try {
    const postRes = await pool.query('SELECT * FROM community_posts WHERE id = $1', [postId]);
    if (postRes.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (req.user.role !== 'ADMIN' && postRes.rows[0].user_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    await pool.query('DELETE FROM community_posts WHERE id = $1', [postId]);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Server error deleting post' });
  }
};

module.exports = {
  getPosts,
  createPost,
  reactToPost,
  deletePost,
};
