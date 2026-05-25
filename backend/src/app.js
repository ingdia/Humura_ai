const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const pool = require('./config/db');

const app = express();

// ── Auto-seed community groups ────────────────────────────────
const COMMUNITY_GROUPS = [
  { id: 1, name: 'My Voice',            description: 'A safe space to speak out without judgment.',              category: 'MENTAL_HEALTH' },
  { id: 2, name: 'Know Your Rights',    description: 'Learn about legal aid and social protection.',             category: 'MENTAL_HEALTH' },
  { id: 3, name: 'Support for Moms',    description: 'Guidance and love for teen mothers.',                      category: 'MENTAL_HEALTH' },
  { id: 4, name: 'Safe Protection',     description: 'Understanding contraception and safe choices.',            category: 'SRH' },
  { id: 5, name: 'Back to School',      description: 'Supporting teen mothers to continue education.',           category: 'MENTAL_HEALTH' },
  { id: 6, name: 'Skills & Vocations',  description: 'Learning tailoring, hair styling, and more.',             category: 'MENTAL_HEALTH' },
  { id: 7, name: 'Isange One Stop',     description: 'Connect with legal and medical experts.',                  category: 'MENTAL_HEALTH' },
  { id: 8, name: 'Big Sisters',         description: 'Peer mentorship for young girls.',                         category: 'MENTAL_HEALTH' },
];

(async () => {
  try {
    for (const g of COMMUNITY_GROUPS) {
      await pool.query(
        `INSERT INTO communities (id, name, description, category)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (id) DO NOTHING`,
        [g.id, g.name, g.description, g.category]
      );
    }
    // Keep the sequence ahead of our manual inserts
    await pool.query(`SELECT setval('communities_id_seq', 8, true)`);
  } catch (err) {
    console.warn('Community seed skipped:', err.message);
  }
})();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Humura AI API' });
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const psychologistRoutes = require('./routes/psychologistRoutes');
app.use('/api/psychologists', psychologistRoutes);

const appointmentRoutes = require('./routes/appointmentRoutes');
app.use('/api/appointments', appointmentRoutes);

const questionRoutes = require('./routes/questionRoutes');
app.use('/api/questions', questionRoutes);

const resourceRoutes = require('./routes/resourceRoutes');
app.use('/api/resources', resourceRoutes);

const moodRoutes = require('./routes/moodRoutes');
app.use('/api/mood', moodRoutes);

const communityRoutes = require('./routes/communityRoutes');
app.use('/api/community', communityRoutes);

const calmRoutes = require('./routes/calmRoutes');
app.use('/api/calm', calmRoutes);

const escalateRoutes = require('./routes/escalateRoutes');
app.use('/api/escalate', escalateRoutes);

const uploadRoutes = require('./routes/uploadRoutes');
app.use('/api/uploads', uploadRoutes);

const messagesRoutes = require('./routes/messagesRoutes');
app.use('/api/messages', messagesRoutes);

const clinicsRoutes = require('./routes/clinicsRoutes');
app.use('/api/clinics', clinicsRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 Route
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

module.exports = app;
