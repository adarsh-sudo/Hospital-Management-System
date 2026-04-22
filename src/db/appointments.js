const pool = require('../config/db');

async function createAppointment({ patient_id, doctor_id, slot_label, slot_time }) {
  const result = await pool.query(
    `INSERT INTO appointments (patient_id, doctor_id, slot_label, slot_time)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [patient_id, doctor_id, slot_label, slot_time]
  );
  return result.rows[0];
}

async function getAppointmentsByPatient(patient_id) {
  const result = await pool.query(
    `SELECT a.id, a.slot_label, a.slot_time, a.status, a.created_at,
            d.id AS doctor_id, d.specialization,
            u.name AS doctor_name
     FROM appointments a
     JOIN doctors d ON d.id = a.doctor_id
     JOIN users u ON u.id = d.user_id
     WHERE a.patient_id = $1
     ORDER BY a.created_at DESC`,
    [patient_id]
  );
  return result.rows;
}

async function getAppointmentsByDoctor(doctor_id) {
  const result = await pool.query(
    `SELECT a.id, a.slot_label, a.slot_time, a.status, a.created_at,
            p.id AS patient_id,
            u.name AS patient_name
     FROM appointments a
     JOIN patients p ON p.id = a.patient_id
     JOIN users u ON u.id = p.user_id
     WHERE a.doctor_id = $1
     ORDER BY a.created_at DESC`,
    [doctor_id]
  );
  return result.rows;
}

async function updateAppointmentStatus(id, status) {
  const result = await pool.query(
    `UPDATE appointments SET status = $1 WHERE id = $2 RETURNING *`,
    [status, id]
  );
  return result.rows[0];
}

module.exports = { createAppointment, getAppointmentsByPatient, getAppointmentsByDoctor, updateAppointmentStatus };
