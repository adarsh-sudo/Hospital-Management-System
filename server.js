require('dotenv').config();
const express     = require('express');
const { requireAuth } = require('./src/middleware/auth');
const app         = express();

app.use(express.json());

// Public routes
app.use('/api/auth', require('./src/routes/auth'));

// Protected routes
app.use('/api/patients',        requireAuth, require('./src/routes/patients'));
app.use('/api/doctors',         requireAuth, require('./src/routes/doctors'));
app.use('/api/appointments',    requireAuth, require('./src/routes/appointments'));
app.use('/api/medical-records', requireAuth, require('./src/routes/medicalRecords'));
app.use('/api/departments',     requireAuth, require('./src/routes/departments'));

// Global error handler — ensures all errors return JSON, not HTML
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
