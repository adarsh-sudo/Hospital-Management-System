const pool = require('../config/db');

async function getAllAppointments() {
  const result = await pool.query('SELECT * FROM appointments ORDER BY id');
  return result.rows;
}

async function getAppointmentById(id) {
  const result = await pool.query('SELECT * FROM appointments WHERE id = $1', [id]);
  return result.rows[0];
}

async function createAppointment({ patient_id, doctor_id, date, status }) {
  const result = await pool.query(
    'INSERT INTO appointments (patient_id, doctor_id, date, status) VALUES ($1, $2, $3, $4) RETURNING *',
    [patient_id, doctor_id, date, status || 'scheduled']
  );
  return result.rows[0];
}

async function updateAppointment(id, { patient_id, doctor_id, date, status }) {
  const result = await pool.query(
    'UPDATE appointments SET patient_id = $1, doctor_id = $2, date = $3, status = $4 WHERE id = $5 RETURNING *',
    [patient_id, doctor_id, date, status, id]
  );
  return result.rows[0];
}

async function deleteAppointment(id) {
  const result = await pool.query('DELETE FROM appointments WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
}

module.exports = { getAllAppointments, getAppointmentById, createAppointment, updateAppointment, deleteAppointment };
