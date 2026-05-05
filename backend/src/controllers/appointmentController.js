const pool = require('../config/db');

// @desc    Book a new session
// @route   POST /api/appointments
// @access  Private (Patient)
const bookAppointment = async (req, res) => {
  const { psychologist_id, scheduled_at } = req.body;
  const patient_id = req.user.id;

  try {
    const result = await pool.query(`
      INSERT INTO appointments (patient_id, psychologist_id, scheduled_at)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [patient_id, psychologist_id, scheduled_at]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({ error: 'Server error booking appointment' });
  }
};

// @desc    Get all sessions for logged in user
// @route   GET /api/appointments
// @access  Private
const getAppointments = async (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;

  try {
    let query;
    if (role === 'PSYCHOLOGIST') {
      query = `
        SELECT a.*, u.name as patient_name, u.email as patient_email 
        FROM appointments a
        JOIN users u ON a.patient_id = u.id
        WHERE a.psychologist_id = $1
        ORDER BY a.scheduled_at DESC
      `;
    } else if (role === 'PATIENT') {
      query = `
        SELECT a.*, u.name as psychologist_name, u.email as psychologist_email 
        FROM appointments a
        JOIN users u ON a.psychologist_id = u.id
        WHERE a.patient_id = $1
        ORDER BY a.scheduled_at DESC
      `;
    } else { // ADMIN gets all
      query = `SELECT * FROM appointments ORDER BY scheduled_at DESC`;
      const result = await pool.query(query);
      return res.json(result.rows);
    }

    const result = await pool.query(query, [userId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Server error fetching appointments' });
  }
};

// @desc    Update session status
// @route   PUT /api/appointments/:id/status
// @access  Private
const updateAppointmentStatus = async (req, res) => {
  const appointmentId = req.params.id;
  const { status } = req.body; // PENDING, CONFIRMED, CANCELLED, COMPLETED
  const userId = req.user.id;

  try {
    // Check if user is part of the appointment
    const appointmentRes = await pool.query('SELECT * FROM appointments WHERE id = $1', [appointmentId]);
    if (appointmentRes.rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const appointment = appointmentRes.rows[0];
    if (req.user.role !== 'ADMIN' && appointment.patient_id !== userId && appointment.psychologist_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this appointment' });
    }

    const result = await pool.query(`
      UPDATE appointments 
      SET status = $1 
      WHERE id = $2 
      RETURNING *
    `, [status, appointmentId]);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({ error: 'Server error updating status' });
  }
};

// @desc    Cancel/Delete session
// @route   DELETE /api/appointments/:id
// @access  Private
const deleteAppointment = async (req, res) => {
  const appointmentId = req.params.id;
  const userId = req.user.id;

  try {
    const appointmentRes = await pool.query('SELECT * FROM appointments WHERE id = $1', [appointmentId]);
    if (appointmentRes.rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const appointment = appointmentRes.rows[0];
    if (req.user.role !== 'ADMIN' && appointment.patient_id !== userId && appointment.psychologist_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this appointment' });
    }

    await pool.query('DELETE FROM appointments WHERE id = $1', [appointmentId]);
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ error: 'Server error deleting appointment' });
  }
};

// @desc    Get Jitsi Video Link
// @route   GET /api/appointments/:id/video-link
// @access  Private
const getVideoLink = async (req, res) => {
  const appointmentId = req.params.id;
  const userId = req.user.id;

  try {
    const appointmentRes = await pool.query('SELECT * FROM appointments WHERE id = $1', [appointmentId]);
    if (appointmentRes.rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const appointment = appointmentRes.rows[0];
    if (req.user.role !== 'ADMIN' && appointment.patient_id !== userId && appointment.psychologist_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to access this link' });
    }

    // Check if link already generated
    if (appointment.meet_link) {
      return res.json({ meet_link: appointment.meet_link });
    }

    // Generate link
    const meetLink = `https://meet.jit.si/humura-ai-session-${appointmentId}-${Math.random().toString(36).substring(7)}`;

    // Save link to DB
    const updateRes = await pool.query(`
      UPDATE appointments SET meet_link = $1 WHERE id = $2 RETURNING *
    `, [meetLink, appointmentId]);

    res.json({ meet_link: meetLink });
  } catch (error) {
    console.error('Error getting video link:', error);
    res.status(500).json({ error: 'Server error getting video link' });
  }
};

module.exports = {
  bookAppointment,
  getAppointments,
  updateAppointmentStatus,
  deleteAppointment,
  getVideoLink,
};
