const db = require('../db/appointments');

async function bookAppointment(req, res) {
  const { doctor_id, slot_label, slot_time } = req.body;
  const patient_id = req.user.profile_id;

  if (!doctor_id)  return res.status(400).json({ error: 'doctor_id is required' });
  if (!slot_label) return res.status(400).json({ error: 'slot_label is required' });
  if (!slot_time)  return res.status(400).json({ error: 'slot_time is required' });

  try {
    const appointment = await db.createAppointment({ patient_id, doctor_id, slot_label, slot_time });
    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getMyAppointments(req, res) {
  try {
    const appointments = await db.getAppointmentsByPatient(req.user.profile_id);
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getRequests(req, res) {
  try {
    const appointments = await db.getAppointmentsByDoctor(req.user.profile_id);
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateStatus(req, res) {
  const { status } = req.body;
  const VALID = ['approved', 'rejected'];

  if (!status || !VALID.includes(status)) {
    return res.status(400).json({ error: 'status must be approved or rejected' });
  }

  try {
    const appointment = await db.updateAppointmentStatus(req.params.id, status);
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { bookAppointment, getMyAppointments, getRequests, updateStatus };
