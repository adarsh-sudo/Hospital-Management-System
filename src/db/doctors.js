const pool = require('../config/db');

async function createDoctor({ user_id, specialization, phone }) {
  const result = await pool.query(
    `INSERT INTO doctors (user_id, specialization, phone) VALUES ($1, $2, $3) RETURNING *`,
    [user_id, specialization || null, phone || null]
  );
  return result.rows[0];
}

async function getAllDoctors() {
  const result = await pool.query(
    `SELECT d.id, d.user_id, d.specialization, d.phone, d.is_available, d.available_slots,
            u.name, u.email
     FROM doctors d
     JOIN users u ON u.id = d.user_id
     ORDER BY u.name`
  );
  return result.rows;
}

async function getAvailableDoctors() {
  const result = await pool.query(
    `SELECT d.id, d.user_id, d.specialization, d.phone, d.is_available, d.available_slots,
            u.name, u.email
     FROM doctors d
     JOIN users u ON u.id = d.user_id
     WHERE d.is_available = true
     ORDER BY u.name`
  );
  return result.rows;
}

async function getDoctorById(id) {
  const result = await pool.query(
    `SELECT d.id, d.user_id, d.specialization, d.phone, d.is_available, d.available_slots,
            u.name, u.email
     FROM doctors d JOIN users u ON u.id = d.user_id WHERE d.id = $1`,
    [id]
  );
  return result.rows[0];
}

async function getDoctorByUserId(user_id) {
  const result = await pool.query(
    `SELECT d.id, d.user_id, d.specialization, d.phone, d.is_available, d.available_slots,
            u.name, u.email
     FROM doctors d JOIN users u ON u.id = d.user_id WHERE d.user_id = $1`,
    [user_id]
  );
  return result.rows[0];
}

async function updateAvailability(user_id, { is_available, available_slots, specialization, phone }) {
  const result = await pool.query(
    `UPDATE doctors SET is_available = $1, available_slots = $2, specialization = $3, phone = $4
     WHERE user_id = $5 RETURNING *`,
    [is_available, JSON.stringify(available_slots), specialization || null, phone || null, user_id]
  );
  return result.rows[0];
}

module.exports = { createDoctor, getAllDoctors, getAvailableDoctors, getDoctorById, getDoctorByUserId, updateAvailability };
