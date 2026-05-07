const pool = require('../config/db');
const { scanForCrisis } = require('../services/moderationService');

// @desc    Get all community posts for a specific group
// @route   GET /api/community/:groupId/posts
// @access  Private
const getPosts = async (req, res) => {
  const { groupId } = req.params;

  try {
    const result = await pool.query(`
      SELECT p.*, 
             CASE WHEN u.is_anonymous THEN 'Anonymous member' ELSE u.name END as author_name,
             CASE WHEN u.is_anonymous THEN NULL ELSE u.profile_picture_url END as profile_picture_url,
             (SELECT count(*) FROM post_reactions r WHERE r.post_id = p.id) as reaction_count
      FROM community_posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.community_id = $1
      ORDER BY p.created_at DESC
    `, [groupId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Server error fetching posts' });
  }
};

// @desc    Create a new post in a group
// @route   POST /api/community/:groupId/posts
// @access  Private
const createPost = async (req, res) => {
  const { groupId } = req.params;
  const { content, tag } = req.body;
  const userId = req.user.id;

  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }

  try {
    // AI Moderation Safety Net
    const isCrisis = await scanForCrisis(content);
    
    const result = await pool.query(
      'INSERT INTO community_posts (community_id, user_id, content, tag, is_flagged) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [groupId, userId, content, tag, isCrisis]
    );

    const post = result.rows[0];

    // If it's a crisis, we could also log it elsewhere or notify an admin immediately
    if (isCrisis) {
      console.warn(`CRISIS DETECTED in post ${post.id}: Content flagged for professional review.`);
    }

    res.status(201).json(post);
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
  const { reaction_type } = req.body; // heart, hug, etc.

  if (!reaction_type) {
    return res.status(400).json({ error: 'Reaction type is required' });
  }

  try {
    const postRes = await pool.query('SELECT id FROM community_posts WHERE id = $1', [postId]);
    if (postRes.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

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

// @desc    Get all community groups
// @route   GET /api/community/groups
// @access  Private
const getGroups = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, u.name as professional_name
      FROM communities c
      LEFT JOIN users u ON c.professional_id = u.id
      ORDER BY c.category, c.name
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ error: 'Server error fetching groups' });
  }
};

module.exports = {
  getPosts,
  createPost,
  reactToPost,
  deletePost,
  getGroups,
};
