const pool = require('../config/db');

// @desc    Get all courses (grouped by category)
// @route   GET /api/resources/courses
// @access  Private
const getCourses = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM courses ORDER BY category, title
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Server error fetching courses' });
  }
};

// @desc    Get lessons for a course
// @route   GET /api/resources/courses/:id/lessons
// @access  Private
const getLessons = async (req, res) => {
  const courseId = req.params.id;
  try {
    const result = await pool.query(`
      SELECT * FROM lessons WHERE course_id = $1 ORDER BY order_index
    `, [courseId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    res.status(500).json({ error: 'Server error fetching lessons' });
  }
};

// @desc    Get nearby health centers
// @route   GET /api/resources/health-centers
// @access  Private
const getHealthCenters = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM health_centers ORDER BY name
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching health centers:', error);
    res.status(500).json({ error: 'Server error fetching health centers' });
  }
};

module.exports = {
  getCourses,
  getLessons,
  getHealthCenters,
};
