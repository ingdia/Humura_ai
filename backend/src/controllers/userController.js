const pool = require('../config/db');

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, profile_picture_url, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Server error fetching users' });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, profile_picture_url, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Server error fetching user' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { name, profile_picture_url } = req.body;

  // Only allow users to update their own profile, unless they are an admin
  if (req.user.role !== 'ADMIN' && req.user.id !== parseInt(userId)) {
    return res.status(403).json({ error: 'Not authorized to update this profile' });
  }

  try {
    const result = await pool.query(
      'UPDATE users SET name = COALESCE($1, name), profile_picture_url = COALESCE($2, profile_picture_url) WHERE id = $3 RETURNING id, name, email, role, profile_picture_url',
      [name, profile_picture_url, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Server error updating user' });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private
const deleteUser = async (req, res) => {
  const userId = req.params.id;

  // Only allow users to delete their own profile, unless they are an admin
  if (req.user.role !== 'ADMIN' && req.user.id !== parseInt(userId)) {
    return res.status(403).json({ error: 'Not authorized to delete this profile' });
  }

  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Server error deleting user' });
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
