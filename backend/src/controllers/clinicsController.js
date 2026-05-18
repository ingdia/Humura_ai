const pool = require('../config/db');

exports.getAllClinics = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clinics ORDER BY name ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching clinics:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getNearbyClinics = async (req, res) => {
  try {
    const { province } = req.query;
    let query = 'SELECT * FROM clinics';
    let params = [];
    if (province) {
      query += ' WHERE province = $1';
      params.push(province);
    }
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching nearby clinics:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getClinicDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM clinics WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Clinic not found' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching clinic:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getClinicSpecialists = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT u.id, u.name, u.email, u.profile_picture_url, u.role, p.bio, p.specialization, p.hourly_rate
      FROM users u
      JOIN psychologist_profiles p ON u.id = p.user_id
      WHERE p.clinic_id = $1
    `, [id]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching clinic specialists:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.registerClinic = async (req, res) => {
  try {
    const { name, province, district, address, phone, type, latitude, longitude } = req.body;
    const result = await pool.query(`
      INSERT INTO clinics (name, province, district, address, phone, type, latitude, longitude)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
    `, [name, province, district, address, phone, type, latitude, longitude]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error registering clinic:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.approveClinic = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('UPDATE clinics SET is_approved = true, is_onboarded = true WHERE id = $1 RETURNING *', [id]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error approving clinic:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
