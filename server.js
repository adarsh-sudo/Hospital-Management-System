require('dotenv').config();
const express = require('express');
const app     = express();

app.use(express.json());

// Public
app.use('/api/auth',         require('./src/routes/auth'));

// Role-protected
app.use('/api/doctors',      require('./src/routes/doctors'));
app.use('/api/appointments', require('./src/routes/appointments'));
app.use('/api/patients',     require('./src/routes/patients'));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
