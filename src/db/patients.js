const pool = require('../config/db');

async function createPatient({ user_id }) {
  const result = await pool.query(
    'INSERT INTO patients (user_id) VALUES ($1) RETURNING *',
    [user_id]
  );
  return result.rows[0];
}

async function getPatientByUserId(user_id) {
  const result = await pool.query(
    `SELECT p.*, u.name, u.email
     FROM patients p
     JOIN users u ON u.id = p.user_id
     WHERE p.user_id = $1`,
    [user_id]
  );
  return result.rows[0];
}

async function updatePatientProfile(user_id, { dob, gender, phone }) {
  const result = await pool.query(
    `UPDATE patients SET dob = $1, gender = $2, phone = $3
     WHERE user_id = $4 RETURNING *`,
    [dob || null, gender || null, phone || null, user_id]
  );
  return result.rows[0];
}

module.exports = { createPatient, getPatientByUserId, updatePatientProfile };
