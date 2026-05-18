const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

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
