const pool = require('../config/db');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if user exists
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Default role is PATIENT if not provided or invalid
    const assignedRole = ['PATIENT', 'PSYCHOLOGIST', 'ADMIN'].includes(role) ? role : 'PATIENT';

    // Insert user
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, profile_picture_url, created_at',
      [name, email, hashedPassword, assignedRole]
    );

    const user = newUser.rows[0];

    // If Psychologist, create a profile in psychologist_profiles
    if (assignedRole === 'PSYCHOLOGIST') {
      const { specialization } = req.body;
      await pool.query(
        'INSERT INTO psychologist_profiles (user_id, specialization, is_approved) VALUES ($1, $2, TRUE)',
        [user.id, specialization ?? null]
      );
    }

    res.status(201).json({
      ...user,
      specialization: assignedRole === 'PSYCHOLOGIST' ? (req.body.specialization ?? null) : null,
      token: generateToken(user.id, user.role),
    });
  } catch (error) {
    console.error('Error in registerUser:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check for user email
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Don't send the password hash back
    delete user.password_hash;

    // Fetch specialization for psychologists
    let specialization = null;
    if (user.role === 'PSYCHOLOGIST') {
      const profRes = await pool.query(
        'SELECT specialization FROM psychologist_profiles WHERE user_id = $1',
        [user.id]
      );
      if (profRes.rows.length > 0) specialization = profRes.rows[0].specialization;
    }

    res.json({
      ...user,
      specialization,
      token: generateToken(user.id, user.role),
    });
  } catch (error) {
    console.error('Error in loginUser:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    // req.user is set in authMiddleware
    res.json(req.user);
  } catch (error) {
    console.error('Error in getMe:', error);
    res.status(500).json({ error: 'Server error getting profile' });
  }
};

// @desc    Register an anonymous user
// @route   POST /api/auth/anonymous
// @access  Public
const registerAnonymous = async (req, res) => {
  try {
    const assignedRole = 'PATIENT';
    
    // Insert anonymous user (name assigned after we know the id)
    const newUser = await pool.query(
      'INSERT INTO users (is_anonymous, role) VALUES ($1, $2) RETURNING id, role, is_anonymous, created_at',
      [true, assignedRole]
    );

    const user = newUser.rows[0];

    // Generate a 4-digit zero-padded anonymous ID, e.g. humura.0042
    const paddedId = String(user.id).padStart(4, '0');
    const anonName = `humura.${paddedId}`;
    await pool.query('UPDATE users SET name = $1 WHERE id = $2', [anonName, user.id]);

    res.status(201).json({
      ...user,
      name: anonName,
      token: generateToken(user.id, user.role),
    });
  } catch (error) {
    console.error('Error in registerAnonymous:', error);
    res.status(500).json({ error: 'Server error during anonymous registration' });
  }
};

// @desc    Login with anonymous humura ID (e.g. humura.0042)
// @route   POST /api/auth/anonymous-login
// @access  Public
const loginAnonymous = async (req, res) => {
  const { humura_id } = req.body; // e.g. "humura.0042"
  if (!humura_id) return res.status(400).json({ error: 'humura_id is required' });

  try {
    const result = await pool.query(
      'SELECT id, name, role, is_anonymous, created_at FROM users WHERE name = $1 AND is_anonymous = TRUE',
      [humura_id.trim()]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'ID not found. Check and try again.' });
    }
    const user = result.rows[0];
    res.json({ ...user, token: generateToken(user.id, user.role) });
  } catch (error) {
    console.error('Error in loginAnonymous:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  registerAnonymous,
  loginAnonymous,
};
