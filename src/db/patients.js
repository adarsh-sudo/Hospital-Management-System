const pool = require('../config/db');

async function getAllPatients() {
  const result = await pool.query('SELECT * FROM patients ORDER BY id');
  return result.rows;
}

async function getPatientById(id) {
  const result = await pool.query('SELECT * FROM patients WHERE id = $1', [id]);
  return result.rows[0];
}

async function createPatient({ name, dob, gender, phone, email }) {
  const result = await pool.query(
    'INSERT INTO patients (name, dob, gender, phone, email) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [name, dob, gender, phone, email]
  );
  return result.rows[0];
}

async function updatePatient(id, { name, dob, gender, phone, email }) {
  const result = await pool.query(
    'UPDATE patients SET name = $1, dob = $2, gender = $3, phone = $4, email = $5 WHERE id = $6 RETURNING *',
    [name, dob, gender, phone, email, id]
  );
  return result.rows[0];
}

async function deletePatient(id) {
  const result = await pool.query('DELETE FROM patients WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
}

module.exports = { getAllPatients, getPatientById, createPatient, updatePatient, deletePatient };
