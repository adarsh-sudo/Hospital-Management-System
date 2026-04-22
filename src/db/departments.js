const pool = require('../config/db');

async function getAllDepartments() {
  const result = await pool.query('SELECT * FROM departments ORDER BY id');
  return result.rows;
}

async function getDepartmentById(id) {
  const result = await pool.query('SELECT * FROM departments WHERE id = $1', [id]);
  return result.rows[0];
}

async function createDepartment({ name }) {
  const result = await pool.query(
    'INSERT INTO departments (name) VALUES ($1) RETURNING *',
    [name]
  );
  return result.rows[0];
}

async function updateDepartment(id, { name }) {
  const result = await pool.query(
    'UPDATE departments SET name = $1 WHERE id = $2 RETURNING *',
    [name, id]
  );
  return result.rows[0];
}

async function deleteDepartment(id) {
  const result = await pool.query('DELETE FROM departments WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
}

module.exports = { getAllDepartments, getDepartmentById, createDepartment, updateDepartment, deleteDepartment };
