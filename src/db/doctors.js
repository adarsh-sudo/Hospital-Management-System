const pool = require('../config/db');

async function getAllDoctors() {
  const result = await pool.query('SELECT * FROM doctors ORDER BY id');
  return result.rows;
}

async function getDoctorById(id) {
  const result = await pool.query('SELECT * FROM doctors WHERE id = $1', [id]);
  return result.rows[0];
}

async function createDoctor({ name, specialization, phone, email, department_id }) {
  const result = await pool.query(
    'INSERT INTO doctors (name, specialization, phone, email, department_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [name, specialization, phone, email, department_id || null]
  );
  return result.rows[0];
}

async function updateDoctor(id, { name, specialization, phone, email, department_id }) {
  const result = await pool.query(
    'UPDATE doctors SET name = $1, specialization = $2, phone = $3, email = $4, department_id = $5 WHERE id = $6 RETURNING *',
    [name, specialization, phone, email, department_id || null, id]
  );
  return result.rows[0];
}

async function deleteDoctor(id) {
  const result = await pool.query('DELETE FROM doctors WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
}

module.exports = { getAllDoctors, getDoctorById, createDoctor, updateDoctor, deleteDoctor };
