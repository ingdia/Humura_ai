const pool = require('../config/db');

// @desc    Get all approved psychologists
// @route   GET /api/psychologists
// @access  Public or Private (Patient)
const getPsychologists = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.id, u.name, u.email, u.profile_picture_url,
             p.bio, p.specialization, p.hourly_rate, p.availability, p.is_approved
      FROM users u
      JOIN psychologist_profiles p ON u.id = p.user_id
      WHERE u.role = 'PSYCHOLOGIST'
      ORDER BY p.is_approved DESC, u.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching psychologists:', error);
    res.status(500).json({ error: 'Server error fetching psychologists' });
  }
};

// @desc    Get psychologist by ID
// @route   GET /api/psychologists/:id
// @access  Public or Private
const getPsychologistById = async (req, res) => {
  const psychologistId = req.params.id;
  try {
    const result = await pool.query(`
      SELECT u.id, u.name, u.email, u.profile_picture_url, 
             p.bio, p.specialization, p.hourly_rate, p.availability, p.is_approved
      FROM users u
      JOIN psychologist_profiles p ON u.id = p.user_id
      WHERE u.id = $1 AND u.role = 'PSYCHOLOGIST'
    `, [psychologistId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Psychologist not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching psychologist:', error);
    res.status(500).json({ error: 'Server error fetching psychologist' });
  }
};

// @desc    Update psychologist availability
// @route   PUT /api/psychologists/:id/availability
// @access  Private (Psychologist only)
const updateAvailability = async (req, res) => {
  const psychologistId = req.params.id;
  const { availability, bio, specialization, hourly_rate } = req.body;

  // Ensure user is the psychologist updating their own profile
  if (req.user.id !== parseInt(psychologistId)) {
    return res.status(403).json({ error: 'Not authorized to update this profile' });
  }

  try {
    const result = await pool.query(`
      UPDATE psychologist_profiles 
      SET availability = COALESCE($1, availability),
          bio = COALESCE($2, bio),
          specialization = COALESCE($3, specialization),
          hourly_rate = COALESCE($4, hourly_rate)
      WHERE user_id = $5 
      RETURNING *
    `, [availability ? JSON.stringify(availability) : null, bio, specialization, hourly_rate, psychologistId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Psychologist profile not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating availability:', error);
    res.status(500).json({ error: 'Server error updating profile' });
  }
};

// @desc    Approve psychologist
// @route   PUT /api/psychologists/:id/approve
// @access  Private/Admin
const approvePsychologist = async (req, res) => {
  const psychologistId = req.params.id;

  try {
    const result = await pool.query(`
      UPDATE psychologist_profiles 
      SET is_approved = TRUE
      WHERE user_id = $1 
      RETURNING *
    `, [psychologistId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Psychologist profile not found' });
    }

    res.json({ message: 'Psychologist approved successfully', profile: result.rows[0] });
  } catch (error) {
    console.error('Error approving psychologist:', error);
    res.status(500).json({ error: 'Server error approving psychologist' });
  }
};

module.exports = {
  getPsychologists,
  getPsychologistById,
  updateAvailability,
  approvePsychologist,
};
