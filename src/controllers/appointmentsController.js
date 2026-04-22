const db = require('../db/appointments');

const VALID_STATUSES = ['scheduled', 'completed', 'cancelled'];

async function getAllAppointments(req, res) {
  try {
    const appointments = await db.getAllAppointments();
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getAppointmentById(req, res) {
  try {
    const appointment = await db.getAppointmentById(req.params.id);
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createAppointment(req, res) {
  const { patient_id, doctor_id, date, status } = req.body;
  if (!patient_id) return res.status(400).json({ error: 'patient_id is required' });
  if (!doctor_id)  return res.status(400).json({ error: 'doctor_id is required' });
  if (!date)       return res.status(400).json({ error: 'date is required' });
  if (status && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` });
  }
  try {
    const appointment = await db.createAppointment({ patient_id, doctor_id, date, status });
    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateAppointment(req, res) {
  const { patient_id, doctor_id, date, status } = req.body;
  if (!patient_id) return res.status(400).json({ error: 'patient_id is required' });
  if (!doctor_id)  return res.status(400).json({ error: 'doctor_id is required' });
  if (!date)       return res.status(400).json({ error: 'date is required' });
  if (status && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` });
  }
  try {
    const appointment = await db.updateAppointment(req.params.id, { patient_id, doctor_id, date, status });
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteAppointment(req, res) {
  try {
    const appointment = await db.deleteAppointment(req.params.id);
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    res.json({ message: 'Appointment deleted', appointment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getAllAppointments, getAppointmentById, createAppointment, updateAppointment, deleteAppointment };
