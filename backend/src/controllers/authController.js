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

    // If Psychologist, create an empty profile in psychologist_profiles
    if (assignedRole === 'PSYCHOLOGIST') {
      await pool.query(
        'INSERT INTO psychologist_profiles (user_id) VALUES ($1)',
        [user.id]
      );
    }

    res.status(201).json({
      ...user,
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

    res.json({
      ...user,
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
    
    // Insert anonymous user
    const newUser = await pool.query(
      'INSERT INTO users (is_anonymous, role) VALUES ($1, $2) RETURNING id, role, is_anonymous, created_at',
      [true, assignedRole]
    );

    const user = newUser.rows[0];

    res.status(201).json({
      ...user,
      token: generateToken(user.id, user.role),
    });
  } catch (error) {
    console.error('Error in registerAnonymous:', error);
    res.status(500).json({ error: 'Server error during anonymous registration' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  registerAnonymous,
};
