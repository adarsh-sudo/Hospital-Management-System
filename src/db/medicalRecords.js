const pool = require('../config/db');

async function getAllMedicalRecords() {
  const result = await pool.query('SELECT * FROM medical_records ORDER BY id');
  return result.rows;
}

async function getMedicalRecordById(id) {
  const result = await pool.query('SELECT * FROM medical_records WHERE id = $1', [id]);
  return result.rows[0];
}

async function createMedicalRecord({ appointment_id, diagnosis, notes, prescriptionPath }) {
  const result = await pool.query(
    'INSERT INTO medical_records (appointment_id, diagnosis, notes, prescription_path) VALUES ($1, $2, $3, $4) RETURNING *',
    [appointment_id, diagnosis || null, notes || null, prescriptionPath || null]
  );
  return result.rows[0];
}

async function updateMedicalRecord(id, { appointment_id, diagnosis, notes, prescriptionPath }) {
  const result = await pool.query(
    `UPDATE medical_records
     SET appointment_id = $1, diagnosis = $2, notes = $3,
         prescription_path = COALESCE($4, prescription_path)
     WHERE id = $5 RETURNING *`,
    [appointment_id, diagnosis || null, notes || null, prescriptionPath || null, id]
  );
  return result.rows[0];
}

async function deleteMedicalRecord(id) {
  const result = await pool.query('DELETE FROM medical_records WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
}

module.exports = { getAllMedicalRecords, getMedicalRecordById, createMedicalRecord, updateMedicalRecord, deleteMedicalRecord };
